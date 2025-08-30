let prevState = 'standing';
let lastSpeakTime = 0;

export function resetSitToStand() {
  prevState = 'standing';
  lastSpeakTime = 0;
}

export function processSitToStand(landmarks) {
  const now = Date.now();

  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];

  if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
    return { speak: 'Body not fully visible. Please align properly' };
  }

  const getAngle = (a, b, c) => {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.hypot(ab.x, ab.y);
    const magCB = Math.hypot(cb.x, cb.y);
    return (Math.acos(dot / (magAB * magCB)) * 180) / Math.PI;
  };

  const leftAngle = getAngle(leftHip, leftKnee, leftAnkle);
  const rightAngle = getAngle(rightHip, rightKnee, rightAnkle);
  const avgAngle = (leftAngle + rightAngle) / 2;

  if (avgAngle < 100 && prevState === 'standing') {
    prevState = 'sitting';
    return { speak: 'Good sit position' };
  }

  if (avgAngle > 160 && prevState === 'sitting') {
    prevState = 'standing';
    return { speak: 'Stand complete', rep: 1 };
  }

  if (avgAngle > 140 && now - lastSpeakTime > 4000) {
    lastSpeakTime = now;
    return { speak: 'Try sitting lower' };
  }

  return null;
}
