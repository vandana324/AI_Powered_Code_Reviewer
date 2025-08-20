const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// ✅ CORS ko properly configure karo
app.use(cors({
  origin: ["http://localhost:5173", "https://ai-resume-generator-frontend.onrender.com",
    "https://ai-resume-generator04.netlify.app"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Preflight request (OPTIONS) ko handle karo
app.options("*", cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/ai', aiRoutes);

module.exports = app;
