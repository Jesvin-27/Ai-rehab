// PoseDetector.js
import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const PoseDetector = ({ isActive, onRepDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const animationFrameRef = useRef(null);

  const repState = useRef('up'); // To track squat motion
  const repCountRef = useRef(0);

  useEffect(() => {
    const setupDetector = async () => {
      await tf.setBackend('webgl');
      const detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      });
      detectorRef.current = detector;
    };
    setupDetector();
  }, []);

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      detectPose();
    };

    const detectPose = async () => {
      if (!detectorRef.current || !videoRef.current) return;

      const poses = await detectorRef.current.estimatePoses(videoRef.current);
      drawResults(poses);
      checkSquatLogic(poses);
      animationFrameRef.current = requestAnimationFrame(detectPose);
    };

    const drawResults = (poses) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      poses.forEach((pose) => {
        pose.keypoints.forEach((kp) => {
          if (kp.score > 0.4) {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'lime';
            ctx.fill();
          }
        });
      });
    };

    const checkSquatLogic = (poses) => {
      if (!poses.length) return;
      const keypoints = poses[0].keypoints;
      const leftHip = keypoints.find((k) => k.name === 'left_hip');
      const leftKnee = keypoints.find((k) => k.name === 'left_knee');

      if (leftHip && leftKnee && leftHip.score > 0.5 && leftKnee.score > 0.5) {
        const verticalDiff = leftHip.y - leftKnee.y;

        if (verticalDiff > 40 && repState.current === 'up') {
          repState.current = 'down';
        } else if (verticalDiff < 20 && repState.current === 'down') {
          repState.current = 'up';
          repCountRef.current += 1;
          onRepDetected(repCountRef.current);
        }
      }
    };

    startCamera();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, [isActive, onRepDetected]);

  return (
    <div className="relative">
      <video ref={videoRef} width="640" height="480" className="w-full rounded-md" />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="absolute top-0 left-0"
      />
    </div>
  );
};

export default PoseDetector;
