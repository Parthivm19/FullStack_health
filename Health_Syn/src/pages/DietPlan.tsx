import React, { useState, useEffect } from 'react';
import {
  UtensilsIcon,
  ClockIcon,
  AlertCircleIcon,
  CalendarIcon,
  PlusIcon,
  XIcon,
  TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getMeals, addMeal, deleteMeal } from '../api/diet';

const weeklyOverview = [
  { day: 'Monday',    calories: 1850, focus: 'High Protein' },
  { day: 'Tuesday',   calories: 1900, focus: 'Balanced' },
  { day: 'Wednesday', calories: 1750, focus: 'Low Carb' },
  { day: 'Thursday',  calories: 1850, focus: 'High Protein' },
  { day: 'Friday',    calories: 1950, focus: 'Carb Load' },
  { day: 'Saturday',  calories: 2100, focus: 'Cheat Meal Allowed' },
  { day: 'Sunday',    calories: 1800, focus: 'Recovery' }
];

const defaultMeals = [
  { type: 'Breakfast', time: '8:00 AM',  items: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'], calories: 350, icon: '🥣' },
  { type: 'Lunch',     time: '12:30 PM', items: ['Grilled chicken salad', 'Quinoa', 'Mixed vegetables'], calories: 520, icon: '🥗' },
  { type: 'Snack',     time: '3:30 PM',  items: ['Apple slices', 'Almonds'], calories: 180, icon: '🍎' },
  { type: 'Dinner',    time: '7:00 PM',  items: ['Baked salmon', 'Brown rice', 'Steamed broccoli'], calories: 600, icon: '🍽️' }
];

export function DietPlan() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    type: 'Breakfast',
    time: '',
    items: '',
    calories: '',
    icon: '🍽️'
  });

  // Load meals from MongoDB on mount
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await getMeals();
        if (data.length === 0) {
          // Seed default meals for new users
          const seeded = await Promise.all(
            defaultMeals.map(meal => addMeal(meal))
          );
          setMeals(seeded);
        } else {
          setMeals(data);
        }
      } catch (err) {
        toast.error('Failed to load meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.type || !newMeal.time || !newMeal.items || !newMeal.calories) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const created = await addMeal({
        type: newMeal.type,
        time: newMeal.time,
        items: newMeal.items.split(',').map(i => i.trim()),
        calories: Number(newMeal.calories),
        icon: newMeal.icon
      });
      setMeals(prev => [...prev, created]);
      setNewMeal({ type: 'Breakfast', time: '', items: '', calories: '', icon: '🍽️' });
      setShowAddMeal(false);
      toast.success('Meal added successfully!');
    } catch (err) {
      toast.error('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      await deleteMeal(id);
      setMeals(prev => prev.filter(m => m._id !== id));
      toast.success('Meal removed');
    } catch (err) {
      toast.error('Failed to delete meal');
    }
  };

  // Calculate totals
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = Math.round(totalCalories * 0.08);
  const totalCarbs = Math.round(totalCalories * 0.13);
  const totalFats = Math.round(totalCalories * 0.04);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading diet plan...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalized Diet Plan</h1>
        <p className="text-gray-600">Your customized meal plan based on your health goals</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'daily' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
          Daily Plan
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'weekly' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
          Weekly Overview
        </button>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircleIcon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-emerald-900 mb-1">Plan Adaptation Needed</p>
            <p className="text-sm text-emerald-800">
              Based on your recent activity levels, we recommend adjusting your calorie intake. Review suggested changes below.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'daily' ? "Today's Plan" : 'Weekly Overview'}
            </h2>
            {activeTab === 'daily' && (
              <button
                onClick={() => setShowAddMeal(!showAddMeal)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                {showAddMeal ? <XIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                <span className="text-sm font-medium">{showAddMeal ? 'Cancel' : 'Add Meal'}</span>
              </button>
            )}
          </div>

          {/* Add Meal Form */}
          {showAddMeal && activeTab === 'daily' && (
            <form onSubmit={handleAddMeal} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snack">Snack</option>
                  <option value="Dinner">Dinner</option>
                </select>
                <input
                  type="text"
                  placeholder="Time (e.g. 8:00 AM)"
                  value={newMeal.time}
                  onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <input
                type="text"
                placeholder="Food items (comma separated e.g. Oatmeal, Banana, Coffee)"
                value={newMeal.items}
                onChange={(e) => setNewMeal({ ...newMeal, items: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500 mb-3" />
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Calories"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                <select
                  value={newMeal.icon}
                  onChange={(e) => setNewMeal({ ...newMeal, icon: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="🥣">🥣 Bowl</option>
                  <option value="🥗">🥗 Salad</option>
                  <option value="🍎">🍎 Snack</option>
                  <option value="🍽️">🍽️ Plate</option>
                  <option value="🥩">🥩 Meat</option>
                  <option value="🥦">🥦 Veggie</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600">
                  Add
                </button>
              </div>
            </form>
          )}

          {activeTab === 'daily' ? (
            <div className="space-y-4">
              {meals.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No meals added yet</div>
              ) : (
                meals.map((meal) => (
                  <div key={meal._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{meal.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{meal.type}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ClockIcon className="w-4 h-4" />
                            <span>{meal.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {meal.calories} cal
                        </span>
                        <button
                          onClick={() => handleDeleteMeal(meal._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {meal.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {weeklyOverview.map((day, index) => (
                <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{day.day}</h3>
                      <p className="text-sm text-gray-600">Focus: {day.focus}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{day.calories}</span>
                    <span className="text-sm text-gray-500 ml-1">kcal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nutritional Summary */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nutritional Summary</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-semibold text-gray-900">{totalCalories} / 1,900</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min((totalCalories / 1900) * 100, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-semibold text-gray-900">{totalProtein}g / 150g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((totalProtein / 150) * 100, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-semibold text-gray-900">{totalCarbs}g / 250g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((totalCarbs / 250) * 100, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Fats</span>
                  <span className="font-semibold text-gray-900">{totalFats}g / 80g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((totalFats / 80) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-3">Dietary Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Stay hydrated - drink 8 glasses of water daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Include more leafy greens in your meals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Reduce sodium intake to support heart health</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}