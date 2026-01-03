// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || '*',
//   credentials: true
// }));
// app.use(express.json());

// // Database connection
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// // Test database connection
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err);
//   } else {
//     console.log('✅ Database connected successfully!');
//   }
// });

// // ============ ROUTES ============

// // Get all snippets
// app.get('/api/snippets', async (req, res) => {
//   try {
//     const { category, search } = req.query;
//     let query = 'SELECT * FROM snippets ORDER BY created_at DESC';
//     let params = [];

//     if (category && category !== 'All') {
//       query = 'SELECT * FROM snippets WHERE category = $1 ORDER BY created_at DESC';
//       params = [category];
//     }

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get single snippet
// // Increment views when opening snippet
// app.post('/api/snippets/:id/view', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query('UPDATE snippets SET views = views + 1 WHERE id = $1', [id]);
//     const result = await pool.query('SELECT views FROM snippets WHERE id = $1', [id]);
//     res.json({ views: result.rows[0].views });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get comments for a snippet
// app.get('/api/snippets/:id/comments', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM comments WHERE snippet_id = $1 ORDER BY created_at DESC',
//       [id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Add comment to snippet
// // Add comment to snippet
// app.post('/api/snippets/:id/comments', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user_id, username, comment_text } = req.body;

//     if (!comment_text || !username) {
//       return res.status(400).json({ error: 'Comment text and username required' });
//     }

//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to comment' });
//     }

//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }

//     const result = await pool.query(
//       'INSERT INTO comments (snippet_id, user_id, username, comment_text) VALUES ($1, $2, $3, $4) RETURNING *',
//       [id, user_id, username, comment_text]
//     );

//     // Increment comment count
//     await pool.query('UPDATE snippets SET comments = comments + 1 WHERE id = $1', [id]);

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Create snippet
// // Create snippet
// app.post('/api/snippets', async (req, res) => {
//   try {
//     const { title, category, language, story, code, before, tags, author, user_id } = req.body;

//     if (!title || !category || !language || !story || !code || !author) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to create snippets' });
//     }

//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }

//     const result = await pool.query(
//       `INSERT INTO snippets (title, category, language, story, code, before_code, tags, author, user_id) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
//        RETURNING *`,
//       [title, category, language, story, code, before, tags, author, user_id]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// // Like snippet
// app.post('/api/snippets/:id/like', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user_id } = req.body;
    
//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to like snippets' });
//     }
    
//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }
    
//     await pool.query('UPDATE snippets SET likes = likes + 1 WHERE id = $1', [id]);
    
//     const result = await pool.query('SELECT likes FROM snippets WHERE id = $1', [id]);
//     res.json({ likes: result.rows[0].likes });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Like snippet
// app.post('/api/snippets/:id/like', async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     await pool.query('UPDATE snippets SET likes = likes + 1 WHERE id = $1', [id]);
    
//     const result = await pool.query('SELECT likes FROM snippets WHERE id = $1', [id]);
//     res.json({ likes: result.rows[0].likes });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // User registration (simplified - no password hashing for demo)
// app.post('/api/auth/signup', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields required' });
//     }

//     // Check if user exists
//     const userExists = await pool.query(
//       'SELECT * FROM users WHERE email = $1 OR username = $2',
//       [email, username]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Insert user
//     const result = await pool.query(
//       'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
//       [username, email, password]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // User login (simplified)
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await pool.query(
//       'SELECT id, username, email FROM users WHERE email = $1 AND password = $2',
//       [email, password]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date() });
// });

// // Root route
// app.get('/', (req, res) => {
//   res.json({ message: 'Code Museum API Server', version: '1.0.0' });
// });

// // Only listen in development
// const PORT = process.env.PORT || 5000;

// if (process.env.NODE_ENV !== 'production') {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// }


// module.exports = app;


// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || '*',
//   credentials: true
// }));
// app.use(express.json());

// // Database connection
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// // Test database connection
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err);
//   } else {
//     console.log('✅ Database connected successfully!');
//   }
// });

