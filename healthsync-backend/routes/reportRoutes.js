const express = require("express");

const multer = require("multer");

const axios = require("axios");

const FormData = require("form-data");

const fs = require("fs");

const path = require("path");

const Report = require("../models/Report");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ------------------------------------
// MULTER CONFIG
// ------------------------------------
const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF and image files are allowed"));
    }

    cb(null, true);
  },
});

// ------------------------------------
// GET ALL REPORTS
// ------------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.user.id,
    }).sort({
      uploadedAt: -1,
    });

    res.json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      error: "Failed to fetch reports",
    });
  }
});

// ------------------------------------
// ANALYZE REPORT
// ------------------------------------
router.post(
  "/analyze-report",

  auth,

  upload.single("report"),

  async (req, res) => {
    let uploadedFilePath = "";

    try {
      // -----------------------------
      // CHECK FILE
      // -----------------------------
      if (!req.file) {
        return res.status(400).json({
          success: false,

          error: "No file uploaded",
        });
      }

      uploadedFilePath = req.file.path;

      // -----------------------------
      // SEND TO FASTAPI
      // -----------------------------
      const formData = new FormData();

      formData.append(
        "file",

        fs.createReadStream(uploadedFilePath),

        req.file.originalname,
      );

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",

        formData,

        {
          headers: formData.getHeaders(),

          maxBodyLength: Infinity,
        },
      );

      const aiData = response.data;

      // -----------------------------
      // SAVE TO MONGODB
      // -----------------------------
      const savedReport = await Report.create({
        userId: req.user.id,

        filename: aiData.filename,

        parameters: aiData.parameters || {},

        analysis: aiData.analysis || {},

        summary: aiData.summary || "",

        extractedText: aiData.extracted_text || "",
      });

      // -----------------------------
      // DELETE TEMP FILE
      // -----------------------------
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      // -----------------------------
      // RESPONSE
      // -----------------------------
      res.json({
        success: true,

        message: "Report analyzed and saved successfully",

        report: savedReport,

        summary: aiData.summary,

        analysis: aiData.analysis,

        parameters: aiData.parameters,
      });
    } catch (error) {
      console.log(error);

      // DELETE FILE IF ERROR
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      res.status(500).json({
        success: false,

        error: "Blood report analysis failed",

        details: error.response?.data || error.message,
      });
    }
  },
);

// ------------------------------------
// DELETE REPORT
// ------------------------------------
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Report.findOneAndDelete({
      _id: req.params.id,

      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,

        error: "Report not found",
      });
    }

    res.json({
      success: true,

      message: "Report deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      error: "Failed to delete report",
    });
  }
});

module.exports = router;
