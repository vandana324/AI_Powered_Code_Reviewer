const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// ✅ Global CORS
app.use(cors({
  origin: ["http://localhost:5173", "https://ai-resume-generator-frontend.onrender.com"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Preflight for all routes
app.options('*', cors());

// ✅ JSON parsing middleware
app.use(express.json());

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// ✅ AI routes
app.use('/ai', aiRoutes);

module.exports = app;
