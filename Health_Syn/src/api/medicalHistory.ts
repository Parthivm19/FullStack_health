const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ------------------------------------
// GET MEDICAL HISTORY
// ------------------------------------
export const getMedicalHistory = async () => {
  const res = await fetch(`${BASE_URL}/medical`, {
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch medical history");
  }

  return data;
};

// ------------------------------------
// GET REPORTS
// ------------------------------------
export const getReports = async () => {
  const res = await fetch(`${BASE_URL}/reports`, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch reports");
  }

  return data;
};

// ------------------------------------
// ADD CONDITION
// ------------------------------------
export const addCondition = async (condition: {
  name: string;
  status: string;
  diagnosedDate: string;
}) => {
  const res = await fetch(`${BASE_URL}/medical/conditions`, {
    method: "POST",

    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },

    body: JSON.stringify(condition),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add condition");
  }

  return data;
};

// ------------------------------------
// UPLOAD REPORT
// ------------------------------------
export const uploadReport = async (file: File) => {
  const formData = new FormData();

  formData.append("report", file);

  const res = await fetch(`${BASE_URL}/reports/analyze-report`, {
    method: "POST",

    headers: getHeaders(),

    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to upload report");
  }

  return data;
};

// ------------------------------------
// DELETE REPORT
// ------------------------------------
export const deleteReport = async (reportId: string) => {
  const res = await fetch(`${BASE_URL}/reports/${reportId}`, {
    method: "DELETE",

    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete report");
  }

  return data;
};