// // ============ ROUTES ============

// // Get all snippets
// app.get('/api/snippets', async (req, res) => {
//   try {
//     const { category, search } = req.query;
//     let query = 'SELECT * FROM snippets ORDER BY created_at DESC';
//     let params = [];

//     if (category && category !== 'All') {
//       query = 'SELECT * FROM snippets WHERE category = $1 ORDER BY created_at DESC';
//       params = [category];
//     }

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Increment views when opening snippet
// app.post('/api/snippets/:id/view', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query('UPDATE snippets SET views = views + 1 WHERE id = $1', [id]);
//     const result = await pool.query('SELECT views FROM snippets WHERE id = $1', [id]);
//     res.json({ views: result.rows[0].views });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get comments for a snippet
// app.get('/api/snippets/:id/comments', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM comments WHERE snippet_id = $1 ORDER BY created_at DESC',
//       [id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Add comment to snippet
// app.post('/api/snippets/:id/comments', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user_id, username, comment_text } = req.body;

//     if (!comment_text || !username) {
//       return res.status(400).json({ error: 'Comment text and username required' });
//     }

//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to comment' });
//     }

//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }

//     const result = await pool.query(
//       'INSERT INTO comments (snippet_id, user_id, username, comment_text) VALUES ($1, $2, $3, $4) RETURNING *',
//       [id, user_id, username, comment_text]
//     );

//     // Increment comment count
//     await pool.query('UPDATE snippets SET comments = comments + 1 WHERE id = $1', [id]);

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Create snippet
// app.post('/api/snippets', async (req, res) => {
//   try {
//     const { title, category, language, story, code, before, tags, author, user_id } = req.body;

//     if (!title || !category || !language || !story || !code || !author) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to create snippets' });
//     }

//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }

//     const result = await pool.query(
//       `INSERT INTO snippets (title, category, language, story, code, before_code, tags, author, user_id) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
//        RETURNING *`,
//       [title, category, language, story, code, before, tags, author, user_id]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Like snippet (FIXED - only ONE definition now)
// app.post('/api/snippets/:id/like', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user_id } = req.body;
    
//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to like snippets' });
//     }
    
//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }

//     // Check if user already liked this snippet
//     const alreadyLiked = await pool.query(
//       'SELECT * FROM likes WHERE user_id = $1 AND snippet_id = $2',
//       [user_id, id]
//     );

//     if (alreadyLiked.rows.length > 0) {
//       return res.status(400).json({ error: 'Already liked this snippet' });
//     }

//     // Add like record
//     await pool.query(
//       'INSERT INTO likes (user_id, snippet_id) VALUES ($1, $2)',
//       [user_id, id]
//     );
    
//     // Increment like count
//     await pool.query('UPDATE snippets SET likes = likes + 1 WHERE id = $1', [id]);
    
//     const result = await pool.query('SELECT likes FROM snippets WHERE id = $1', [id]);
//     res.json({ likes: result.rows[0].likes });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // User registration
// app.post('/api/auth/signup', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields required' });
//     }

//     // Check if user exists
//     const userExists = await pool.query(
//       'SELECT * FROM app_users WHERE email = $1 OR username = $2',
//       [email, username]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Insert user (NOTE: In production, hash the password!)
//     const result = await pool.query(
//       'INSERT INTO app_users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
//       [username, email, password]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // User login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await pool.query(
//       'SELECT id, username, email FROM app_users WHERE email = $1 AND password = $2',
//       [email, password]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date() });
// });

// // Root route
// app.get('/', (req, res) => {
//   res.json({ message: 'Code Museum API Server', version: '1.0.0' });
// });

// const PORT = process.env.PORT || 5000;

// if (process.env.NODE_ENV !== 'production') {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// }

// module.exports = app;


// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// require('dotenv').config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('❌ Database connection error:', err);
//   } else {
//     console.log('✅ Database connected successfully!');
//   }
// });

// // Auth signup
// app.post('/api/auth/signup', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields required' });
//     }

