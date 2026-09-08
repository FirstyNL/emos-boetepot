import confetti from "canvas-confetti";

export function fireWelcomeConfetti() {
  const colors = ["#DC2626", "#FACC15", "#0F172A", "#FFFFFF"];

  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.3 },
    colors,
    zIndex: 100,
  });

  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
    colors,
    zIndex: 100,
  });

  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 },
    colors,
    zIndex: 100,
  });
}
