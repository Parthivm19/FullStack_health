import React, { useState, useEffect } from "react";
import {
  DumbbellIcon,
  ClockIcon,
  PlayIcon,
  PlusIcon,
  PauseIcon,
  SquareIcon,
  XIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { toast } from "sonner";

import { getExercises, addExercise, updateExercise } from "../api/exercise";

interface ExerciseType {
  _id?: string;
  name: string;
  duration: string;
  difficulty: string;
  calories: number;
  description: string;
  image: string;
  completed?: boolean;
}

const defaultExercises: ExerciseType[] = [
  {
    name: "Morning Yoga Flow",
    duration: "30 min",
    difficulty: "Beginner",
    calories: 150,
    description: "Start your day with gentle stretches and breathing exercises",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
  },
  {
    name: "Cardio Blast",
    duration: "45 min",
    difficulty: "Intermediate",
    calories: 450,
    description: "High-intensity interval training to boost your metabolism",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=250&fit=crop",
  },
  {
    name: "Strength Training Circuit",
    duration: "60 min",
    difficulty: "Advanced",
    calories: 400,
    description: "Build muscle and increase strength with resistance exercises",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
  },
];

export function Exercise() {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [timerRunning, setTimerRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [audio] = useState<HTMLAudioElement>(new Audio("/music/JK.mp3"));
  const [showCreateRoutine, setShowCreateRoutine] = useState(false);

  const [loading, setLoading] = useState(true);

  const [newRoutine, setNewRoutine] = useState({
    name: "",
    duration: "",
    difficulty: "Beginner",
    description: "",
  });

  // -----------------------------
  // FETCH EXERCISES
  // -----------------------------
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();

        if (data.length === 0) {
          const seeded = await Promise.all(
            defaultExercises.map((ex) => addExercise(ex)),
          );

          setExercises(seeded);
        } else {
          setExercises(data);
        }
      } catch (err) {
        toast.error("Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    audio.src = "/music/JK.mp3";
    audio.load();
    audio.loop = true;
    audio.volume = 0.5;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    };
  }, [audio]);
  // -----------------------------
  // TIMER EFFECT
  // -----------------------------
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && timerRunning) {
      audio.pause();

      audio.currentTime = 0;
      setTimerRunning(false);

      setActiveWorkout(null);

      toast.success("Workout completed!");
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerRunning, timeLeft, audio]);
  // -----------------------------
  // CONVERT DURATION
  // -----------------------------
  const convertDurationToSeconds = (duration: string) => {
    const minutes = parseInt(duration);

    if (isNaN(minutes)) return 0;

    return minutes * 60;
  };

  // -----------------------------
  // FORMAT TIMER
  // -----------------------------
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // -----------------------------
  // START / STOP WORKOUT
  // -----------------------------
  const toggleWorkout = async (exercise: ExerciseType) => {
    if (activeWorkout === exercise._id) {
      audio.pause();

      audio.currentTime = 0;
      setActiveWorkout(null);

      setTimerRunning(false);

      setTimeLeft(0);

      try {
        await updateExercise(exercise._id, {
          completed: true,
        });

        toast.success("Workout completed!");
      } catch (err) {
        toast.error("Failed to update workout");
      }
    } else {
      const seconds = convertDurationToSeconds(exercise.duration);

      setActiveWorkout(exercise._id || null);

      setTimeLeft(seconds);

      setTimerRunning(true);
      audio.pause();
      audio.currentTime = 0;
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.log("Audio error:", err);
      });
      toast.info(`Started ${exercise.name}`);
    }
  };
  // -----------------------------
  // PAUSE / RESUME
  // -----------------------------
  const togglePause = () => {
    if (timerRunning) {
      setTimerRunning(false);

      audio.pause();

      toast.info("Workout paused");
    } else {
      setTimerRunning(true);

      audio.currentTime = 0;

      audio.play().catch((err) => {
        console.log("Audio error:", err);
      });
      toast.success("Workout resumed");
    }
  };

  const toggleMute = () => {
    audio.muted = !isMuted;

    setIsMuted(!isMuted);

    toast.info(isMuted ? "Sound unmuted" : "Sound muted");
  };

  // -----------------------------
  // CREATE ROUTINE
  // -----------------------------
  const exerciseImages = [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=250&fit=crop",
  ];

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoutine.name || !newRoutine.duration) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const randomImage =
        exerciseImages[Math.floor(Math.random() * exerciseImages.length)];

      const created = await addExercise({
        ...newRoutine,
        calories: 300,
        image: randomImage,
      });

      setExercises((prev) => [created, ...prev]);

      setNewRoutine({
        name: "",
        duration: "",
        difficulty: "Beginner",
        description: "",
      });

      setShowCreateRoutine(false);

      toast.success("Custom routine created!");
    } catch (err) {
      toast.error("Failed to create routine");
    }
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading exercises...</div>
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Exercise Recommendations
        </h1>

        <p className="text-gray-600">
          Personalized workout plans to help you reach your fitness goals
        </p>
      </div>

      {/* CREATE ROUTINE */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Create Your Own Routine</h2>

            <p className="text-emerald-50 mb-4">
              Build a custom workout plan tailored to your fitness level and
              goals
            </p>
            {showCreateRoutine ? (
              <div className="bg-white/10 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">New Routine</h3>

                  <button
                    onClick={() => setShowCreateRoutine(false)}
                    className="hover:text-emerald-200"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Routine Name"
                  value={newRoutine.name}
                  onChange={(e) =>
                    setNewRoutine({
                      ...newRoutine,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white"
                />

                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Duration (e.g. 45 min)"
                    value={newRoutine.duration}
                    onChange={(e) =>
                      setNewRoutine({ ...newRoutine, duration: e.target.value })
                    }
                    className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <select
                    value={newRoutine.difficulty}
                    onChange={(e) =>
                      setNewRoutine({
                        ...newRoutine,
                        difficulty: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white [&>option]:text-gray-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <button
                  onClick={handleCreateRoutine}
                  className="w-full py-2 bg-white text-emerald-600 rounded-md font-bold hover:bg-emerald-50 transition-colors"
                >
                  Save Routine
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateRoutine(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
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

      {/* EXERCISE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div
            key={exercise._id}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
              activeWorkout === exercise._id
                ? "border-emerald-500 ring-2 ring-emerald-200"
                : "border-gray-100 hover:shadow-lg"
            }`}
          >
            <div className="relative h-48">
              <img
                src={exercise.image}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />

              {activeWorkout === exercise._id && (
                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                  <span className="px-4 py-2 bg-white text-emerald-600 font-bold rounded-full shadow-lg animate-pulse">
                    {formatTime(timeLeft)} ⏱️
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {exercise.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                {exercise.description}
              </p>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{exercise.duration}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span>🔥</span>
                  <span>{exercise.calories} cal</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* START / STOP BUTTON */}
                <button
                  onClick={() => toggleWorkout(exercise)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeWorkout === exercise._id
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {activeWorkout === exercise._id ? (
                    <>
                      <SquareIcon className="w-5 h-5" />
                      Stop
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-5 h-5" />
                      Start
                    </>
                  )}
                </button>

                {/* PAUSE BUTTON */}
                {activeWorkout === exercise._id && (
                  <>
                    {/* MUTE BUTTON */}
                    <button
                      onClick={toggleMute}
                      className="px-4 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeXIcon className="w-5 h-5" />
                      ) : (
                        <Volume2Icon className="w-5 h-5" />
                      )}
                    </button>

                    {/* PAUSE BUTTON */}
                    <button
                      onClick={togglePause}
                      className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                        timerRunning
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {timerRunning ? (
                        <PauseIcon className="w-5 h-5" />
                      ) : (
                        <PlayIcon className="w-5 h-5" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