//     const userExists = await pool.query(
//       'SELECT * FROM users WHERE email = $1 OR username = $2',
//       [email, username]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const result = await pool.query(
//       'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
//       [username, email, password]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error: ' + err.message });
//   }
// });

// // Auth login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await pool.query(
//       'SELECT id, username, email FROM users WHERE email = $1 AND password = $2',
//       [email, password]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get snippets
// app.get('/api/snippets', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM snippets ORDER BY created_at DESC');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Add snippet
// app.post('/api/snippets', async (req, res) => {
//   try {
//     const { title, category, language, story, code, before, tags, author, user_id } = req.body;

//     const result = await pool.query(
//       `INSERT INTO snippets (title, category, language, story, code, before_code, tags, author, user_id) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
//       [title, category, language, story, code, before, tags, author, user_id || 1]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Like snippet
// app.post('/api/snippets/:id/like', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query('UPDATE snippets SET likes = likes + 1 WHERE id = $1', [id]);
//     const result = await pool.query('SELECT likes FROM snippets WHERE id = $1', [id]);
//     res.json({ likes: result.rows[0].likes });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // View snippet
// app.post('/api/snippets/:id/view', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query('UPDATE snippets SET views = views + 1 WHERE id = $1', [id]);
//     const result = await pool.query('SELECT views FROM snippets WHERE id = $1', [id]);
//     res.json({ views: result.rows[0].views });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get comments
// app.get('/api/snippets/:id/comments', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM comments WHERE snippet_id = $1 ORDER BY created_at DESC',
//       [id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Add comment
// app.post('/api/snippets/:id/comments', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user_id, username, comment_text } = req.body;

//     const result = await pool.query(
//       'INSERT INTO comments (snippet_id, user_id, username, comment_text) VALUES ($1, $2, $3, $4) RETURNING *',
//       [id, user_id || 1, username, comment_text]
//     );

//     await pool.query('UPDATE snippets SET comments = comments + 1 WHERE id = $1', [id]);

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date() });
// });

// const PORT = process.env.PORT || 5000;

// if (process.env.NODE_ENV !== 'production') {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// }

// module.exports = app;









// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// require('dotenv').config();

// const app = express();

