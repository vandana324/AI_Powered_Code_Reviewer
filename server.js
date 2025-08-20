require('dotenv').config();
const app = require('./src/app');

// Agar .env me PORT defined hai to use karo, warna default 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
