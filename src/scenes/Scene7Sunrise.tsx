import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SceneId } from '../App'

interface Props {
  onNext: () => void
  onGoTo: (s: SceneId) => void
  foundEgg: (id: string) => void
  easterEggsFound: Set<string>
  soundEnabled: boolean
}

const STATEMENTS = [
  "I can't change how I handled things before.",
  "But I can take responsibility for it.",
  "I can listen better.",
  "I can communicate sooner.",
  "I can stop treating every small fight like a reason to give up.",
  "And I can try to show up as a better friend through my actions.",
]

const FINAL = [
  "Sid, I'm genuinely sorry.",
  "I took too long to fix things when I should have made the effort sooner. I misunderstood you, and I was wrong to consider letting go over small fights instead of trying to work things out.",
  "I value you as my best friend, and I wanted to make sure you knew that.",
  "I don't expect a website to fix everything. I just hope this shows that I've thought about where I went wrong.",
  "No pressure to reply right now. Take whatever time you need.",
  "Thank you for being part of my life, Sid.",
]

export default function Scene7Sunrise({ onNext, foundEgg }: Props) {
  const [visibleStatements, setVisibleStatements] = useState(0)
  const [showFinal, setShowFinal] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [planeEgg, setPlaneEgg] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    STATEMENTS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleStatements(i + 1), 1200 + i * 1500))
    })
    timers.push(setTimeout(() => setShowFinal(true), 1200 + STATEMENTS.length * 1500 + 800))
    timers.push(setTimeout(() => setShowButton(true), 1200 + STATEMENTS.length * 1500 + 5000))
    return () => timers.forEach(clearTimeout)
  }, [])

  const handlePlaneClick = () => {
    setPlaneEgg(true)
    foundEgg('plane')
    setTimeout(() => setPlaneEgg(false), 4000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
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
      {/* Sunrise sky gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(to top, #fbbf24 0%, #fb923c 15%, #f472b6 30%, #c084fc 50%, #1e1b4b 80%, #070714 100%)',
          opacity: 0.3,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Drifting clouds */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: `${20 + i * 15}%`,
            left: `-10%`,
            width: `${150 + i * 40}px`,
            height: `${40 + i * 10}px`,
            background: `rgba(255,255,255,${0.03 + i * 0.01})`,
            borderRadius: '50%',
            filter: 'blur(20px)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
          animate={{ x: ['0vw', '120vw'] }}
          transition={{
            duration: 30 + i * 8,
            repeat: Infinity,
            delay: i * 6,
            ease: 'linear',
          }}
        />
      ))}

      {/* Character on hill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'fixed',
          bottom: '5%',
          right: '8%',
          zIndex: 3,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {/* Hill */}
        <svg width="200" height="120" viewBox="0 0 200 120">
          <ellipse cx="100" cy="100" rx="105" ry="35" fill="#1e1b4b" opacity="0.8" />
          {/* Character sitting */}
          <g transform="translate(70, 45)">
            <circle cx="20" cy="15" r="12" fill="#fcd5b5" />
            <ellipse cx="20" cy="35" rx="14" ry="16" fill="#7c3aed" />
            {/* Looking at horizon */}
            <ellipse cx="25" cy="14" rx="2.5" ry="3" fill="#1e1b4b" />
            <path d="M16 20 Q20 23 24 20" stroke="#9d4040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Legs dangling */}
            <rect x="8" y="46" width="8" height="14" rx="4" fill="#4c1d95" />
            <rect x="20" y="46" width="8" height="14" rx="4" fill="#4c1d95" />
          </g>
          {/* Lantern beside character */}
          <motion.g
            transform="translate(108, 40)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <circle cx="8" cy="16" r="10" fill="#fbbf24" opacity="0.4" />
            <rect x="5" y="10" width="6" height="14" rx="3" fill="#fbbf24" opacity="0.8" />
            <rect x="4" y="7" width="8" height="5" rx="1" fill="#d97706" />
            <line x1="8" y1="7" x2="8" y2="2" stroke="#d97706" strokeWidth="1.5" />
          </motion.g>
        </svg>
      </motion.div>

      {/* Statements */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '600px',
        textAlign: 'center',
        padding: '0 1rem',
      }}>
        <div style={{ marginBottom: '3rem' }}>
          {STATEMENTS.map((statement, i) => (
            <AnimatePresence key={i}>
              {i < visibleStatements && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    fontFamily: i % 2 === 0 ? 'Playfair Display, serif' : 'Inter, sans-serif',
                    fontSize: i === 0 ? 'clamp(1rem, 3vw, 1.3rem)' : 'clamp(1rem, 3vw, 1.25rem)',
                    color: i < 2 ? '#c4b5fd' : i < 5 ? '#fcd5b5' : '#fbbf24',
                    marginBottom: '1rem',
                    lineHeight: 1.65,
                    fontStyle: i % 2 === 0 ? 'normal' : 'normal',
                    fontWeight: i === 0 ? 400 : 400,
                  }}
                >
                  {statement}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Final message */}
        <AnimatePresence>
          {showFinal && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{
                background: 'rgba(30,27,75,0.5)',
                border: '1px solid rgba(251,191,36,0.2)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                backdropFilter: 'blur(12px)',
                marginBottom: '2rem',
              }}
            >
              {FINAL.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.4, duration: 0.7 }}
                  style={{
                    fontFamily: i === 0 ? 'Playfair Display, serif' : 'Inter, sans-serif',
                    fontSize: i === 0 ? 'clamp(1.2rem, 3.5vw, 1.6rem)' : 'clamp(0.9rem, 2.5vw, 1.05rem)',
                    color: i === 0 ? '#fbbf24' : '#c4b5fd',
                    marginBottom: '0.9rem',
                    lineHeight: 1.75,
                    fontWeight: i === 0 ? 700 : 400,
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paper plane */}
        <AnimatePresence>
          {showFinal && (
            <motion.button
              onClick={handlePlaneClick}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: [0, 40, 80, 120, 160],
                y: [0, -15, -30, -50, -80],
              }}
              transition={{ duration: 4, ease: 'easeInOut', delay: 1 }}
              aria-label="Click the paper airplane"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '2rem', position: 'relative', zIndex: 20,
              }}
            >
              ✈️
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {planeEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(30,27,75,0.95)', border: '1px solid rgba(167,139,250,0.4)',
                borderRadius: '12px', padding: '12px 20px', marginBottom: '1rem',
                color: '#c4b5fd', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                backdropFilter: 'blur(12px)',
              }}
            >
              ✈️ "Message delivered. No reply required."
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onNext}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(251,191,36,0.4)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none', borderRadius: '50px', padding: '15px 36px',
                color: '#1c1917', fontSize: '1rem', fontFamily: 'Inter, sans-serif',
                cursor: 'pointer', fontWeight: 600, letterSpacing: '0.02em',
              }}
            >
              One last thing →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
