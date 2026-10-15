import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SceneId } from '../App'
import { audio } from '../utils/audio'

interface Props {
  onNext: () => void
  onGoTo: (s: SceneId) => void
  foundEgg: (id: string) => void
  easterEggsFound: Set<string>
  soundEnabled: boolean
  discoveredStars: Set<number>
  setDiscoveredStars: (s: Set<number>) => void
}

const STAR_DATA = [
  { id: 0, x: 50, y: 25, message: 'I should address problems instead of waiting too long.' },
  { id: 1, x: 72, y: 42, message: 'I should listen before assuming I understand everything.' },
  { id: 2, x: 30, y: 55, message: 'Small fights should not automatically become reasons to give up.' },
  { id: 3, x: 60, y: 68, message: 'I can disagree with someone and still treat them with respect.' },
  { id: 4, x: 22, y: 35, message: 'I should show people that I value them through my actions, not just my words.' },
  { id: 5, x: 82, y: 25, message: 'A sincere apology matters, but consistent behavior matters more.' },
]

// Lines that connect the constellation when all are found
const CONSTELLATION_LINES = [
  [0, 4], [4, 2], [2, 0], [0, 1], [1, 5], [1, 3], [3, 2]
]

export default function Scene5Constellation({ onNext, discoveredStars, setDiscoveredStars }: Props) {
  const [activeMessage, setActiveMessage] = useState<string | null>(null)
  const [paperPlane, setPaperPlane] = useState(false)
  const allFound = discoveredStars.size === STAR_DATA.length
  const svgRef = useRef<SVGSVGElement>(null)

  const handleStarClick = (star: typeof STAR_DATA[0]) => {
    audio.playChime(660 + star.id * 120)
    if (!discoveredStars.has(star.id)) {
      const newSet = new Set([...discoveredStars, star.id])
      setDiscoveredStars(newSet)
      if (newSet.size === STAR_DATA.length) {
        setTimeout(() => setPaperPlane(true), 800)
      }
    }
    setActiveMessage(star.message)
    setTimeout(() => setActiveMessage(null), 3500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '540px' }}
      >
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem', color: '#9d84c9', marginBottom: '0.4rem' }}>
          ✦ tap each star to reveal what I've learned
        </p>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
          color: '#f1f0ff',
        }}>
          The Friendship Constellation
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#6b5b9e', marginTop: '0.5rem' }}>
          {discoveredStars.size}/6 stars discovered
        </p>
      </motion.div>

      {/* Constellation SVG */}
      <div style={{ width: '100%', maxWidth: '700px', position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          style={{ width: '100%', height: 'auto', maxHeight: '60vh', cursor: 'pointer' }}
          aria-label="Friendship constellation - click the stars to reveal lessons"
        >
          {/* Constellation connection lines */}
          {CONSTELLATION_LINES.map(([a, b]) => {
            const starA = STAR_DATA[a]
            const starB = STAR_DATA[b]
            const bothFound = discoveredStars.has(a) && discoveredStars.has(b)
            return (
              <AnimatePresence key={`line-${a}-${b}`}>
                {bothFound && (
                  <motion.line
                    x1={starA.x} y1={starA.y}
                    x2={starB.x} y2={starB.y}
                    stroke="rgba(167,139,250,0.4)"
                    strokeWidth="0.4"
                    strokeDasharray="1 0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                )}
              </AnimatePresence>
            )
          })}

          {/* Stars */}
          {STAR_DATA.map(star => {
            const found = discoveredStars.has(star.id)
            return (
              <g key={star.id} onClick={() => handleStarClick(star)} style={{ cursor: 'pointer' }}>
                {/* Glow */}
                <motion.circle
                  cx={star.x} cy={star.y} r={found ? 4 : 2.5}
                  fill={found ? '#a78bfa' : 'transparent'}
                  opacity={0.2}
                  animate={found ? { r: [3, 5, 3], opacity: [0.15, 0.35, 0.15] } : {}}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                {/* Star body */}
                <motion.circle
                  cx={star.x} cy={star.y}
                  r={found ? 2.5 : 1.8}
                  fill={found ? '#a78bfa' : '#4c1d95'}
                  stroke={found ? '#c4b5fd' : '#7c3aed'}
                  strokeWidth="0.5"
                  animate={found ? { scale: [1, 1.2, 1] } : { opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2 + star.id * 0.3, repeat: Infinity }}
                  whileHover={{ scale: 1.5, fill: '#c4b5fd' }}
                />
                {/* Star number label */}
                {!found && (
                  <text
                    x={star.x} y={star.y - 3.5}
                    textAnchor="middle"
                    fontSize="2.5"
                    fill="rgba(167,139,250,0.5)"
                    fontFamily="Inter, sans-serif"
                  >
                    ✦
                  </text>
                )}
              </g>
            )
          })}

          {/* Paper airplane after all found */}
          <AnimatePresence>
            {paperPlane && allFound && (
              <motion.g
                initial={{ x: -10, y: 80, opacity: 0 }}
                animate={{ x: 110, y: -10, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3, ease: 'easeInOut' }}
              >
                <text x="0" y="0" fontSize="6" textAnchor="middle">✈️</text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Message popup */}
        <AnimatePresence>
          {activeMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              style={{
                position: 'absolute',
                bottom: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(30,27,75,0.95)',
                border: '1px solid rgba(167,139,250,0.4)',
                borderRadius: '12px',
                padding: '12px 20px',
                maxWidth: '320px',
                width: 'calc(100% - 2rem)',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                color: '#c4b5fd',
                backdropFilter: 'blur(12px)',
                zIndex: 50,
              }}
            >
              ✦ {activeMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion reveal */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              marginTop: '3rem',
              maxWidth: '520px',
              padding: '0 1rem',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ fontSize: '2rem', marginBottom: '1rem' }}
            >
              ✈️
            </motion.div>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              color: '#fcd5b5',
              fontStyle: 'italic',
              lineHeight: 1.6,
              marginBottom: '0.75rem',
            }}>
              "Friendship isn't about never having disagreements. It's about how we choose to handle them."
            </p>
            <p style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '1.2rem',
              color: '#a78bfa',
              marginBottom: '2rem',
            }}>
              I want to be better at that.
            </p>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                border: 'none',
                borderRadius: '50px',
                padding: '14px 32px',
                color: '#f1f0ff',
                fontSize: '1rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              Play the mini-game →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 3 }}
        whileHover={{ opacity: 1 }}
        onClick={onNext}
        style={{
          display: 'block',
          margin: '2rem auto 0',
          background: 'none',
          border: 'none',
          color: '#6b5b9e',
          fontSize: '0.8rem',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        skip to game ↓
      </motion.button>
    </motion.div>
  )
}