// // Middleware - IMPORTANT: Parse JSON bodies
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cors({
//   origin: process.env.CLIENT_URL || '*',
//   credentials: true
// }));

// // Database connection
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// // Test database connection
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err);
//   } else {
//     console.log('✅ Database connected successfully!');
//   }
// });

// // ============ ROUTES ============

// // Get all snippets
// app.get('/api/snippets', async (req, res) => {
//   try {
//     const { category, search } = req.query;
//     let query = 'SELECT * FROM snippets ORDER BY created_at DESC';
//     let params = [];

//     if (category && category !== 'All') {
//       query = 'SELECT * FROM snippets WHERE category = $1 ORDER BY created_at DESC';
//       params = [category];
//     }

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Increment views when opening snippet
// app.post('/api/snippets/:id/view', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query('UPDATE snippets SET views = views + 1 WHERE id = $1', [id]);
//     const result = await pool.query('SELECT views FROM snippets WHERE id = $1', [id]);
//     res.json({ views: result.rows[0].views });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get comments for a snippet
// app.get('/api/snippets/:id/comments', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM comments WHERE snippet_id = $1 ORDER BY created_at DESC',
//       [id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Add comment to snippet
// app.post('/api/snippets/:id/comments', async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Debug logging
//     console.log('📦 Request body:', req.body);
    
//     const { user_id, username, comment_text } = req.body;

//     if (!comment_text || !username) {
//       return res.status(400).json({ error: 'Comment text and username required' });
//     }

//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to comment' });
//     }

//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }

//     const result = await pool.query(
//       'INSERT INTO comments (snippet_id, user_id, username, comment_text) VALUES ($1, $2, $3, $4) RETURNING *',
//       [id, user_id, username, comment_text]
//     );

//     // Increment comment count
//     await pool.query('UPDATE snippets SET comments = comments + 1 WHERE id = $1', [id]);

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('❌ Comment error:', err);
//     res.status(500).json({ error: 'Server error: ' + err.message });
//   }
// });

// // Create snippet
// app.post('/api/snippets', async (req, res) => {
//   try {
//     console.log('📦 Create snippet body:', req.body);
    
//     const { title, category, language, story, code, before, tags, author, user_id } = req.body;

//     if (!title || !category || !language || !story || !code || !author) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to create snippets' });
//     }

//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }

//     const result = await pool.query(
//       `INSERT INTO snippets (title, category, language, story, code, before_code, tags, author, user_id) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
//        RETURNING *`,
//       [title, category, language, story, code, before, tags, author, user_id]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('❌ Create snippet error:', err);
//     res.status(500).json({ error: 'Server error: ' + err.message });
//   }
// });

// // Like snippet
// app.post('/api/snippets/:id/like', async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Debug logging
//     console.log('❤️ Like request body:', req.body);
    
//     const { user_id } = req.body;
    
//     // Validate user is logged in
//     if (!user_id) {
//       return res.status(401).json({ error: 'Must be logged in to like snippets' });
//     }
    
//     // Check if user exists
//     const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
//     if (userCheck.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid user' });
//     }

//     // Check if user already liked this snippet
//     const alreadyLiked = await pool.query(
//       'SELECT * FROM likes WHERE user_id = $1 AND snippet_id = $2',
//       [user_id, id]
//     );

//     if (alreadyLiked.rows.length > 0) {
//       return res.status(400).json({ error: 'Already liked this snippet' });
//     }

//     // Add like record
//     await pool.query(
//       'INSERT INTO likes (user_id, snippet_id) VALUES ($1, $2)',
//       [user_id, id]
//     );
    
//     // Increment like count
//     await pool.query('UPDATE snippets SET likes = likes + 1 WHERE id = $1', [id]);
    
//     const result = await pool.query('SELECT likes FROM snippets WHERE id = $1', [id]);
//     res.json({ likes: result.rows[0].likes });
//   } catch (err) {
//     console.error('❌ Like error:', err);
//     res.status(500).json({ error: 'Server error: ' + err.message });
//   }
// });


// // User registration
// app.post('/api/auth/signup', async (req, res) => {
//   try {
//     console.log('📝 Signup body:', req.body);
    
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields required' });
//     }

//     // Check if user exists
//     const userExists = await pool.query(
//       'SELECT * FROM app_users WHERE email = $1 OR username = $2',
//       [email, username]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Insert user (NOTE: In production, hash the password!)
//     const result = await pool.query(
//       'INSERT INTO app_users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
//       [username, email, password]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('❌ Signup error:', err);
//     res.status(500).json({ error: 'Server error: ' + err.message });
//   }
// });

// // User login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     console.log('🔐 Login body:', req.body);
    
//     const { email, password } = req.body;

//     const result = await pool.query(
//       'SELECT id, username, email FROM app_users WHERE email = $1 AND password = $2',
//       [email, password]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('❌ Login error:', err);
//     res.status(500).json({ error: 'Server error: ' + err.message });
//   }
// });

// // Delete snippet
// app.delete('/api/snippets/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user_id } = req.body;

//     // Check if snippet exists and belongs to user
//     const snippet = await pool.query('SELECT * FROM snippets WHERE id = $1', [id]);
    
//     if (snippet.rows.length === 0) {
//       return res.status(404).json({ error: 'Snippet not found' });
//     }

//     if (snippet.rows[0].user_id !== user_id) {
//       return res.status(403).json({ error: 'Not authorized to delete this snippet' });
//     }

//     // Delete associated comments first
//     await pool.query('DELETE FROM comments WHERE snippet_id = $1', [id]);
    
//     // Delete snippet
//     await pool.query('DELETE FROM snippets WHERE id = $1', [id]);

//     res.json({ message: 'Snippet deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date() });
// });

// // Root route
// app.get('/', (req, res) => {
//   res.json({ message: 'Code Museum API Server', version: '1.0.0' });
// });

// const PORT = process.env.PORT || 5000;

// // Start server
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// }


// module.exports = app;



const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware - IMPORTANT: Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully!');
  }
});

