const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getMedicalHistory = async () => {
  const res = await fetch(`${BASE_URL}/medical`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch medical history');
  return data;
};

export const addCondition = async (condition: {
  name: string;
  status: string;
  diagnosedDate: string;
}) => {
  const res = await fetch(`${BASE_URL}/medical/conditions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(condition)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add condition');
  return data;
};

export const addReport = async (report: {
  name: string;
  date: string;
  type: string;
  image: string;
}) => {
  const res = await fetch(`${BASE_URL}/medical/reports`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(report)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add report');
  return data;
};