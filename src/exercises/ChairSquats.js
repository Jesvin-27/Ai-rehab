let prevState = 'standing';
let lastSpeakTime = 0;
let cooldown = false;

export function resetChairSquat() {
  prevState = 'standing';
  lastSpeakTime = 0;
  cooldown = false;
}

function getAngle(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
  const cosineAngle = dot / (magAB * magCB);
  return Math.acos(Math.max(-1, Math.min(1, cosineAngle))) * (180 / Math.PI);
}

export function processChairSquat(landmarks) {
  const now = Date.now();

  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];

  if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
    return { speak: 'Please ensure your full body is visible to the camera.' };
  }

  const leftAngle = getAngle(leftHip, leftKnee, leftAnkle);
  const rightAngle = getAngle(rightHip, rightKnee, rightAnkle);
  const avgAngle = (leftAngle + rightAngle) / 2;

  if (avgAngle < 100 && prevState === 'standing') {
    prevState = 'squatting';
    cooldown = false;
    return { speak: 'Good squat form!' };
  }

  if (avgAngle > 160 && prevState === 'squatting' && !cooldown) {
    prevState = 'standing';
    cooldown = true;
    return { speak: 'Rep complete', rep: 1 };
  }

  // Optional correctional feedback every 5 seconds
  if (avgAngle > 140 && avgAngle < 160 && now - lastSpeakTime > 5000) {
    lastSpeakTime = now;
    return { speak: 'Try squatting deeper' };
  }

  return null;
}

