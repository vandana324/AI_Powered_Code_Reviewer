const express = require('express');
const cors = require('cors');
const pdf = require('html-pdf-node');

const app = express();

// ✅ Allow CORS for all origins
app.use(cors());
app.use(express.json());

app.post('/ai/download-pdf', async (req, res) => {
  try {
    const d = req.body;
    if (!d) return res.status(400).json({ error: "Resume data is required" });

    // ... your htmlContent generation code ...

    const file = { content: htmlContent };
    const options = { format: "A4", printBackground: true };
    const pdfBuffer = await pdf.generatePdf(file, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${d.name || "resume"}.pdf"`);
    return res.end(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF Generation Failed:", err);
    return res.status(500).send("Failed to generate PDF");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
