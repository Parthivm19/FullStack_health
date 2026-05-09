const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getExercises = async () => {
  const res = await fetch(`${BASE_URL}/exercise`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch exercises');
  return data;
};

export const addExercise = async (exercise: {
  name: string;
  duration: string;
  difficulty: string;
  description?: string;
  calories?: number;
  image?: string;
}) => {
  const res = await fetch(`${BASE_URL}/exercise`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(exercise)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add exercise');
  return data;
};

export const updateExercise = async (id: string, updates: any) => {
  const res = await fetch(`${BASE_URL}/exercise/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update exercise');
  return data;
};