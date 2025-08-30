let prevState = 'down';

export function resetLegRaises() {
  prevState = 'down';
}

export function processLegRaises(landmarks) {
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];

  if (!rightHip || !rightKnee || !rightAnkle) {
    return { speak: 'Make sure your leg is visible' };
  }

  const getDistance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const hipToAnkleY = rightHip.y - rightAnkle.y;
  const kneeBend = getDistance(rightKnee, rightAnkle);

  if (hipToAnkleY > 0.1 && kneeBend > 0.1 && prevState === 'down') {
    prevState = 'up';
    return { speak: 'Good raise!' };
  }

  if (hipToAnkleY < 0.05 && prevState === 'up') {
    prevState = 'down';
    return { speak: 'Rep complete', rep: 1 };
  }

  return null;
}
