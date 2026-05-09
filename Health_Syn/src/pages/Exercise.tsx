import React, { useState, useEffect } from 'react';
import {
  DumbbellIcon,
  ClockIcon,
  PlayIcon,
  PlusIcon,
  SquareIcon,
  XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getExercises, addExercise, updateExercise } from '../api/exercise';

const defaultExercises = [
  {
    name: 'Morning Yoga Flow',
    duration: '30 min',
    difficulty: 'Beginner',
    calories: 150,
    description: 'Start your day with gentle stretches and breathing exercises',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop'
  },
  {
    name: 'Cardio Blast',
    duration: '45 min',
    difficulty: 'Intermediate',
    calories: 450,
    description: 'High-intensity interval training to boost your metabolism',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=250&fit=crop'
  },
  {
    name: 'Strength Training Circuit',
    duration: '60 min',
    difficulty: 'Advanced',
    calories: 400,
    description: 'Build muscle and increase strength with resistance exercises',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop'
  }
];

export function Exercise() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [showCreateRoutine, setShowCreateRoutine] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    duration: '',
    difficulty: 'Beginner',
    description: ''
  });

  // Load exercises from MongoDB on mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        if (data.length === 0) {
          // Seed default exercises for new users
          const seeded = await Promise.all(
            defaultExercises.map(ex => addExercise(ex))
          );
          setExercises(seeded);
        } else {
          setExercises(data);
        }
      } catch (err) {
        toast.error('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const toggleWorkout = async (exercise: any) => {
    if (activeWorkout === exercise._id) {
      setActiveWorkout(null);
      try {
        await updateExercise(exercise._id, { completed: true });
        toast.success('Workout completed! Great job!');
      } catch (err) {
        toast.error('Failed to update workout');
      }
    } else {
      setActiveWorkout(exercise._id);
      toast.info(`Started ${exercise.name}`);
    }
  };

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutine.name || !newRoutine.duration) {
      toast.error('Please fill in required fields');
      return;
    }
    try {
      const created = await addExercise({
        ...newRoutine,
        calories: 300,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=250&fit=crop'
      });
      setExercises(prev => [created, ...prev]);
      setNewRoutine({ name: '', duration: '', difficulty: 'Beginner', description: '' });
      setShowCreateRoutine(false);
      toast.success('Custom routine created!');
    } catch (err) {
      toast.error('Failed to create routine');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading exercises...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Recommendations</h1>
        <p className="text-gray-600">Personalized workout plans to help you reach your fitness goals</p>
      </div>

      {/* Create Routine Banner */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Create Your Own Routine</h2>
            <p className="text-emerald-50 mb-4">
              Build a custom workout plan tailored to your fitness level and goals
            </p>

            {showCreateRoutine ? (
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">New Routine</h3>
                  <button type="button" onClick={() => setShowCreateRoutine(false)} className="hover:text-emerald-200">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Routine Name"
                  value={newRoutine.name}
                  onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white" />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Duration (e.g. 45 min)"
                    value={newRoutine.duration}
                    onChange={(e) => setNewRoutine({ ...newRoutine, duration: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white" />
                  <select
                    value={newRoutine.difficulty}
                    onChange={(e) => setNewRoutine({ ...newRoutine, difficulty: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white [&>option]:text-gray-900">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <button
                  onClick={handleCreateRoutine}
                  className="w-full py-2 bg-white text-emerald-600 rounded-md font-bold hover:bg-emerald-50 transition-colors">
                  Save Routine
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateRoutine(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                <PlusIcon className="w-5 h-5" />
                Create Routine
              </button>
            )}
          </div>
          <div className="hidden md:block">
            <DumbbellIcon className="w-32 h-32 text-white opacity-20" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended for You</h2>
        <p className="text-gray-600">Based on your fitness level and health goals</p>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div
            key={exercise._id}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${activeWorkout === exercise._id ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-100 hover:shadow-lg'}`}>
            <div className="relative h-48">
              <img
                src={exercise.image}
                alt={exercise.name}
                className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
                {exercise.difficulty}
              </div>
              {activeWorkout === exercise._id && (
                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="px-4 py-2 bg-white text-emerald-600 font-bold rounded-full shadow-lg animate-pulse">
                    In Progress ⏱️
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{exercise.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{exercise.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-600">🔥</span>
                  <span>{exercise.calories} cal</span>
                </div>
              </div>
              <button
                onClick={() => toggleWorkout(exercise)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${activeWorkout === exercise._id ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>
                {activeWorkout === exercise._id ? (
                  <><SquareIcon className="w-5 h-5" /> Stop Workout</>
                ) : (
                  <><PlayIcon className="w-5 h-5" /> Start Workout</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">This Week's Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-3xl font-bold text-emerald-600 mb-1">
              {exercises.filter(e => e.completed).length}
            </p>
            <p className="text-sm text-gray-600">Workouts Completed</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 mb-1">3h 45m</p>
            <p className="text-sm text-gray-600">Total Duration</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600 mb-1">
              {exercises.filter(e => e.completed).reduce((sum, e) => sum + (e.calories || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Calories Burned</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600 mb-1">12</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}