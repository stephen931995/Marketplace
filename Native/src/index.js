import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || '172.190.194.46',
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'marketplace',
  user: process.env.PGUSER || 'root',
  password: process.env.PGPASSWORD || 'Systech123',
});

// Ensure the reviews table exists
await pool.query(`
  CREATE TABLE IF NOT EXISTS reviews (
    id          SERIAL PRIMARY KEY,
    app_id      VARCHAR(100)  NOT NULL,
    user_name   VARCHAR(255)  NOT NULL,
    user_email  VARCHAR(255)  NOT NULL,
    review_text TEXT          NOT NULL,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS app_requests (
    id          SERIAL PRIMARY KEY,
    user_name   VARCHAR(255)  NOT NULL,
    user_email  VARCHAR(255)  NOT NULL,
    app_id      VARCHAR(100)  NOT NULL,
    app_name    VARCHAR(255)  NOT NULL,
    status      VARCHAR(50)   NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS user_activity_logs (
    id             SERIAL PRIMARY KEY,
    user_id        VARCHAR(100)  NOT NULL,
    name           VARCHAR(255),
    email          VARCHAR(255),
    opened_at      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_seconds INTEGER       NOT NULL DEFAULT 0
  );
  ALTER TABLE user_activity_logs ADD COLUMN IF NOT EXISTS active_seconds INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_superadmin bool DEFAULT false NULL;
`);

const app = express();
app.use(cors());
app.use(express.json());

/* ── GET /api/reviews/:appId ── */
app.get('/api/reviews/:appId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, user_name, user_email, review_text, created_at
         FROM reviews
        WHERE app_id = $1
        ORDER BY created_at DESC`,
      [req.params.appId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/* ── POST /api/reviews ── */
app.post('/api/reviews', async (req, res) => {
  const { appId, userName, userEmail, reviewText } = req.body;
  if (!appId || !userName || !userEmail || !reviewText) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO reviews (app_id, user_name, user_email, review_text)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [appId, userName, userEmail, reviewText],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save review' });
  }
});


/* ── POST /api/users/sync ── */
app.post('/api/users/sync', async (req, res) => {
  const { user_id, name, email } = req.body;
  if (!user_id || !email) {
    return res.status(400).json({ error: 'Missing required user_id or email fields' });
  }
  try {
    const normalizedUserId = user_id.toLowerCase();
    const normalizedEmail  = email.toLowerCase();

    // Case-insensitive lookup for existing user
    const existing = await pool.query(
      `SELECT user_id FROM public.users WHERE LOWER(user_id) = $1 LIMIT 1`,
      [normalizedUserId]
    );

    let rows;
    if (existing.rows.length > 0) {
      // User already exists — update by their stored user_id (handles mixed-case legacy data)
      // Only update if name or email actually changed, so updated_at is not touched on every login
      const storedUserId = existing.rows[0].user_id;
      ({ rows } = await pool.query(
        `UPDATE public.users
            SET name = $1, email = $2
          WHERE user_id = $3
            AND (name IS DISTINCT FROM $1 OR email IS DISTINCT FROM $2)
          RETURNING *`,
        [name, normalizedEmail, storedUserId]
      ));

      // Nothing changed — fetch the existing row to return it
      if (rows.length === 0) {
        ({ rows } = await pool.query(
          `SELECT * FROM public.users WHERE user_id = $1`,
          [storedUserId]
        ));
      }
    } else {
      // Brand-new user — insert with normalised (lowercase) identifiers
      ({ rows } = await pool.query(
        `INSERT INTO public.users (user_id, name, email)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [normalizedUserId, name, normalizedEmail]
      ));
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
});

/* ── POST /api/users/activity ── */
app.post('/api/users/activity', async (req, res) => {
  const { user_id, name, email } = req.body;
  if (!user_id || !email) {
    return res.status(400).json({ error: 'Missing required user_id or email fields' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO user_activity_logs (user_id, name, email)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id.toLowerCase(), name, email.toLowerCase()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log user activity' });
  }
});

/* ── POST /api/users/activity/:id ── (called via sendBeacon on tab hide/close) */
app.post('/api/users/activity/:id', async (req, res) => {
  const { id } = req.params;
  const { active_seconds } = req.body;
  if (active_seconds === undefined || isNaN(Number(active_seconds))) {
    return res.status(400).json({ error: 'Missing or invalid active_seconds' });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE user_activity_logs
          SET active_seconds = active_seconds + $1
        WHERE id = $2
        RETURNING *`,
      [Math.max(0, Math.floor(Number(active_seconds))), id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Log not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update active time' });
  }
});

/* ── GET /api/users/activity ── */
app.get('/api/users/activity', async (req, res) => {
  try {
    const { fromDate, toDate, name } = req.query;

    // Default to current week: Monday → today
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    const from = fromDate || monday.toISOString().split('T')[0];
    const to   = toDate   || now.toISOString().split('T')[0];

    const params = [from, to];
    let query = `
      SELECT id, user_id, name, email, opened_at, active_seconds
        FROM user_activity_logs
       WHERE opened_at::date >= $1::date
         AND opened_at::date <= $2::date
    `;

    if (name) {
      params.push(`%${name.toLowerCase()}%`);
      query += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`;
    }

    query += ` ORDER BY opened_at DESC`;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

/* ── POST /api/requests ── */
app.post('/api/requests', async (req, res) => {
  const { userName, userEmail, appId, appName } = req.body;
  if (!userName || !userEmail || !appId || !appName) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO app_requests (user_name, user_email, app_id, app_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userName, userEmail, appId, appName]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

/* ── GET /api/requests ── */
app.get('/api/requests', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM app_requests ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

/* ── PUT /api/requests/:id ── */
app.put('/api/requests/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE app_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

/* ── GET /api/access/:email ── */
app.get('/api/access/:email', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT app_id, status FROM app_requests WHERE user_email = $1`,
      [req.params.email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch access' });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));



