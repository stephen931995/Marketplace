import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { DefaultAzureCredential } from '@azure/identity';

const { Pool } = pg;

// All connection details come from the environment — no credentials in source.
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

const chatPool = new Pool({
  host: process.env.CHAT_PGHOST,
  port: Number(process.env.CHAT_PGPORT) || 5432,
  database: process.env.CHAT_PGDATABASE,
  user: process.env.CHAT_PGUSER,
  password: process.env.CHAT_PGPASSWORD,
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
    // Case-insensitive: rows may pre-date email normalisation, and a case
    // mismatch here would silently hide an already-approved app from the user.
    const { rows } = await pool.query(
      `SELECT app_id, status FROM app_requests WHERE LOWER(user_email) = LOWER($1)`,
      [req.params.email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch access' });
  }
});

/* ──────────────────────────────────────────────────────────────────────────
   Legacy → current application names.
   Several source PDFs were written before apps were renamed, so their body
   text still says "VetAI", "SysMart", etc. Retrieval surfaces that raw text,
   so the formatting model is told to normalise it. Keep in sync with data.ts.
────────────────────────────────────────────────────────────────────────── */
const NAME_ALIASES = [
  ['VetAI', 'InterviewIQ™'],
  ['SysMart', 'RetailIQ™'],
  ['SysRank', 'SkillIQ™'],
  ['CarbonCast', 'SustainIQ™'],
  ['EcoVision', 'EcoLensAI™'],
  ['CCTV Analytics', 'VisionIQ™'],
  ['AICCTV', 'VisionIQ™'],
  ['aiChef', 'Digital Twin AI Chef™'],
  ['Hotel Concierge', 'ConciergeAI™'],
  ['Intelligent Promotions', 'PromoIQ™'],
  // Snowflake apps whose source documents were written under working titles.
  ['LexSphere Counsel AI', 'Legal AI Counsellor'],
  ['LexSphere', 'Legal AI Counsellor'],
  ['Customer Health Intelligence', 'Customer Accounts Intelligence'],
];

const ALIAS_INSTRUCTION =
  'The source documents sometimes use outdated product names. Always use the ' +
  'current name instead, and never mention the old one: ' +
  NAME_ALIASES.map(([o, n]) => `"${o}" is now ${n}`).join('; ') + '.';

/* The prompt above is a hint, not a guarantee — the model may still echo a
   legacy name. This pass is the actual enforcement: a deterministic rewrite of
   the outgoing text, so a stale name can never reach the user. */
const ALIAS_RULES = NAME_ALIASES.map(([old, current]) => ({
  // \b won't work against names ending in a symbol, so guard on word chars.
  re: new RegExp(`(?<![\\w])${old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w])`, 'gi'),
  current,
}));
/** Longest legacy name — how much tail must be withheld while streaming. */
const ALIAS_MAX_LEN = Math.max(...NAME_ALIASES.map(([o]) => o.length));

const applyAliases = (text) =>
  ALIAS_RULES.reduce((acc, r) => acc.replace(r.re, r.current), text);

/** Greetings and small talk must not pay the 7–20s agentic-retrieval cost. */
const SMALL_TALK = [
  { re: /^(hi|hey|hello|yo|hiya|howdy|hi there|hello there|good (morning|afternoon|evening))[\s!.?]*$/i,
    reply: "Hi! 👋 I'm the **Systech Marketplace assistant**. I can help you explore our 27 applications.\n\nTry asking:\n- *List the applications in the L&D category*\n- *What does VisionIQ™ do?*\n- *Which apps help with procurement?*" },
  { re: /^(thanks|thank you|thx|ty|cheers|great|awesome|perfect|nice|cool|ok|okay|got it)[\s!.?]*$/i,
    reply: "Happy to help! Anything else you'd like to know about the marketplace?" },
  { re: /^(bye|goodbye|see you|see ya|later)[\s!.?]*$/i,
    reply: 'Goodbye! 👋 Come back any time you need help finding an application.' },
  { re: /^(who are you|what are you|what can you do|help|what do you do)[\s!.?]*$/i,
    reply: "I'm the **Systech Marketplace assistant**. I answer questions about our applications using their official product documentation.\n\nI can:\n- **List apps by category** — *what's in the Retail category?*\n- **Explain what an app does** — *tell me about SafeWatch™*\n- **Compare applications** — *SafeWatch™ vs VisionIQ™*\n- **Find apps by need** — *which app helps with invoice auditing?*" },
];

/** Streams a canned reply over SSE using the same envelope as a real answer. */
function streamInstant(res, text) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  // `smallTalk` tells the client not to treat this reply as a search result.
  // These canned replies name applications as examples, and without the flag the
  // UI would navigate to VisionIQ™ just because the user said "hi".
  res.write(`data: ${JSON.stringify({ type: 'metadata', references: [], smallTalk: true })}\n\n`);
  res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
  res.write('data: [DONE]\n\n');
  res.end();
}

