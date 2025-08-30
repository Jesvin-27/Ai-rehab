let prevState = 'neutral';
let lastSpeakTime = 0;

export function resetShoulderRolls() {
  prevState = 'neutral';
  lastSpeakTime = 0;
}

export function processShoulderRolls(landmarks) {
  const now = Date.now();

  const leftShoulder = landmarks[11]; // x, y, z, visibility
  const rightShoulder = landmarks[12];

  if (!leftShoulder || !rightShoulder) {
    return { speak: 'Shoulders not visible. Align properly with the camera' };
  }

  // Detect circular movement or lift/drop via delta in y axis
  const verticalDiff = Math.abs(leftShoulder.y - rightShoulder.y);
  const motionThreshold = 0.05;

  if (verticalDiff > motionThreshold && prevState === 'neutral') {
    prevState = 'rolling';
    return { speak: 'Good! Keep rolling your shoulders' };
  }

  if (verticalDiff < motionThreshold && prevState === 'rolling') {
    prevState = 'neutral';
    return { speak: 'One rep completed', rep: 1 };
  }

  if (now - lastSpeakTime > 5000 && prevState === 'neutral') {
    lastSpeakTime = now;
    return { speak: 'Try rolling your shoulders more clearly' };
  }

  return null;
}
