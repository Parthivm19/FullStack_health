import React, { useState } from 'react';
import {
  HeartIcon,
  FootprintsIcon,
  MoonIcon,
  FlameIcon,
  TrendingUpIcon,
  BrainIcon,
  SparklesIcon } from
'lucide-react';
import { StatCard } from '../components/StatCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
const vitalsData = {
  daily: [
  {
    name: '6am',
    value: 65
  },
  {
    name: '9am',
    value: 72
  },
  {
    name: '12pm',
    value: 85
  },
  {
    name: '3pm',
    value: 78
  },
  {
    name: '6pm',
    value: 90
  },
  {
    name: '9pm',
    value: 70
  }],

  weekly: [
  {
    name: 'Mon',
    value: 72
  },
  {
    name: 'Tue',
    value: 68
  },
  {
    name: 'Wed',
    value: 75
  },
  {
    name: 'Thu',
    value: 70
  },
  {
    name: 'Fri',
    value: 73
  },
  {
    name: 'Sat',
    value: 69
  },
  {
    name: 'Sun',
    value: 72
  }],

  monthly: [
  {
    name: 'Week 1',
    value: 71
  },
  {
    name: 'Week 2',
    value: 74
  },
  {
    name: 'Week 3',
    value: 70
  },
  {
    name: 'Week 4',
    value: 73
  }]

};
export function Dashboard() {
  const [chartTab, setChartTab] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );
  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Sophie! 👋
        </h1>
        <p className="text-gray-600">Here's your health summary for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Heart Rate"
          value={72}
          unit="BPM"
          icon={HeartIcon}
          trend={{
            value: 2,
            isPositive: true
          }} />
        
        <StatCard
          title="Steps"
          value="8,234"
          icon={FootprintsIcon}
          trend={{
            value: 12,
            isPositive: true
          }}
          iconBgColor="bg-blue-100" />
        
        <StatCard
          title="Sleep"
          value="7h 35m"
          icon={MoonIcon}
          trend={{
            value: 5,
            isPositive: false
          }}
          iconBgColor="bg-purple-100" />
        
        <StatCard
          title="Calories"
          value="1,850"
          unit="kcal"
          icon={FlameIcon}
          iconBgColor="bg-orange-100" />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Heart Rate Trends
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartTab('daily')}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${chartTab === 'daily' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                
                Daily
              </button>
              <button
                onClick={() => setChartTab('weekly')}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${chartTab === 'weekly' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                
                Weekly
              </button>
              <button
                onClick={() => setChartTab('monthly')}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${chartTab === 'monthly' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                
                Monthly
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={vitalsData[chartTab]}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)" />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="w-6 h-6" />
            <h3 className="text-lg font-bold">AI Insights</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BrainIcon className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">
                    Great progress this week!
                  </p>
                  <p className="text-sm text-emerald-50">
                    You've increased your daily steps by 15% compared to last
                    week. Keep it up!
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUpIcon className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Sleep Quality Improving</p>
                  <p className="text-sm text-emerald-50">
                    Your sleep duration has been consistent. Try maintaining
                    your bedtime routine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Today's Goals
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Steps</span>
                <span className="font-semibold text-gray-900">
                  8,234 / 10,000
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{
                    width: '82%'
                  }}>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Calories Burned</span>
                <span className="font-semibold text-gray-900">
                  1,850 / 2,200
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: '84%'
                  }}>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Water Intake</span>
                <span className="font-semibold text-gray-900">
                  6 / 8 glasses
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: '75%'
                  }}>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FootprintsIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">
                  Morning Walk
                </p>
                <p className="text-xs text-gray-500">
                  30 minutes • 2,500 steps
                </p>
              </div>
              <span className="text-xs text-gray-400">8:30 AM</span>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FlameIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">
                  Lunch Logged
                </p>
                <p className="text-xs text-gray-500">650 calories</p>
              </div>
              <span className="text-xs text-gray-400">12:45 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">
                  Cardio Session
                </p>
                <p className="text-xs text-gray-500">
                  45 minutes • 450 cal burned
                </p>
              </div>
              <span className="text-xs text-gray-400">6:00 PM</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Health Score</h3>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none" />
                
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.85)}`}
                  strokeLinecap="round" />
                
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">85</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mb-2">
              Excellent Health Status
            </p>
            <p className="text-xs text-gray-500 text-center">
              Based on your vitals and activity
            </p>
          </div>
        </div>
      </div>
    </div>);

}