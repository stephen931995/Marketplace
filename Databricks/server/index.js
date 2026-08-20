import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host:     process.env.PGHOST     || '172.190.194.46',
  port:     Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'marketplace',
  user:     process.env.PGUSER     || 'root',
  password: process.env.PGPASSWORD || 'Systech123',
});

// Ensure all databricks_ tables exist (safe: IF NOT EXISTS)
await pool.query(`
  CREATE TABLE IF NOT EXISTS databricks_reviews (
    id          SERIAL PRIMARY KEY,
    app_id      VARCHAR(100)  NOT NULL,
    user_name   VARCHAR(255)  NOT NULL,
    user_email  VARCHAR(255)  NOT NULL,
    review_text TEXT          NOT NULL,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS databricks_app_requests (
    id          SERIAL PRIMARY KEY,
    user_name   VARCHAR(255)  NOT NULL,
    user_email  VARCHAR(255)  NOT NULL,
    app_id      VARCHAR(100)  NOT NULL,
    app_name    VARCHAR(255)  NOT NULL,
    status      VARCHAR(50)   NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS databricks_users (
    user_id       VARCHAR(100) PRIMARY KEY,
    name          VARCHAR(255),
    email         VARCHAR(255),
    created_at    TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
    is_admin      BOOLEAN      DEFAULT false,
    is_superadmin BOOLEAN      DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS databricks_user_activity_logs (
    id             SERIAL PRIMARY KEY,
    user_id        VARCHAR(100)  NOT NULL,
    name           VARCHAR(255),
    email          VARCHAR(255),
    opened_at      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_seconds INTEGER       NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS databricks_guest_requests (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    work_email   VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );
`);

// Guest identity columns on the activity log (safe: IF NOT EXISTS).
// Guests all share one Azure AD account, so these carry the real person's
// details as captured by the in-app guest identity popup.
await pool.query(`
  ALTER TABLE databricks_user_activity_logs
    ADD COLUMN IF NOT EXISTS is_guest    BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS guest_name  VARCHAR(255),
    ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255);
`);

// Create the updated_at trigger on databricks_users if not already present
await pool.query(`
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger
      WHERE tgname = 'databricks_set_updated_at'
        AND tgrelid = 'public.databricks_users'::regclass
    ) THEN
      CREATE TRIGGER databricks_set_updated_at
        BEFORE UPDATE ON public.databricks_users
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
  END;
  $$;
`);

const app = express();
app.use(cors());
app.use(express.json());

/* ─────────────────────────────────────
   REVIEWS
───────────────────────────────────── */

