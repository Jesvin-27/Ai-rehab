let prevState = 'down';
let lastSpeakTime = 0;

export function resetChairMarching() {
  prevState = 'down';
  lastSpeakTime = 0;
}

export function processChairMarching(landmarks) {
  const now = Date.now();
  const rightKnee = landmarks[26];
  const rightHip = landmarks[24];

  if (!rightKnee || !rightHip) return { speak: 'Body not visible' };

  const kneeLifted = rightKnee.y < rightHip.y - 0.1; // Lift threshold

  if (kneeLifted && prevState === 'down') {
    prevState = 'up';
    return { speak: 'Good lift', rep: 1 };
  }

  if (!kneeLifted && prevState === 'up') {
    prevState = 'down';
  }

  if (!kneeLifted && now - lastSpeakTime > 4000) {
    lastSpeakTime = now;
    return { speak: 'Lift your knee higher' };
  }

  return null;
}
