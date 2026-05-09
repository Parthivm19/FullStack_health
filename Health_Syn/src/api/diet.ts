const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getMeals = async () => {
  const res = await fetch(`${BASE_URL}/diet`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch meals');
  return data;
};

export const addMeal = async (meal: {
  type: string;
  time: string;
  items: string[];
  calories: number;
  icon: string;
}) => {
  const res = await fetch(`${BASE_URL}/diet`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(meal)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add meal');
  return data;
};

export const deleteMeal = async (id: string) => {
  const res = await fetch(`${BASE_URL}/diet/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete meal');
  return data;
};