/* GET /api/reviews/:appId */
app.get('/api/reviews/:appId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, user_name, user_email, review_text, created_at
         FROM databricks_reviews
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

/* POST /api/reviews */
app.post('/api/reviews', async (req, res) => {
  const { appId, userName, userEmail, reviewText } = req.body;
  if (!appId || !userName || !userEmail || !reviewText) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO databricks_reviews (app_id, user_name, user_email, review_text)
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

/* ─────────────────────────────────────
   USERS
───────────────────────────────────── */

/* POST /api/users/sync */
app.post('/api/users/sync', async (req, res) => {
  const { user_id, name, email } = req.body;
  if (!user_id || !email) {
    return res.status(400).json({ error: 'Missing required user_id or email fields' });
  }
  try {
    const normalizedUserId = user_id.toLowerCase();
    const normalizedEmail  = email.toLowerCase();

    const existing = await pool.query(
      `SELECT user_id FROM databricks_users WHERE LOWER(user_id) = $1 LIMIT 1`,
      [normalizedUserId]
    );

    let rows;
    if (existing.rows.length > 0) {
      const storedUserId = existing.rows[0].user_id;
      ({ rows } = await pool.query(
        `UPDATE databricks_users
            SET name = $1, email = $2
          WHERE user_id = $3
            AND (name IS DISTINCT FROM $1 OR email IS DISTINCT FROM $2)
          RETURNING *`,
        [name, normalizedEmail, storedUserId]
      ));

      if (rows.length === 0) {
        ({ rows } = await pool.query(
          `SELECT * FROM databricks_users WHERE user_id = $1`,
          [storedUserId]
        ));
      }
    } else {
      ({ rows } = await pool.query(
        `INSERT INTO databricks_users (user_id, name, email)
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

/* POST /api/users/activity — log a new session */
app.post('/api/users/activity', async (req, res) => {
  const { user_id, name, email, is_guest, guest_name, guest_email } = req.body;
  if (!user_id || !email) {
    return res.status(400).json({ error: 'Missing required user_id or email fields' });
  }
  // Guest sessions must carry the identity captured by the in-app popup —
  // without it the row is indistinguishable from every other guest session.
  const isGuest = Boolean(is_guest);
  if (isGuest && (!guest_name || !guest_email)) {
    return res.status(400).json({ error: 'Guest sessions require guest_name and guest_email' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO databricks_user_activity_logs (user_id, name, email, is_guest, guest_name, guest_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        user_id.toLowerCase(),
        name,
        email.toLowerCase(),
        isGuest,
        isGuest ? String(guest_name).trim() : null,
        isGuest ? String(guest_email).trim().toLowerCase() : null,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log user activity' });
  }
});

/* POST /api/users/activity/:id — increment active_seconds (sendBeacon on hide/close) */
app.post('/api/users/activity/:id', async (req, res) => {
  const { id } = req.params;
  const { active_seconds } = req.body;
  if (active_seconds === undefined || isNaN(Number(active_seconds))) {
    return res.status(400).json({ error: 'Missing or invalid active_seconds' });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE databricks_user_activity_logs
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

/* GET /api/users/activity — list sessions by date range */
app.get('/api/users/activity', async (req, res) => {
  try {
    const { fromDate, toDate, name } = req.query;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    const from = fromDate || monday.toISOString().split('T')[0];
    const to   = toDate   || now.toISOString().split('T')[0];

    const params = [from, to];
    let query = `
      SELECT id, user_id, name, email, opened_at, active_seconds,
             is_guest, guest_name, guest_email
        FROM databricks_user_activity_logs
       WHERE opened_at::date >= $1::date
         AND opened_at::date <= $2::date
    `;

    if (name) {
      params.push(`%${name.toLowerCase()}%`);
      query += ` AND (LOWER(name) LIKE $${params.length}
                   OR LOWER(email) LIKE $${params.length}
                   OR LOWER(guest_name) LIKE $${params.length}
                   OR LOWER(guest_email) LIKE $${params.length})`;
    }

    query += ` ORDER BY opened_at DESC`;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

/* ─────────────────────────────────────
   APP REQUESTS
───────────────────────────────────── */

/* POST /api/requests */
app.post('/api/requests', async (req, res) => {
  const { userName, userEmail, appId, appName } = req.body;
  if (!userName || !userEmail || !appId || !appName) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO databricks_app_requests (user_name, user_email, app_id, app_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userName, userEmail, appId, appName]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

/* GET /api/requests */
app.get('/api/requests', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM databricks_app_requests ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

/* PUT /api/requests/:id */
app.put('/api/requests/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE databricks_app_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

/* GET /api/access/:email */
app.get('/api/access/:email', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT app_id, status FROM databricks_app_requests WHERE user_email = $1`,
      [req.params.email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch access' });
  }
});

/* ─────────────────────────────────────
   GUEST ACCESS REQUESTS
───────────────────────────────────── */

// Personal / free + disposable email domains that are NOT accepted as a work email
const BLOCKED_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk', 'ymail.com',
  'rocketmail.com', 'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'gmx.com', 'gmx.net', 'mail.com',
  'proton.me', 'protonmail.com', 'pm.me', 'zoho.com', 'yandex.com', 'yandex.ru',
  'tutanota.com', 'fastmail.com', 'hey.com', 'rediffmail.com', 'hushmail.com',
  'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'sharklasers.com',
  'trashmail.com', 'yopmail.com', 'temp-mail.org', 'tempmail.com', 'getnada.com',
  'dispostable.com', 'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mailnesia.com',
  'mintemail.com', 'mohmal.com', 'emailondeck.com', 'spambog.com', 'mailcatch.com',
  'moakt.com', 'discard.email', 'grr.la', 'mvrht.com',
]);

const isWorkEmail = (email) => {
  const value = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
  return !BLOCKED_EMAIL_DOMAINS.has(value.split('@')[1]);
};

/* POST /api/guest-requests — store a guest access requester */
app.post('/api/guest-requests', async (req, res) => {
  const { name, workEmail, companyName } = req.body;
  if (!name || !workEmail || !companyName) {
    return res.status(400).json({ error: 'Missing required fields: name, workEmail, companyName' });
  }
  if (!isWorkEmail(workEmail)) {
    return res.status(400).json({ error: 'A valid work email is required (personal/disposable addresses are not accepted)' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO databricks_guest_requests (name, work_email, company_name)
       VALUES ($1, $2, $3) RETURNING *`,
      [name.trim(), workEmail.trim().toLowerCase(), companyName.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save guest request' });
  }
});

/* GET /api/guest-requests — list guest requesters (optional date range + search) */
app.get('/api/guest-requests', async (req, res) => {
  try {
    const { fromDate, toDate, q } = req.query;
    const params = [];
    let query = `SELECT id, name, work_email, company_name, created_at
                   FROM databricks_guest_requests`;
    const where = [];

    if (fromDate) { params.push(fromDate); where.push(`created_at::date >= $${params.length}::date`); }
    if (toDate)   { params.push(toDate);   where.push(`created_at::date <= $${params.length}::date`); }
    if (q) {
      params.push(`%${String(q).toLowerCase()}%`);
      where.push(`(LOWER(name) LIKE $${params.length} OR LOWER(work_email) LIKE $${params.length} OR LOWER(company_name) LIKE $${params.length})`);
    }
    if (where.length) query += ` WHERE ${where.join(' AND ')}`;
    query += ` ORDER BY created_at DESC`;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch guest requests' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));


