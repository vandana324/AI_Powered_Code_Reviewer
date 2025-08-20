const express = require("express");
const aiController = require("../controllers/ai.controller");
const resumeController = require("../controllers/ai.controller");

const router = express.Router();

router.post("/generate-resume", aiController.generateResume);

// 👇 naya route PDF ke liye
router.post("/download-pdf", aiController.downloadResumePDF);

module.exports = router;
