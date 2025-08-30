// src/exercises/SeatedArmPunch.js

let punchState = 'ready'; // ready | punched
let lastRepTime = 0;

export function resetSeatedArmPunch() {
  punchState = 'ready';
  lastRepTime = 0;
}

export function processSeatedArmPunch(landmarks) {
  const now = Date.now();

  const rightShoulder = landmarks[12];
  const rightElbow = landmarks[14];
  const rightWrist = landmarks[16];

  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];

  if (!rightShoulder || !rightElbow || !rightWrist || !leftShoulder || !leftElbow || !leftWrist) {
    return { speak: 'Ensure both arms are visible' };
  }

  const getDistance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const rightArmLength = getDistance(rightShoulder, rightWrist);
  const leftArmLength = getDistance(leftShoulder, leftWrist);

  const isPunching = rightArmLength > 0.25 || leftArmLength > 0.25;
  const isReturned = rightArmLength < 0.15 && leftArmLength < 0.15;

  if (punchState === 'ready' && isPunching && now - lastRepTime > 800) {
    punchState = 'punched';
    lastRepTime = now;
    return { speak: 'Good punch!' };
  }

  if (punchState === 'punched' && isReturned) {
    punchState = 'ready';
    return { rep: 1 };
  }

  return null;
}
