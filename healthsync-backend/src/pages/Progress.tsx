import React, { useState } from 'react';
import { ScaleIcon, FootprintsIcon, FlameIcon } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
const weightData = [
{
  date: 'Jan',
  weight: 75
},
{
  date: 'Feb',
  weight: 74
},
{
  date: 'Mar',
  weight: 73.5
},
{
  date: 'Apr',
  weight: 72.8
},
{
  date: 'May',
  weight: 72
},
{
  date: 'Jun',
  weight: 71.5
}];

const activityData = [
{
  day: 'Mon',
  steps: 8500
},
{
  day: 'Tue',
  steps: 9200
},
{
  day: 'Wed',
  steps: 7800
},
{
  day: 'Thu',
  steps: 10500
},
{
  day: 'Fri',
  steps: 8900
},
{
  day: 'Sat',
  steps: 11200
},
{
  day: 'Sun',
  steps: 9600
}];

const calorieData = [
{
  day: 'Mon',
  intake: 2100,
  burned: 2300
},
{
  day: 'Tue',
  intake: 1950,
  burned: 2200
},
{
  day: 'Wed',
  intake: 2200,
  burned: 2100
},
{
  day: 'Thu',
  intake: 1850,
  burned: 2400
},
{
  day: 'Fri',
  intake: 2000,
  burned: 2250
},
{
  day: 'Sat',
  intake: 2300,
  burned: 2500
},
{
  day: 'Sun',
  intake: 2100,
  burned: 2200
}];

export function Progress() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );
  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Progress & Tracking
        </h1>
        <p className="text-gray-600">
          Monitor your health metrics and track your progress
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTimeRange('daily')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'daily' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
          
          Daily
        </button>
        <button
          onClick={() => setTimeRange('weekly')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'weekly' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
          
          Weekly
        </button>
        <button
          onClick={() => setTimeRange('monthly')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'monthly' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
          
          Monthly
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <ScaleIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Weight Management
              </h2>
              <p className="text-sm text-gray-600">
                Current: 71.5 kg • Goal: 70 kg
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[70, 76]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWeight)" />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FootprintsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Activity Levels
              </h2>
              <p className="text-sm text-gray-600">Daily steps this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="steps" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FlameIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Calorie Balance
              </h2>
              <p className="text-sm text-gray-600">Intake vs. Burned</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calorieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="intake" fill="#f97316" radius={[8, 8, 0, 0]} />
              <Bar dataKey="burned" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Intake</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Burned</span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}