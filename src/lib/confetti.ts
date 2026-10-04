import confetti from 'canvas-confetti'

type ConfettiFn = ReturnType<typeof confetti.create>

let board: ConfettiFn | null = null

/** Canvas dédié transparent — évite le flash noir avec backdrop-filter. */
function getBoard(): ConfettiFn {
  if (board) return board

  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999',
    background: 'transparent',
  })
  document.body.appendChild(canvas)

  board = confetti.create(canvas, {
    resize: true,
    useWorker: true,
  })
  return board
}

const palette = ['#10B981', '#F97316', '#0284C7', '#8B5CF6', '#FBBF24']

export function celebrateSuccess() {
  void getBoard()({
    particleCount: 40,
    spread: 55,
    startVelocity: 28,
    origin: { y: 0.7 },
    ticks: 160,
    gravity: 1.15,
    colors: palette,
    disableForReducedMotion: true,
  })
}

export function celebrateStars() {
  void getBoard()({
    particleCount: 70,
    spread: 80,
    startVelocity: 32,
    origin: { y: 0.6 },
    ticks: 180,
    gravity: 1.1,
    colors: ['#FBBF24', '#F97316', '#10B981'],
    disableForReducedMotion: true,
  })
}
