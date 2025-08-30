let isHolding = false;
let holdStart = 0;
let lastSpoken = 0;

export function resetBalanceTraining() {
  isHolding = false;
  holdStart = 0;
  lastSpoken = 0;
}

export function processBalanceTraining(landmarks) {
  const now = Date.now();

  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];

  if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
    return { speak: 'Ensure full body is visible' };
  }

  const leftLegLifted = leftAnkle.y < leftKnee.y - 0.05 && leftKnee.y < leftHip.y;
  const rightLegLifted = rightAnkle.y < rightKnee.y - 0.05 && rightKnee.y < rightHip.y;
  const isLegLifted = leftLegLifted || rightLegLifted;

  if (isLegLifted && !isHolding) {
    isHolding = true;
    holdStart = now;
    return { speak: 'Hold the leg up' };
  }

  if (isLegLifted && isHolding && now - holdStart >= 3000) {
    isHolding = false;
    return { speak: 'Great! Balance complete', rep: 1 };
  }

  if (!isLegLifted && isHolding) {
    isHolding = false;
    return { speak: 'Try again. Lift one leg' };
  }

  if (!isLegLifted && now - lastSpoken > 5000) {
    lastSpoken = now;
    return { speak: 'Please lift one leg and hold' };
  }

  return null;
}
