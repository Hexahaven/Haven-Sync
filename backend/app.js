require('dotenv').config();
require('./services/mqttClient');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');
const pool = require('./db');

// ✅ Check MySQL DB connection
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Failed to connect to MySQL DB:', err.code, err.message);
  } else {
    console.log('✅ MySQL DB connected successfully!');
    conn.release();
  }
});

const app = express();

// ✅ Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const mqttRoutes = require('./routes/mqttRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/mqtt', mqttRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('HavenSync Backend is Live!');
});

// ✅ Example device API
app.get('/devices', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM devices');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// ✅ Use PORT=3001 for local, or Railway's assigned port
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
