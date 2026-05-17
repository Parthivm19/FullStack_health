# HealthSync

HealthSync is a full-stack AI-powered healthcare management platform built using the MERN stack, FastAPI, MongoDB Atlas, OCR, and Gemini AI.

The platform enables users to:

* monitor health vitals,
* track daily wellness progress
* manage medications,
* upload and analyze blood reports,
* receive AI-powered symptom insights,
* visualize health trends dynamically.

---

# Features

## User Authentication

* JWT-based authentication
* Secure protected API routes
* User-specific health data storage
* Persistent login sessions

---

# Dashboard

* Dynamic health dashboard
* Real-time vitals integration
* Heart rate trend charts
* Personalized health summary
* Activity visualization

---

# Progress Tracking

Users can log and monitor:

* Weight
* Steps
* Sleep duration
* Calories
* Heart rate
* Water intake

Includes:

* Historical trend charts
* Interactive Recharts graphs
* Real-time MongoDB synchronization

---

# Medical Report Analysis

Users can:

* Upload blood report PDFs
* Extract medical parameters using OCR
* Analyze abnormal values
* Receive AI-assisted health interpretations
* View historical reports
* Delete reports securely

Supported technologies:

* Tesseract OCR
* pdfplumber
* OpenCV
* FastAPI

---

# AI Symptom Analysis

Integrated with Gemini AI.

Users can:

* Describe symptoms in natural language
* Receive structured AI-generated health insights
* Get medically cautious recommendations

---

# Medication Tracking

* Add medications
* Track medicine schedules
* Toggle taken/pending status
* Persistent medication history

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Recharts
* Lucide React Icons

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication

## AI / ML Service

* FastAPI
* Python
* Tesseract OCR
* OpenCV
* pdfplumber
* Gemini AI API

---

# Project Architecture

Frontend (React + TypeScript)
↓
Backend API (Express.js)
↓
FastAPI ML/OCR Service
↓
MongoDB Atlas

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/Parthivm19/FullStack_health.git
cd FullStack_health
```

---

# Frontend Setup

Open terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Backend Setup

Open another terminal:

```bash
cd healthsync-backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

# FastAPI ML Service Setup

Open another terminal:

```bash
cd ml-service
```

## Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run FastAPI Server

```bash
uvicorn app:app --reload --port 8000
```

FastAPI runs on:

```text
http://localhost:8000
```

---

# Environment Variables

Create a `.env` file inside:

```text
healthsync-backend/
```

Add:

```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

# OCR Dependency Setup

Install Tesseract OCR.

## Windows Download

https://github.com/UB-Mannheim/tesseract/wiki

During installation:

* Add Tesseract to system PATH
* Note installation directory if needed

---

# API Integrations

## MongoDB Atlas

Used for:

* User accounts
* Health vitals
* Medical reports
* Medication tracking
* Progress history

## Gemini AI

Used for:

* AI-powered symptom analysis
* Medical insight generation

---

# Important Notes

Do NOT commit:

* `.env`
* `node_modules`
* `venv`
* uploads
* build folders

Ensure `.gitignore` contains:

```gitignore
node_modules/
venv/
ml-service/venv/
.env
uploads/
dist/
__pycache__/
*.pyc
```

---

# Future Improvements

* Advanced health analytics
* Historical trend intelligence
* Doctor-ready PDF summaries
* Better OCR normalization
* Docker deployment
* Wearable integrations
* Notification system
* Real-time monitoring
* AI health assistant expansion

---

# Author

Developed as a full-stack AI-powered healthcare platform project using MERN, FastAPI, OCR, MongoDB Atlas, and Gemini AI.
