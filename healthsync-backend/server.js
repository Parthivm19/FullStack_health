require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const aiInsightsRoutes = require("./routes/aiInsights");

const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/vitals", require("./routes/vitals"));
app.use("/api/exercise", require("./routes/exercise"));
app.use("/api/diet", require("./routes/diet"));
app.use("/api/medical", require("./routes/medical"));
app.use("/api/medications", require("./routes/medications"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiInsightsRoutes);

// Blood Report Analysis Route
app.use("/api/reports", reportRoutes);

// Server Port
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })

  .catch((err) => {
    console.error("DB connection error:", err);
  });
