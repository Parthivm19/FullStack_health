from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import pdfplumber
import re
import cv2
import pytesseract
import pandas as pd

from PIL import Image

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

# -----------------------------
# STANDARD RANGES
# -----------------------------
standard_ranges = {

    "HEMOGLOBIN": {"low": 13.5, "high": 17.5},

    "PLATELETS": {"low": 150000, "high": 450000},

    "WBC": {"low": 4000, "high": 11000},

    "RBC": {"low": 4.5, "high": 5.9},

    "SGOT": {"low": 5, "high": 40},

    "SGPT": {"low": 5, "high": 45},

    "CREATININE": {"low": 0.6, "high": 1.3},

    "GLUCOSE": {"low": 70, "high": 100},

    "TSH": {"low": 0.4, "high": 4.0},

    "CHOLESTEROL": {"low": 125, "high": 200},

    "HDL": {"low": 40, "high": 100},

    "LDL": {"low": 0, "high": 100},

    "TRIGLYCERIDES": {"low": 0, "high": 150},

}

# -----------------------------
# DISEASE MAP
# -----------------------------
disease_map = {

    "HEMOGLOBIN:LOW": {
        "condition": "Iron Deficiency Anemia",
        "symptoms": [
            "fatigue",
            "weakness",
            "pale skin"
        ],
        "notes": "Increase iron intake and consult physician."
    },

    "PLATELETS:LOW": {
        "condition": "Thrombocytopenia",
        "symptoms": [
            "easy bruising",
            "bleeding"
        ],
        "notes": "Further evaluation recommended."
    },

    "SGOT:HIGH": {
        "condition": "Possible Liver Dysfunction",
        "symptoms": [
            "abdominal pain",
            "fatigue"
        ],
        "notes": "Check liver function."
    },

    "GLUCOSE:HIGH": {
        "condition": "Hyperglycemia",
        "symptoms": [
            "thirst",
            "fatigue"
        ],
        "notes": "Monitor blood sugar."
    },

}

# -----------------------------
# EXTRACT TEXT
# -----------------------------
def extract_text(file_path):

    text = ""

    # PDF
    if file_path.lower().endswith(".pdf"):

        with pdfplumber.open(file_path) as pdf:

            for page in pdf.pages:

                extracted = page.extract_text()

                if extracted:
                    text += extracted + "\n"

    # IMAGE OCR
    else:

        img = cv2.imread(file_path)

        # Resize for better OCR
        img = cv2.resize(
            img,
            None,
            fx=2,
            fy=2,
            interpolation=cv2.INTER_CUBIC
        )

        gray = cv2.cvtColor(
            img,
            cv2.COLOR_BGR2GRAY
        )

        # Noise removal
        gray = cv2.GaussianBlur(
            gray,
            (5, 5),
            0
        )

        # Threshold
        gray = cv2.threshold(
            gray,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )[1]

        # OCR
        text = pytesseract.image_to_string(

            gray,

            lang="eng",

            config="""
            --oem 3
            --psm 6
            -c preserve_interword_spaces=1
            """

)

    return text
