let lastRaised = false;
let lastSpoken = '';
let lastSpeakTime = 0;

export function resetArmRaises() {
  lastRaised = false;
  lastSpoken = '';
  lastSpeakTime = 0;
}

export function processArmRaises(landmarks) {
  const now = Date.now();
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];

  if (!leftWrist || !rightWrist || !leftShoulder || !rightShoulder) {
    return { speak: 'Ensure your shoulders and arms are in view' };
  }

  const leftRaised = leftWrist.y < leftShoulder.y - 0.05;
  const rightRaised = rightWrist.y < rightShoulder.y - 0.05;

  const bothRaised = leftRaised && rightRaised;

  if (bothRaised && !lastRaised) {
    lastRaised = true;
    return { speak: 'Arms raised', rep: 1 };
  }

  if (!bothRaised && lastRaised) {
    lastRaised = false;
    return { speak: 'Arms lowered' };
  }

  if (!bothRaised && now - lastSpeakTime > 4000) {
    lastSpeakTime = now;
    return { speak: 'Raise both arms above your shoulders' };
  }

  return null;
}
