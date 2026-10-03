import confetti from 'canvas-confetti'

export function celebrateSuccess() {
  void confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#10B981', '#F97316', '#0284C7', '#8B5CF6', '#FBBF24'],
  })
}

export function celebrateStars() {
  void confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 35,
    origin: { y: 0.55 },
    colors: ['#FBBF24', '#F97316', '#10B981'],
  })
}