# -----------------------------
# EXTRACT PARAMETERS
# -----------------------------
def extract_parameters(text):

    parameters = {}

    text = re.sub(r"\s+", " ", text.upper())

    patterns = {

        "HEMOGLOBIN":
        r"(HEMOGLOBIN|HAEMOGLOBIN|HB|HGB)\s*[:\-]?\s*(\d+\.?\d*)",

        "PLATELETS":
        r"(PLATELETS|PLATELET COUNT|PLT)\s*[:\-]?\s*(\d+\.?\d*)",

        "WBC":
        r"(WBC|WHITE BLOOD CELL)\s*[:\-]?\s*(\d+\.?\d*)",

        "RBC":
        r"(RBC|RED BLOOD CELL)\s*[:\-]?\s*(\d+\.?\d*)",

        "SGOT":
        r"(SGOT|AST)\s*[:\-]?\s*(\d+\.?\d*)",

        "SGPT":
        r"(SGPT|ALT)\s*[:\-]?\s*(\d+\.?\d*)",

        "CREATININE":
        r"(CREATININE)\s*[:\-]?\s*(\d+\.?\d*)",

        "GLUCOSE":
        r"(GLUCOSE|SUGAR)\s*[:\-]?\s*(\d+\.?\d*)",

        "TSH":
        r"(TSH)\s*[:\-]?\s*(\d+\.?\d*)",

        "CHOLESTEROL":
        r"(CHOLESTEROL)\s*[:\-]?\s*(\d+\.?\d*)",

        "HDL":
        r"(HDL)\s*[:\-]?\s*(\d+\.?\d*)",

        "LDL":
        r"(LDL)\s*[:\-]?\s*(\d+\.?\d*)",

        "TRIGLYCERIDES":
        r"(TRIGLYCERIDES)\s*[:\-]?\s*(\d+\.?\d*)",

    }

    for key, pattern in patterns.items():

        match = re.search(pattern, text)

        if match:

            try:

                value = float(match.group(2))

                # Platelet lakh conversion
                if key == "PLATELETS":

                    if value < 1000:

                        value = value * 100000

                # WBC shorthand conversion
                if key == "WBC":

                    if value < 100:

                        value = value * 1000

                parameters[key] = round(value, 2)

            except:
                pass

    return parameters
# -----------------------------
# ANALYZE PARAMETERS
# -----------------------------
def analyze_parameters(parameters):

    results = []

    findings = []

    symptoms = []

    for test, value in parameters.items():

        if test not in standard_ranges:
            continue

        low = standard_ranges[test]["low"]

        high = standard_ranges[test]["high"]

        status = "NORMAL"

        if value < low:

            status = "LOW"

        elif value > high:

            status = "HIGH"

        key = f"{test}:{status}"

        insight = disease_map.get(
            key,
            {
                "condition": "Normal",
                "symptoms": [],
                "notes": "Within normal range."
            }
        )

        results.append({

            "test": test,

            "value": value,

            "status": status,

            "reference_range":
                f"{low} - {high}",

            "condition":
                insight["condition"],

            "notes":
                insight["notes"]

        })

        if insight["condition"] != "Normal":

            findings.append(
                insight["condition"]
            )

            symptoms.extend(
                insight["symptoms"]
            )

    return {

        "results": results,

        "findings": list(set(findings)),

        "symptoms": list(set(symptoms))

    }
