import React, { useState, useEffect } from 'react';
import {
  HeartIcon,
  FootprintsIcon,
  MoonIcon,
  FlameIcon,
  TrendingUpIcon,
  BrainIcon,
  SparklesIcon
} from 'lucide-react';

import { StatCard } from '../components/StatCard';
import { getProgress } from '../api/progress';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function Dashboard() {

  const [chartTab, setChartTab] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );

  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'User';

  useEffect(() => {

    const fetchData = async () => {

      try {

        const data = await getProgress();

        setVitalsHistory(data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, []);

  const latest = vitalsHistory[vitalsHistory.length - 1];

  const heartRateData = vitalsHistory
    .filter(v => v.heartRate)
    .map(v => ({
      name: new Date(v.date).toLocaleDateString(
        'en-US',
        { weekday: 'short' }
      ),
      value: v.heartRate
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userName}! 👋
        </h1>

        <p className="text-gray-600">
          Here's your health summary for today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Heart Rate"
          value={latest?.heartRate || '--'}
          unit="BPM"
          icon={HeartIcon}
          trend={{
            value: 2,
            isPositive: true
          }}
        />

        <StatCard
          title="Steps"
          value={latest?.steps?.toLocaleString() || '--'}
          icon={FootprintsIcon}
          trend={{
            value: 12,
            isPositive: true
          }}
          iconBgColor="bg-blue-100"
        />

        <StatCard
          title="Sleep"
          value={latest?.sleep ? `${latest.sleep}h` : '--'}
          icon={MoonIcon}
          trend={{
            value: 5,
            isPositive: false
          }}
          iconBgColor="bg-purple-100"
        />

        <StatCard
          title="Calories"
          value={latest?.calories || '--'}
          unit="kcal"
          icon={FlameIcon}
          iconBgColor="bg-orange-100"
        />

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
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${chartTab === 'daily'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Daily
              </button>

              <button
                onClick={() => setChartTab('weekly')}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${chartTab === 'weekly'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Weekly
              </button>

              <button
                onClick={() => setChartTab('monthly')}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${chartTab === 'monthly'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Monthly
              </button>

            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>

            <AreaChart data={heartRateData}>

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
                fill="url(#colorValue)"
              />

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
                    Your vitals are now dynamically synced with MongoDB.
                  </p>

                </div>

              </div>

            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">

              <div className="flex items-start gap-3">

                <TrendingUpIcon className="w-5 h-5 mt-1 flex-shrink-0" />

                <div>

                  <p className="font-semibold mb-1">
                    Health Tracking Active
                  </p>

                  <p className="text-sm text-emerald-50">
                    Your dashboard now reflects your real logged vitals.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
