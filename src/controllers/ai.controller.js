const aiService = require("../services/ai.service");
const puppeteer = require("puppeteer");

const pdf = require("html-pdf-node");

// ---------------- PDF GENERATION ----------------
module.exports.downloadResumePDF = async (req, res) => {
  // ✅ Add CORS headers for frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") return res.sendStatus(204);

  try {
    const d = req.body; // resume data
    if (!d) return res.status(400).json({ error: "Resume data is required" });

    console.log("Resume data received for PDF:", d);

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; line-height: 1.4; }
            h1 { text-align: center; margin-bottom: 5px; }
            p { margin: 2px 0; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 12px; }
            .section h2 { border-bottom: 1px solid #ccc; font-size: 14px; margin-bottom: 4px; }
            .item { margin-bottom: 6px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${d.name || ""}</h1>
            <p>${d.email || ""} | ${d.phone || ""} ${d.location ? " | " + d.location : ""}</p>
            <p>
              ${d.links?.github ? `<a href="${d.links.github}">GitHub</a> | ` : ""}
              ${d.links?.linkedin ? `<a href="${d.links.linkedin}">LinkedIn</a> | ` : ""}
              ${d.links?.portfolio ? `<a href="${d.links.portfolio}">Portfolio</a> | ` : ""}
              ${d.links?.leetcode ? `<a href="${d.links.leetcode}">LeetCode</a> | ` : ""}
              ${d.links?.gfg ? `<a href="${d.links.gfg}">GFG</a>` : ""}
            </p>
          </div>

          ${d.summary ? `<div class="section"><h2>Summary</h2><p>${d.summary}</p></div>` : ""}

          ${Array.isArray(d.education) && d.education.length > 0
            ? `<div class="section"><h2>Education</h2>${d.education
                .map(
                  (e) =>
                    `<div class="item"><p class="bold">${e.institute}</p><p>${e.degree} (${e.duration})${
                      e.cgpa ? " - CGPA: " + e.cgpa : ""
                    }</p></div>`
                )
                .join("")}</div>`
            : ""}

          ${d.skills
            ? `<div class="section"><h2>Skills</h2>
                <p><span class="bold">Languages:</span> ${(d.skills.languages || []).join(", ")}</p>
                <p><span class="bold">Frameworks:</span> ${(d.skills.frameworks || []).join(", ")}</p>
                <p><span class="bold">Tools:</span> ${(d.skills.tools || []).join(", ")}</p>
               </div>`
            : ""}

          ${Array.isArray(d.experience) && d.experience.length > 0
            ? `<div class="section"><h2>Experience</h2>${d.experience
                .map(
                  (exp) =>
                    `<div class="item"><p class="bold">${exp.role} — ${exp.company}</p><p>${exp.duration}</p><p>${exp.description}</p></div>`
                )
                .join("")}</div>`
            : ""}

          ${Array.isArray(d.projects) && d.projects.length > 0
            ? `<div class="section"><h2>Projects</h2>${d.projects
                .map(
                  (p) =>
                    `<div class="item"><p class="bold">${p.title}</p><p>${p.description}</p>${
                      p.github ? `<a href="${p.github}">GitHub</a>` : ""
                    } ${p.live ? ` | <a href="${p.live}">Live</a>` : ""}</div>`
                )
                .join("")}</div>`
            : ""}

          ${Array.isArray(d.certifications) && d.certifications.filter((c) => c.title && c.authority).length > 0
            ? `<div class="section"><h2>Certifications</h2><ul>${d.certifications
                .filter((c) => c.title && c.authority)
                .map((c) => `<li><span class="bold">${c.title}</span> — ${c.authority}${c.date ? ` (${c.date})` : ""}</li>`)
                .join("")}</ul></div>`
            : ""}

          ${Array.isArray(d.awards) && d.awards.filter((a) => a.title && a.issuer).length > 0
            ? `<div class="section"><h2>Awards & Achievements</h2><ul>${d.awards
                .filter((a) => a.title && a.issuer)
                .map((a) => `<li><span class="bold">${a.title}</span> — ${a.issuer}${a.year ? ` (${a.year})` : ""}</li>`)
                .join("")}</ul></div>`
            : ""}

        </body>
      </html>
    `;

    // ✅ Generate PDF using html-pdf-node
    let file = { content: htmlContent };
    const options = { format: "A4" };

    const pdfBuffer = await pdf.generatePdf(file, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${d.name || "resume"}.pdf"`);
    return res.end(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF Generation Failed:", err);
    return res.status(500).send("Failed to generate PDF");
  }
};


// ---------------- AI RESUME GENERATION ----------------
module.exports.generateResume = async (req, res) => {
  // ✅ Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") return res.sendStatus(204);

  const userData = req.body;

  if (!userData) return res.status(400).send("User data is required");

  const prompt = `
    The user provided raw resume data (possibly Hindi + English mix).
    Task:
    1. Clean and polish the text into professional ATS-friendly English.
    2. Structure data exactly in JSON schema as per system instruction.
    User Data: ${JSON.stringify(userData, null, 2)}
  `;

  try {
    const response = await aiService.generateResume(prompt);
    return res.json({ resume: response });
  } catch (err) {
    console.error("❌ AI Resume Generation Failed:", err);
    return res.status(500).json({ error: "Resume generation failed", details: err.message });
  }
};
