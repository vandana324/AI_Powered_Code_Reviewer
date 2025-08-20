const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// Resume Generator Model
const resumeModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
    You are a professional resume builder AI.
    - Generate ATS-friendly resumes.
    - If some details are missing, fill them with realistic, professional content.
    - Always return data in this exact JSON schema:
    {
      "name": "",
      "email": "",
      "phone": "",
      "location": "",
      "links": { "github": "", "linkedin": "", "portfolio": "", "leetcode": "", "gfg": "" },
      "summary": "",
      "education": [{ "institute": "", "degree": "", "duration": "", "cgpa": "" }],
      "skills": { "languages": [], "frameworks": [], "tools": [] },
      "experience": [{ "role": "", "company": "", "duration": "", "description": "" }],
      "projects": [{ "title": "", "description": "", "github": "", "live": "" }],
      "certifications": [],
      "awards": []
    }
    - Do not return anything except valid JSON.
  `
});

// ✅ JSON extractor helper
function extractJSON(str) {
  // 1. Agar AI ```json ya ``` laga de toh remove kar do
  str = str.replace(/```json/gi, "").replace(/```/g, "").trim();

  // 2. Sirf { ... } ke beech ka part lo
  const firstBrace = str.indexOf("{");
  const lastBrace = str.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON found in AI response");
  }

  const jsonString = str.slice(firstBrace, lastBrace + 1);

  // 3. Parse karke return karo
  return JSON.parse(jsonString);
}


// Function for resume generation
async function generateResume(prompt) {
  const result = await resumeModel.generateContent(prompt);
  const text = await result.response.text();

  try {
    return extractJSON(text);  // ✅ clean JSON parse
  } catch (err) {
    console.error("❌ JSON parse error. AI said:", text);
    throw new Error("AI did not return valid JSON");
  }
}

module.exports = { generateResume };
