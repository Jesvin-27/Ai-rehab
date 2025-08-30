import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExercisePage.css';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

import { processChairSquat, resetChairSquat } from '../exercises/ChairSquats';
import { processArmCircles, resetArmCircles } from '../exercises/ArmCircles';
import { processLegRaises, resetLegRaises } from '../exercises/LegRaises';
import { processShoulderRolls, resetShoulderRolls } from '../exercises/ShoulderRolls';
import { processChairMarching, resetChairMarching } from '../exercises/ChairMarching';
import { processSeatedArmPunch, resetSeatedArmPunch } from '../exercises/SeatedArmPunch';
import { processArmRaises, resetArmRaises } from '../exercises/ArmRaises';
import { processBalanceTraining, resetBalanceTraining } from '../exercises/BalanceTraining';
import { processSitToStand, resetSitToStand } from '../exercises/SitToStand';
import { processArmReachTouch, resetArmReachTouch } from '../exercises/ArmReachTouch';

const exerciseMap = {
  cardiac: ['Chair Marching', 'Seated Arm Punch', 'Arm Raises'],
  neuro: ['Balance Training', 'Sit-to-Stand Transfers', 'Arm Reach & Touch'],
  ortho: ['Chair Squats', 'Leg Raise', 'Shoulder Rolls'],
  physio: ['Arm Circles', 'Shoulder Rolls', 'Hydration Tips'],
};

const logicMap = {
  'Chair Squats': { process: processChairSquat, reset: resetChairSquat },
  'Arm Circles': { process: processArmCircles, reset: resetArmCircles },
  'Leg Raise': { process: processLegRaises, reset: resetLegRaises },
  'Shoulder Rolls': { process: processShoulderRolls, reset: resetShoulderRolls },
  'Chair Marching': { process: processChairMarching, reset: resetChairMarching },
  'Seated Arm Punch': { process: processSeatedArmPunch, reset: resetSeatedArmPunch },
  'Arm Raises': { process: processArmRaises, reset: resetArmRaises },
  'Balance Training': { process: processBalanceTraining, reset: resetBalanceTraining },
  'Sit-to-Stand Transfers': { process: processSitToStand, reset: resetSitToStand },
  'Arm Reach & Touch': { process: processArmReachTouch, reset: resetArmReachTouch },
};

const ExercisePage = () => {
  const { type } = useParams();
  const exercises = exerciseMap[type] || [];

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const poseRef = useRef(null);

  const [selectedExercise, setSelectedExercise] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [repCount, setRepCount] = useState(0);

  const lastSpeakTimeRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    return () => stopScan(); // Cleanup on unmount
  }, []);

  const speak = (text) => {
    const now = Date.now();
    if (now - lastSpeakTimeRef.current < 2000) return;
    lastSpeakTimeRef.current = now;

    if (!window.speechSynthesis || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const drawKeypoints = (landmarks) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    landmarks.forEach(({ x, y, visibility }) => {
      if (visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'lime';
        ctx.fill();
      }
    });
  };

  const onPoseResults = (results) => {
    const landmarks = results.poseLandmarks;
    if (!landmarks || !selectedExercise) return;

    drawKeypoints(landmarks);

    const { process } = logicMap[selectedExercise] || {};
    if (process) {
      const feedback = process(landmarks);
      if (feedback?.speak) speak(feedback.speak);
      if (feedback?.rep) setRepCount((prev) => prev + 1);
    }
  };

  const startScan = async () => {
    if (!selectedExercise) return alert('Please select an exercise');
    stopScan(); // Reset if already running
    setRepCount(0);
    setIsScanning(true);
    speak(`Starting ${selectedExercise}`);

    if (logicMap[selectedExercise]?.reset) logicMap[selectedExercise].reset();

    const poseDetector = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseDetector.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    poseDetector.onResults(onPoseResults);
    poseRef.current = poseDetector;

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        await poseDetector.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();
  };

  const stopScan = () => {
    setIsScanning(false);
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    speak('Scan stopped');
  };

 const saveData = async () => {
  console.log("Save button clicked"); // 🧪 Check if this shows in console

  const user = auth.currentUser;
  if (!user || !selectedExercise || repCount === 0) {
    speak('Unable to save. Login or reps missing.');
    alert('⚠️ Please login and do at least 1 rep to save.');
    return;
  }

  try {
    await addDoc(collection(db, 'exercise_logs'), {
      uid: user.uid,
      exercise: selectedExercise,
      reps: repCount,
      timestamp: Timestamp.now()
    });

    speak('Exercise data saved');
    alert('✅ Saved successfully to the cloud!');
    console.log('Saved to Firebase');
  } catch (error) {
    console.error('Error saving data:', error);
    speak('Failed to save exercise data');
    alert('❌ Failed to save. Please try again.');
  }
};


  const goToStats = () => {
    if (selectedExercise) {
      navigate(`/stats/${selectedExercise}`);
    } else {
      alert('Select an exercise to view progress');
    }
  };

  return (
    <div className="exercise-container">
      <header className="top-bar">
        AI-Rehab – {selectedExercise || 'Select Exercise'} | Reps: {repCount}
      </header>

      <div className="main-layout">
        <aside className="left-panel">
          {exercises.map((exercise) => (
            <button
              key={exercise}
              className={`exercise-button ${selectedExercise === exercise ? 'active' : ''}`}
              onClick={() => {
                setSelectedExercise(exercise);
                setRepCount(0);
                stopScan();
              }}
            >
              {exercise}
            </button>
          ))}
        </aside>

        <main className="content-panel">
          <div className="canvas-area">
            <video ref={videoRef} className="video-feed" width="640" height="480" playsInline muted />
            <canvas ref={canvasRef} className="canvas-overlay" width="640" height="480" />
          </div>

          <div className="controls">
            <button className="control-btn start" onClick={startScan} disabled={isScanning}>
              Start Scan
            </button>
            <button className="control-btn stop" onClick={stopScan} disabled={!isScanning}>
              Stop Scan
            </button>
            <button className="control-btn save" onClick={saveData}>
              Save
            </button>
            <button onClick={goToStats} className="control-btn stats">
              View Progress
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExercisePage;
