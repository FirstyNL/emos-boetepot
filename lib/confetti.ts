import confetti from "canvas-confetti";

export function fireWelcomeConfetti() {
  // Echte euro-kleuren: diep groen, helder groen, goud en accenten
  const euroColors = ["#15803d", "#22c55e", "#16a34a", "#facc15", "#eab308"];

  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.3 },
    colors: euroColors,
    shapes: ["square"],
    scalar: 1.4, // Maakt ze wat breder/rechthoekiger als briefjes
    zIndex: 100,
  });

  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
    colors: euroColors,
    shapes: ["square"],
    scalar: 1.4,
    zIndex: 100,
  });

  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 },
    colors: euroColors,
    shapes: ["square"],
    scalar: 1.4,
    zIndex: 100,
  });
}