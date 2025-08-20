const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai.routes');

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://ai-resume-generator-frontend.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World'));

app.use('/ai', aiRoutes);

module.exports = app;