/* ── POST /api/chat ── */
app.post('/api/chat', async (req, res) => {
  const { query, messages } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  // Fast path: answer greetings/small talk immediately, skipping retrieval.
  const trimmed = String(query).trim();
  const smallTalk = trimmed.length <= 40 && SMALL_TALK.find((s) => s.re.test(trimmed));
  if (smallTalk) return streamInstant(res, smallTalk.reply);

  try {
    const endpoint = process.env.AZURE_SEARCH_ENDPOINT || 'https://bizdevsearch.search.windows.net';
    const kbName = process.env.AZURE_SEARCH_KB_NAME || 'marketplace-chatbot-kb';
    const apiVersion = process.env.AZURE_SEARCH_API_VERSION || '2025-11-01-preview';
    const apiKey = process.env.AZURE_SEARCH_API_KEY;
    if (!apiKey) {
      console.error('AZURE_SEARCH_API_KEY is not set');
      return res.status(500).json({ error: 'Search service is not configured' });
    }

    // The endpoint path for agentic retrieval is /knowledgebases/{name}/retrieve
    const url = `${endpoint}/knowledgebases/${kbName}/retrieve?api-version=${apiVersion}`;

    // Map conversation history into the required format for agentic retrieval
    let formattedMessages = [];
    if (messages && Array.isArray(messages)) {
      formattedMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: [{ type: "text", text: msg.text }]
      }));
    } else {
      formattedMessages = [
        { role: "user", content: [{ type: "text", text: query }] }
      ];
    }

    // Prepend a strict system message to force clean, bulleted, bold markdown formatting
    formattedMessages.unshift({
      role: "system",
      content: [{ 
        type: "text", 
        text: "You are a highly helpful and professional assistant for the Systech Application Marketplace. You MUST format your responses neatly using Markdown. Always use **bold text** for key terms, use bullet points for lists or features, and write clear, concise paragraphs. Cite your sources using [ref_id:X]. "
          + ALIAS_INSTRUCTION
      }]
    });

    const payload = {
      messages: formattedMessages
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Azure API Error:', errText);
      return res.status(response.status).json({ error: 'Azure API returned an error', details: errText });
    }

    let data = await response.json();
    
    // Step 2: Use Azure OpenAI (gpt-5.4) as an intermediate step to beautifully format the response
    if (data.response && Array.isArray(data.response) && data.response.length > 0) {
      const firstResponse = data.response[0];
      if (firstResponse.content && Array.isArray(firstResponse.content) && firstResponse.content.length > 0) {
        const rawText = firstResponse.content[0].text;
        
        try {
          const oaEndpoint = 'https://systechinternalapp.cognitiveservices.azure.com';
          const oaDeploymentId = 'gpt-5.4';
          const oaApiVersion = '2024-12-01-preview';
          const oaUrl = `${oaEndpoint}/openai/deployments/${oaDeploymentId}/chat/completions?api-version=${oaApiVersion}`;
          
          const credential = new DefaultAzureCredential();
          const tokenResponse = await credential.getToken("https://cognitiveservices.azure.com/.default");
          
          const formatPayload = {
            messages: [
              {
                role: "system",
                content: "You are a professional technical writer formatting AI search results for the Systech Application Marketplace. Rewrite the provided text so it is NEAT and CLEAR. Open with a one-or-two sentence summary in a blockquote (> ...). Break the rest into short sections with **bold headers** and use bullet points extensively. Keep it scannable — prefer bullets over long paragraphs. Do NOT include any citations, [ref_id:X] tags, or hyperlinks in the text. Always write application names exactly as they are officially branded, including any ™ symbol. "
                  + ALIAS_INSTRUCTION
              },
              { role: "user", content: rawText }
            ],
            stream: true
          };

          // Setup SSE Headers
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          // Tells nginx not to buffer this response, so chunks reach the browser
          // as they are written rather than all at once when the stream closes.
          res.setHeader('X-Accel-Buffering', 'no');
          res.flushHeaders();

          // Send initial metadata (references) instantly
          res.write(`data: ${JSON.stringify({ type: 'metadata', references: data.references || [] })}\n\n`);

          const oaResponse = await fetch(oaUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenResponse.token}`
            },
            body: JSON.stringify(formatPayload)
          });

          if (!oaResponse.ok) {
            console.error('Azure OpenAI Formatting Error:', await oaResponse.text());
            res.write(`data: ${JSON.stringify({ type: 'error', text: 'Error connecting to formatting service.' })}\n\n`);
            return res.end();
          }

          if (oaResponse.body) {
            const reader = oaResponse.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let fullResponseText = '';
            // Upstream SSE frames can split mid-line between reads, so only
            // complete lines are parsed; the remainder waits for the next read.
            let lineBuffer = '';
            let upstreamDone = false;

            /*
             * Legacy names are rewritten on the way out, but a name can straddle
             * two deltas ("Vet" + "AI"), and a short alias can be the prefix of a
             * longer one ("LexSphere" inside "LexSphere Counsel AI"). Rewriting the
             * buffer in place would fire the short alias first and emit
             * "Legal AI Counsellor Counsel AI".
             *
             * So the rewrite is always recomputed from the raw text, and only the
             * portion more than ALIAS_MAX_LEN characters from the end is sent —
             * no already-sent text can still be changed by later arrivals.
             */
            let sentLen = 0;
            const emit = (flush = false) => {
              const rendered = applyAliases(fullResponseText);
              const safeLen = flush
                ? rendered.length
                : rendered.length - ALIAS_MAX_LEN;
              if (safeLen <= sentLen) return;
              const out = rendered.slice(sentLen, safeLen);
              sentLen = safeLen;
              if (out) res.write(`data: ${JSON.stringify({ type: 'chunk', text: out })}\n\n`);
            };

            while (!upstreamDone) {
              const { done, value } = await reader.read();
              if (done) break;

              lineBuffer += decoder.decode(value, { stream: true });
              const lines = lineBuffer.split('\n');
              lineBuffer = lines.pop() ?? '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const payload = trimmed.slice(5).trim();
                if (payload === '[DONE]') { upstreamDone = true; break; }
                try {
                  const parsed = JSON.parse(payload);
                  const delta = parsed.choices?.[0]?.delta;
                  if (delta && delta.content) {
                    fullResponseText += delta.content;
                    emit();
                  }
                } catch (e) {
                  // Incomplete frame — it arrives with the next read.
                }
              }
            }
            emit(true); // flush the withheld tail
            fullResponseText = applyAliases(fullResponseText);
            // Save to the user's custom marketplace table asynchronously
            chatPool.query('INSERT INTO marketplace (question, answer) VALUES ($1, $2)', [req.body.query, fullResponseText])
              .catch(err => console.error('Failed to log chat to marketplace table:', err));
          }
          
          res.write(`data: [DONE]\n\n`);
          return res.end();
          
        } catch (formatErr) {
          console.error('Failed to format with OpenAI, returning raw data:', formatErr);
          // If formatting fails, fallback to sending the raw text
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('X-Accel-Buffering', 'no');
          res.write(`data: ${JSON.stringify({ type: 'metadata', references: data.references || [] })}\n\n`);
          // Raw retrieval text is unformatted, so legacy names must still be fixed.
          res.write(`data: ${JSON.stringify({ type: 'chunk', text: applyAliases(rawText) })}\n\n`);
          res.write(`data: [DONE]\n\n`);
          return res.end();
        }
      }
    }

    // Fallback if no text content was found
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    res.write(`data: ${JSON.stringify({ type: 'chunk', text: 'No content available.' })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    return res.end();
  } catch (err) {
    console.error('Chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error during chat retrieval' });
    } else {
      res.end();
    }
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
