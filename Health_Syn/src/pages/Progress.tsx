import React, { useState, useEffect } from 'react';
import { ScaleIcon, FootprintsIcon, FlameIcon, PlusIcon, XIcon } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { getProgress, addVitals } from '../api/progress';

// Fallback static data if no real data yet
const fallbackWeight = [
  { date: 'Jan', weight: 75 },
  { date: 'Feb', weight: 74 },
  { date: 'Mar', weight: 73.5 },
  { date: 'Apr', weight: 72.8 },
  { date: 'May', weight: 72 },
  { date: 'Jun', weight: 71.5 }
];

const fallbackActivity = [
  { day: 'Mon', steps: 8500 },
  { day: 'Tue', steps: 9200 },
  { day: 'Wed', steps: 7800 },
  { day: 'Thu', steps: 10500 },
  { day: 'Fri', steps: 8900 },
  { day: 'Sat', steps: 11200 },
  { day: 'Sun', steps: 9600 }
];

const fallbackCalories = [
  { day: 'Mon', intake: 2100, burned: 2300 },
  { day: 'Tue', intake: 1950, burned: 2200 },
  { day: 'Wed', intake: 2200, burned: 2100 },
  { day: 'Thu', intake: 1850, burned: 2400 },
  { day: 'Fri', intake: 2000, burned: 2250 },
  { day: 'Sat', intake: 2300, burned: 2500 },
  { day: 'Sun', intake: 2100, burned: 2200 }
];

export function Progress() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogVitals, setShowLogVitals] = useState(false);
  const [newVitals, setNewVitals] = useState({
    weight: '',
    steps: '',
    sleep: '',
    calories: '',
    heartRate: '',
    water: ''
  });

  // Load progress data from MongoDB on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getProgress();
        setVitalsHistory(data);
      } catch (err) {
        toast.error('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const handleLogVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVitals.weight && !newVitals.steps && !newVitals.sleep) {
      toast.error('Please fill in at least one field');
      return;
    }
    try {
      const created = await addVitals({
        weight:    newVitals.weight    ? Number(newVitals.weight)    : undefined,
        steps:     newVitals.steps     ? Number(newVitals.steps)     : undefined,
        sleep:     newVitals.sleep     ? Number(newVitals.sleep)     : undefined,
        calories:  newVitals.calories  ? Number(newVitals.calories)  : undefined,
        heartRate: newVitals.heartRate ? Number(newVitals.heartRate) : undefined,
        water:     newVitals.water     ? Number(newVitals.water)     : undefined,
      });
      setVitalsHistory(prev => [...prev, created]);
      setNewVitals({ weight: '', steps: '', sleep: '', calories: '', heartRate: '', water: '' });
      setShowLogVitals(false);
      toast.success('Vitals logged successfully!');
    } catch (err) {
      toast.error('Failed to log vitals');
    }
  };

  // Build chart data from real vitals history
  const weightEntries = vitalsHistory.filter(v => v.weight);

  const weightData = weightEntries.length > 0
    ? weightEntries.map(v => ({
        date: new Date(v.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        weight: v.weight
      }))
    : fallbackWeight;

  const activityEntries = vitalsHistory.filter(v => v.steps);

  const activityData = activityEntries.length > 0
    ? activityEntries.map(v => ({
        day: new Date(v.date).toLocaleDateString('en-US', {
          weekday: 'short'
        }),
        steps: v.steps
      }))
    : fallbackActivity;

  const calorieEntries = vitalsHistory.filter(v => v.calories);

  const calorieData = calorieEntries.length > 0
    ? calorieEntries.map(v => ({
        day: new Date(v.date).toLocaleDateString('en-US', {
          weekday: 'short'
        }),
        intake: v.calories,
        burned: Math.round(v.calories * 1.1)
      }))
    : fallbackCalories;


  // Latest vitals for summary
  const latest = vitalsHistory[vitalsHistory.length - 1];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading progress data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress & Tracking</h1>
            <p className="text-gray-600">Monitor your health metrics and track your progress</p>
          </div>
          <button
            onClick={() => setShowLogVitals(!showLogVitals)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            {showLogVitals ? <XIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
            <span className="font-medium">{showLogVitals ? 'Cancel' : 'Log Today\'s Vitals'}</span>
          </button>
        </div>
      </div>

      {/* Log Vitals Form */}
      {showLogVitals && (
        <form onSubmit={handleLogVitals} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Log Today's Vitals</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 71.5"
                value={newVitals.weight}
                onChange={(e) => setNewVitals({ ...newVitals, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
              <input
                type="number"
                placeholder="e.g. 8500"
                value={newVitals.steps}
                onChange={(e) => setNewVitals({ ...newVitals, steps: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sleep (hours)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 7.5"
                value={newVitals.sleep}
                onChange={(e) => setNewVitals({ ...newVitals, sleep: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
              <input
                type="number"
                placeholder="e.g. 1850"
                value={newVitals.calories}
                onChange={(e) => setNewVitals({ ...newVitals, calories: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (BPM)</label>
              <input
                type="number"
                placeholder="e.g. 72"
                value={newVitals.heartRate}
                onChange={(e) => setNewVitals({ ...newVitals, heartRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water (glasses)</label>
              <input
                type="number"
                placeholder="e.g. 8"
                value={newVitals.water}
                onChange={(e) => setNewVitals({ ...newVitals, water: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
            Save Vitals
          </button>
        </form>
      )}

      {/* Latest vitals summary */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {latest.weight && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-emerald-600">{latest.weight} kg</p>
              <p className="text-sm text-gray-600">Latest Weight</p>
            </div>
          )}
          {latest.steps && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-blue-600">{latest.steps.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Latest Steps</p>
            </div>
          )}
          {latest.sleep && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-purple-600">{latest.sleep}h</p>
              <p className="text-sm text-gray-600">Latest Sleep</p>
            </div>
          )}
          {latest.heartRate && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-red-500">{latest.heartRate} BPM</p>
              <p className="text-sm text-gray-600">Heart Rate</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {(['daily', 'weekly', 'monthly'] as const).map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${timeRange === range ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            {range}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Weight Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <ScaleIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Weight Management</h2>
              <p className="text-sm text-gray-600">
                Current: {latest?.weight || '—'} kg • Goal: 70 kg
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
              <YAxis stroke="#9ca3af" domain={['auto', 'auto']} />
              <Tooltip />
              <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FootprintsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Activity Levels</h2>
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

        {/* Calorie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FlameIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Calorie Balance</h2>
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
    </div>
  );
}