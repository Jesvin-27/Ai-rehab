let direction = 'forward';
let prevAngle = 0;
let completedReps = 0;

export function resetArmCircles() {
  direction = 'forward';
  prevAngle = 0;
  completedReps = 0;
}

export function processArmCircles(landmarks) {
  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];

  if (!leftShoulder || !leftElbow || !leftWrist) {
    return { speak: 'Ensure your left arm is visible' };
  }

  const getAngle = (a, b, c) => {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
    const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
    return (Math.acos(dot / (magAB * magCB)) * 180) / Math.PI;
  };

  const angle = getAngle(leftShoulder, leftElbow, leftWrist);

  if (direction === 'forward' && angle < 90 && prevAngle >= 90) {
    direction = 'backward';
  } else if (direction === 'backward' && angle > 150 && prevAngle <= 150) {
    direction = 'forward';
    completedReps++;
    return { speak: 'Circle complete', rep: 1 };
  }

  prevAngle = angle;
  return null;
}
