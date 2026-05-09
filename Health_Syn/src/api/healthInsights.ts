const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getMedications = async () => {
  const res = await fetch(`${BASE_URL}/medications`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch medications');
  return data;
};

export const addMedication = async (med: { name: string; dosage: string; time: string }) => {
  const res = await fetch(`${BASE_URL}/medications`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(med)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add medication');
  return data;
};

export const updateMedicationStatus = async (id: string, status: string) => {
  const res = await fetch(`${BASE_URL}/medications/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update medication');
  return data;
};