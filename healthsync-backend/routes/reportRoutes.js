const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Report = require("../models/Report");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.get("/", auth, async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.user.id,
    }).sort({ uploadedAt: -1 });

    res.json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch reports",
    });
  }
});

router.post(
  "/analyze-report",
  auth,
  upload.single("report"),
  async (req, res) => {
    try {
      const formData = new FormData();

      formData.append(
        "file",
        fs.createReadStream(req.file.path),
        req.file.originalname,
      );

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      const savedReport = await Report.create({
        userId: req.user.id,
        filename: response.data.filename,
        parameters: response.data.parameters,
        analysis: response.data.analysis,
      });

      res.json({
        message: "Report analyzed and saved successfully",
        report: savedReport,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error: "Blood report analysis failed",
      });
    }
  },
);

router.delete("/:id", auth, async (req, res) => {
  try {
    await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to delete report",
    });
  }
});

module.exports = router;
