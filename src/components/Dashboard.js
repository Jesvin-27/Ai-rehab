// src/components/Dashboard.js
import React from "react";
import { FaHeartbeat, FaBrain, FaBone, FaPhone, FaHospital } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../index.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true }); // 🚀 Redirect to login
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out.");
    }
  };

  const exerciseCards = [
    {
      title: "Cardiac Rehab",
      icon: <FaHeartbeat size={24} className="text-red-600" />,
      label: "Heart Health",
      color: "bg-yellow-400",
      exercises: ["Chair Marching", "Seated Arm Punch", "Arm Raises"],
      link: "/exercise/cardiac",
      button: "Start"
    },
    {
      title: "Neuro Rehab",
      icon: <FaBrain size={24} className="text-purple-600" />,
      label: "Neurological Recovery",
      color: "bg-yellow-400",
      exercises: ["Balance Training", "Sit-to-Stand Transfers", "ArmReachTouch"],
      link: "/exercise/neuro",
      button: "Start"
    },
    {
      title: "Orthopedic Rehab",
      icon: <FaBone size={24} className="text-blue-700" />,
      label: "Bone & Joint Recovery",
      color: "bg-yellow-400",
      exercises: ["Chair Squats", "Leg Raise", "Shoulder Rolls"],
      link: "/exercise/ortho",
      button: "Start"
    },
    {
      title: "Physiotherapy Tips",
      icon: <MdTipsAndUpdates size={24} className="text-amber-500" />,
      label: "Guidance",
      color: "bg-yellow-400",
      exercises: ["Arm Circles", "Proper Form", "Rest"],
      link: "/exercise/physio",
      button: "Start"
    },
    {
      title: "Contact Us",
      icon: <FaPhone size={24} className="text-green-600" />,
      label: "Support",
      color: "bg-yellow-400",
      exercises: ["We care a lot about you."],
      link: "/contact",
      button: "Know More"
    },
    {
      title: "Best Rehab Center",
      icon: <FaHospital size={24} className="text-gray-600" />,
      label: "Nearby Help",
      color: "bg-yellow-400",
      exercises: ["Find the closest near me."],
      link: "/centers",
      button: "Find"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-semibold">AI Rehab Dashboard</h1>
        <nav className="space-x-6 flex items-center">
          <button onClick={() => navigate("/home")} className="hover:underline">Home</button>
          <button onClick={() => navigate("/profile")} className="hover:underline">Profile</button>
          <button onClick={handleLogout} className="hover:underline">Logout</button>
          <button
            onClick={() => {
              document.documentElement.classList.toggle("dark");
            }}
            title="Toggle dark mode"
            className="ml-4 text-white hover:text-yellow-300"
          >
            🌙
          </button>
        </nav>
      </header>

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exerciseCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl p-5 transition-transform duration-300 transform hover:scale-105 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              {card.icon}
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{card.title}</h2>
            </div>
            <span
              className={`text-black text-xs font-bold px-3 py-1 rounded-full inline-block w-fit ${card.color} mb-3`}
            >
              {card.label}
            </span>
            <ul className="mb-4 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {card.exercises.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
            <button
              className="self-start text-sm font-medium px-3 py-1 rounded bg-blue-900 text-white hover:bg-blue-700 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-colors"
              onClick={() => navigate(card.link)}
            >
              {card.button}
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
