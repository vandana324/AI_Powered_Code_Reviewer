const express = require("express");
const aiController = require("../controllers/ai.controller");

const router = express.Router();

router.post("/generate-resume", aiController.generateResume);
router.post("/download-pdf", aiController.downloadResumePDF);

module.exports = router;