# -----------------------------
# SUMMARY
# -----------------------------
def generate_summary(analysis, parameters):

    findings = analysis.get("findings", [])

    symptoms = analysis.get("symptoms", [])

    results = analysis.get("results", [])

    # -----------------------------
    # NORMAL REPORT
    # -----------------------------
    if not findings:

        return """
HEALTH SUMMARY

Your blood report appears mostly within normal ranges.

No major abnormalities were detected from the extracted parameters.

Recommendations:
• Maintain balanced nutrition
• Exercise regularly
• Stay hydrated
• Sleep adequately
• Continue periodic health checkups

Overall health status appears stable.
"""

    # -----------------------------
    # ABNORMAL REPORT
    # -----------------------------
    recommendations = []

    findings_text = []

    for result in results:

        findings_text.append(

            f"• {result['test']} is {result['status']} "
            f"(Value: {result['value']})"

        )

    # -----------------------------
    # PLATELETS
    # -----------------------------
    if "PLATELETS" in parameters:

        platelets = parameters["PLATELETS"]

        if platelets < 150000:

            recommendations.extend([

                "Avoid injury-prone activities",

                "Monitor bruising or bleeding",

                "Maintain hydration",

                "Consult hematologist if symptoms persist"

            ])

    # -----------------------------
    # GLUCOSE
    # -----------------------------
    if "GLUCOSE" in parameters:

        glucose = parameters["GLUCOSE"]

        if glucose > 100:

            recommendations.extend([

                "Reduce sugar intake",

                "Monitor fasting glucose",

                "Increase physical activity",

                "Avoid sugary beverages"

            ])

    # -----------------------------
    # CHOLESTEROL
    # -----------------------------
    if "CHOLESTEROL" in parameters:

        cholesterol = parameters["CHOLESTEROL"]

        if cholesterol > 200:

            recommendations.extend([

                "Reduce saturated fat intake",

                "Increase cardio exercise",

                "Monitor lipid profile regularly"

            ])

    # -----------------------------
    # TRIGLYCERIDES
    # -----------------------------
    if "TRIGLYCERIDES" in parameters:

        triglycerides = parameters["TRIGLYCERIDES"]

        if triglycerides > 150:

            recommendations.extend([

                "Reduce processed foods",

                "Limit alcohol and sugars",

                "Exercise consistently"

            ])

    recommendations = list(set(recommendations))

    return f"""
HEALTH SUMMARY

Detected Conditions:
{', '.join(findings)}

Possible Symptoms:
{', '.join(symptoms) if symptoms else "No major symptoms detected"}

Detailed Findings:
{chr(10).join(findings_text)}

Personalized Recommendations:
{chr(10).join(['• ' + r for r in recommendations])}

IMPORTANT:
This AI analysis is informational only and not a medical diagnosis.

Please consult a licensed physician for professional evaluation.
"""

    if not analysis["findings"]:

        return """
Your blood report appears largely within normal range.

No major abnormalities were detected from the extracted parameters.

Maintain:
• balanced nutrition
• regular exercise
• hydration
• periodic health checkups
"""

    recommendations = []

    findings_text = []

    for result in analysis["results"]:

        findings_text.append(
            f"{result['test']} is {result['status']}."
        )

    # Personalized recommendations
    if "PLATELETS" in parameters:

        platelets = parameters["PLATELETS"]

        if platelets < 150:

            recommendations.extend([

                "Avoid injury-prone activities",

                "Stay hydrated",

                "Consult hematologist if symptoms worsen",

                "Monitor bleeding or bruising"

            ])

    if "GLUCOSE" in parameters:

        if parameters["GLUCOSE"] > 100:

            recommendations.extend([

                "Reduce sugar intake",

                "Exercise regularly",

                "Monitor fasting glucose"

            ])

    if "CHOLESTEROL" in parameters:

        if parameters["CHOLESTEROL"] > 200:

            recommendations.extend([

                "Reduce saturated fats",

                "Increase cardio exercise",

                "Monitor lipid profile"

            ])

    recommendations = list(set(recommendations))

    return f"""
HEALTH SUMMARY

Detected Issues:
{', '.join(analysis['findings'])}

Observed Symptoms:
{', '.join(analysis['symptoms'])}

Detailed Findings:
{chr(10).join(findings_text)}

Personalized Recommendations:
{chr(10).join(['• ' + r for r in recommendations])}

Please consult a physician for professional diagnosis.
"""
# -----------------------------
# HOME ROUTE
# -----------------------------
@app.get("/")
def home():

    return {
        "message": "AI Blood Report Service Running"
    }

# -----------------------------
# ANALYZE ROUTE
# -----------------------------
@app.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    try:

        # SAVE FILE
        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # OCR / PDF EXTRACTION
        extracted_text = extract_text(file_path)

        # PARAMETER EXTRACTION
        parameters = extract_parameters(
            extracted_text
        )

        # AI ANALYSIS
        analysis = analyze_parameters(
            parameters
        )

        # SUMMARY
        summary = generate_summary(
            analysis,
            parameters
        )

        return {

            "success": True,

            "filename": file.filename,

            "parameters": parameters,

            "analysis": analysis,

            "summary": summary,

            "extracted_text": extracted_text,

            "disclaimer":
            "This is not a diagnosis. Consult a physician."

        }

    except Exception as e:

        return {

            "success": False,

            "error": str(e)

        }

    finally:

        # CLEAN TEMP FILE
        if os.path.exists(file_path):

            os.remove(file_path)