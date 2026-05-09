const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getProgress = async () => {
  const res = await fetch(`${BASE_URL}/progress`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch progress');
  return data;
};

export const addVitals = async (vitals: {
  heartRate?: number;
  steps?: number;
  sleep?: number;
  calories?: number;
  water?: number;
  weight?: number;
}) => {
  const res = await fetch(`${BASE_URL}/vitals`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(vitals)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save vitals');
  return data;
};