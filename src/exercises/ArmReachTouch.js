let isReaching = false;
let lastFeedbackTime = 0;

export function resetArmReachTouch() {
  isReaching = false;
  lastFeedbackTime = 0;
}

export function processArmReachTouch(landmarks) {
  const now = Date.now();

  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const nose = landmarks[0];

  if (!leftWrist || !rightWrist || !nose) {
    return { speak: 'Make sure your face and arms are visible' };
  }

  const isTouching =
    Math.abs(leftWrist.x - nose.x) < 0.08 && Math.abs(leftWrist.y - nose.y) < 0.08;

  if (isTouching && !isReaching) {
    isReaching = true;
    return { speak: 'Nice reach!', rep: 1 };
  }

  if (!isTouching && isReaching) {
    isReaching = false;
    return { speak: 'Return to start position' };
  }

  if (!isTouching && now - lastFeedbackTime > 4000) {
    lastFeedbackTime = now;
    return { speak: 'Try reaching your arm towards your face' };
  }

  return null;
}
