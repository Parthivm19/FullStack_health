from fastapi import FastAPI, UploadFile, File
import shutil
import os
import pdfplumber
import re

app = FastAPI()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------------------------------------------------
# FUNCTION TO EXTRACT TEXT FROM PDF
# ---------------------------------------------------
def extract_text_from_pdf(pdf_path):

    text = ""

    with pdfplumber.open(pdf_path) as pdf:

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:
                text += extracted + "\n"

    return text


# ---------------------------------------------------
# FUNCTION TO EXTRACT BLOOD PARAMETERS
# ---------------------------------------------------
def extract_parameters(text):

    parameters = {}

    text = text.replace("\n", " ")

    patterns = {
        "Hemoglobin": r"(HAEMOGLOBIN|Hemoglobin|Hb|HGB).*?(\d+\.?\d*)",
        "Platelets": r"(PLATELET COUNT|Platelets|PLT).*?(\d+\.?\d*)",
        "AST": r"(AST|SGOT).*?(\d+\.?\d*)"
    }

    for key, pattern in patterns.items():

        match = re.search(pattern, text, re.IGNORECASE)

        if match:

            try:
                value = float(match.group(2))
                parameters[key] = value

            except:
                pass

    return parameters
  


# ---------------------------------------------------
# FUNCTION TO ANALYZE PARAMETERS
# ---------------------------------------------------
def analyze_parameters(params):

    findings = []

    symptoms = []

    # Hemoglobin analysis
    if "Hemoglobin" in params and params["Hemoglobin"] < 12:

        findings.append("Possible Iron Deficiency Anemia")

        symptoms.extend([
            "fatigue",
            "pale skin",
            "breathlessness"
        ])

    # Platelet analysis
    if "Platelets" in params:
        platelet_value = params["Platelets"]

        # Convert lakh values to actual count
        if platelet_value < 1000:
            platelet_value = platelet_value * 100000

        if platelet_value < 150000:

            findings.append("Possible Thrombocytopenia")

            symptoms.extend([
                "easy bruising",
                "bleeding"
            ])

    # AST analysis
    if "AST" in params and params["AST"] > 40:

        findings.append("Possible Liver Dysfunction or Muscle Damage")

        symptoms.extend([
            "abdominal pain"
        ])

    return {
        "findings": list(set(findings)),
        "symptoms": list(set(symptoms))
    }


# ---------------------------------------------------
# HOME ROUTE
# ---------------------------------------------------
@app.get("/")
def home():

    return {
        "message": "Blood Report Analysis Service Running"
    }


# ---------------------------------------------------
# MAIN ANALYZE ROUTE
# ---------------------------------------------------
@app.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(file_path)

    # Extract blood parameters
    parameters = extract_parameters(extracted_text)

    # Analyze extracted parameters
    analysis = analyze_parameters(parameters)

    # Final response
    return {
        "filename": file.filename,
        "parameters": parameters,
        "analysis": analysis,
        "disclaimer":
        "This is not a diagnosis. Please consult a physician for confirmation and treatment."
    }