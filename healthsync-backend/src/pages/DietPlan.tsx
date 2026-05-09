import React, { useState } from 'react';
import {
  UtensilsIcon,
  ClockIcon,
  AlertCircleIcon,
  CalendarIcon } from
'lucide-react';
const meals = [
{
  type: 'Breakfast',
  time: '8:00 AM',
  items: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'],
  calories: 350,
  icon: '🥣'
},
{
  type: 'Lunch',
  time: '12:30 PM',
  items: ['Grilled chicken salad', 'Quinoa', 'Mixed vegetables'],
  calories: 520,
  icon: '🥗'
},
{
  type: 'Snack',
  time: '3:30 PM',
  items: ['Apple slices', 'Almonds'],
  calories: 180,
  icon: '🍎'
},
{
  type: 'Dinner',
  time: '7:00 PM',
  items: ['Baked salmon', 'Brown rice', 'Steamed broccoli'],
  calories: 600,
  icon: '🍽️'
}];

const weeklyOverview = [
{
  day: 'Monday',
  calories: 1850,
  focus: 'High Protein'
},
{
  day: 'Tuesday',
  calories: 1900,
  focus: 'Balanced'
},
{
  day: 'Wednesday',
  calories: 1750,
  focus: 'Low Carb'
},
{
  day: 'Thursday',
  calories: 1850,
  focus: 'High Protein'
},
{
  day: 'Friday',
  calories: 1950,
  focus: 'Carb Load'
},
{
  day: 'Saturday',
  calories: 2100,
  focus: 'Cheat Meal Allowed'
},
{
  day: 'Sunday',
  calories: 1800,
  focus: 'Recovery'
}];

export function DietPlan() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Personalized Diet Plan
        </h1>
        <p className="text-gray-600">
          Your customized meal plan based on your health goals
        </p>
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
            <p className="font-semibold text-emerald-900 mb-1">
              Plan Adaptation Needed
            </p>
            <p className="text-sm text-emerald-800">
              Based on your recent activity levels, we recommend adjusting your
              calorie intake. Review suggested changes below.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {activeTab === 'daily' ? "Today's Plan" : 'Weekly Overview'}
          </h2>

          {activeTab === 'daily' ?
          <div className="space-y-4">
              {meals.map((meal, index) =>
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{meal.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {meal.type}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ClockIcon className="w-4 h-4" />
                          <span>{meal.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {meal.calories} cal
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {meal.items.map((item, itemIndex) =>
                <li
                  key={itemIndex}
                  className="flex items-center gap-2 text-gray-700">
                  
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <span>{item}</span>
                      </li>
                )}
                  </ul>
                </div>
            )}
            </div> :

          <div className="space-y-3">
              {weeklyOverview.map((day, index) =>
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{day.day}</h3>
                      <p className="text-sm text-gray-600">
                        Focus: {day.focus}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">
                      {day.calories}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">kcal</span>
                  </div>
                </div>
            )}
            </div>
          }
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Nutritional Summary
          </h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-semibold text-gray-900">
                    1,650 / 1,900
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{
                      width: '87%'
                    }}>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-semibold text-gray-900">
                    120g / 150g
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: '80%'
                    }}>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-semibold text-gray-900">
                    200g / 250g
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: '80%'
                    }}>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Fats</span>
                  <span className="font-semibold text-gray-900">70g / 80g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: '88%'
                    }}>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-3">
              Dietary Recommendations
            </h3>
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
    </div>);

}