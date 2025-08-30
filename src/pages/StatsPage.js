// src/pages/StatsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const StatsPage = () => {
  const { exerciseName } = useParams();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.warn('No authenticated user');
        return;
      }

      try {
        const q = query(
          collection(db, 'exercise_logs'),
          where('uid', '==', user.uid),
          where('exercise', '==', exerciseName.trim()),
          orderBy('timestamp')
        );

        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => doc.data());

        console.log('Fetched stats:', docs);

        if (docs.length === 0) {
          setChartData(null);
        } else {
          const dates = docs.map(doc => doc.timestamp.toDate().toLocaleDateString());
          const reps = docs.map(doc => doc.reps);

          setChartData({
            labels: dates,
            datasets: [
              {
                label: `${exerciseName} Progress`,
                data: reps,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3,
              },
            ],
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [exerciseName]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Your Progress: {exerciseName}
      </h2>

      {loading ? (
        <p>Loading data...</p>
      ) : chartData ? (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <Line data={chartData} />
        </div>
      ) : (
        <p>No progress data available for {exerciseName} yet.</p>
      )}
    </div>
  );
};

export default StatsPage;

