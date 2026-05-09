import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { HealthInsights } from './pages/HealthInsights';
import { MedicalHistory } from './pages/MedicalHistory';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { DietPlan } from './pages/DietPlan';
import { Exercise } from './pages/Exercise';
import { Toaster } from 'sonner';
export function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="health-insights" element={<HealthInsights />} />
          <Route path="medical-history" element={<MedicalHistory />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="diet-plan" element={<DietPlan />} />
          <Route path="exercise" element={<Exercise />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>);

}