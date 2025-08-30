// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

import Dashboard from './components/Dashboard';
import ExercisePage from './pages/ExercisePage';
import ContactUs from './pages/ContactUs';
import RehabCenter from './pages/RehabCenter';
import StatsPage from './pages/StatsPage';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Login route always accessible */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/exercise/:type" element={user ? <ExercisePage /> : <Navigate to="/login" />} />
        <Route path="/contact" element={user ? <ContactUs /> : <Navigate to="/login" />} />
        <Route path="/centers" element={user ? <RehabCenter /> : <Navigate to="/login" />} />
        <Route path="/stats/:exerciseName" element={user ? <StatsPage /> : <Navigate to="/login" />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