// ============ ROUTES ============

// Get all snippets
app.get('/api/snippets', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM snippets ORDER BY created_at DESC';
    let params = [];

    if (category && category !== 'All') {
      query = 'SELECT * FROM snippets WHERE category = $1 ORDER BY created_at DESC';
      params = [category];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Get snippets error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increment views when opening snippet
app.post('/api/snippets/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE snippets SET views = views + 1 WHERE id = $1', [id]);
    const result = await pool.query('SELECT views FROM snippets WHERE id = $1', [id]);
    res.json({ views: result.rows[0].views });
  } catch (err) {
    console.error('❌ Increment view error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get comments for a snippet
app.get('/api/snippets/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM comments WHERE snippet_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Get comments error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment to snippet
app.post('/api/snippets/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, username, comment_text } = req.body;

    if (!comment_text || !username) {
      return res.status(400).json({ error: 'Comment text and username required' });
    }

    if (!user_id) {
      return res.status(401).json({ error: 'Must be logged in to comment' });
    }

    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const result = await pool.query(
      'INSERT INTO comments (snippet_id, user_id, username, comment_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, user_id, username, comment_text]
    );

    // Increment comment count
    await pool.query('UPDATE snippets SET comments = comments + 1 WHERE id = $1', [id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Add comment error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create snippet
app.post('/api/snippets', async (req, res) => {
  try {
    const { title, category, language, story, code, before, tags, author, user_id } = req.body;

    if (!title || !category || !language || !story || !code || !author) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!user_id) {
      return res.status(401).json({ error: 'Must be logged in to create snippets' });
    }

    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const result = await pool.query(
      `INSERT INTO snippets (title, category, language, story, code, before_code, tags, author, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [title, category, language, story, code, before, tags, author, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create snippet error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like snippet
app.post('/api/snippets/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(401).json({ error: 'Must be logged in to like snippets' });
    }
    
    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM app_users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Check if user already liked this snippet
    const alreadyLiked = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND snippet_id = $2',
      [user_id, id]
    );

    if (alreadyLiked.rows.length > 0) {
      return res.status(400).json({ error: 'Already liked this snippet' });
    }

    // Add like record
    await pool.query(
      'INSERT INTO likes (user_id, snippet_id) VALUES ($1, $2)',
      [user_id, id]
    );
    
    // Increment like count
    await pool.query('UPDATE snippets SET likes = likes + 1 WHERE id = $1', [id]);
    
    const result = await pool.query('SELECT likes FROM snippets WHERE id = $1', [id]);
    res.json({ likes: result.rows[0].likes });
  } catch (err) {
    console.error('❌ Like error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's liked snippets
app.get('/api/users/:userId/likes', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT snippet_id FROM likes WHERE user_id = $1',
      [userId]
    );
    const likedSnippetIds = result.rows.map(row => row.snippet_id);
    res.json(likedSnippetIds);
  } catch (err) {
    console.error('❌ Get user likes error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// User registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM app_users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert user (NOTE: In production, hash the password with bcrypt!)
    const result = await pool.query(
      'INSERT INTO app_users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const result = await pool.query(
      'SELECT id, username, email FROM app_users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete snippet
app.delete('/api/snippets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    // Check if snippet exists and belongs to user
    const snippet = await pool.query('SELECT * FROM snippets WHERE id = $1', [id]);
    
    if (snippet.rows.length === 0) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    if (snippet.rows[0].user_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized to delete this snippet' });
    }

    // Delete associated comments and likes (CASCADE should handle this)
    await pool.query('DELETE FROM snippets WHERE id = $1', [id]);

    res.json({ message: 'Snippet deleted successfully' });
  } catch (err) {
    console.error('❌ Delete snippet error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Code Museum API Server', version: '1.0.0' });
});

const PORT = process.env.PORT || 5000;

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel
module.exports = app;