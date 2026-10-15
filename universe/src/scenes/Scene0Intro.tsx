import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SceneId } from '../App'

interface Props {
  onNext: () => void
  onGoTo: (s: SceneId) => void
  soundEnabled: boolean
  foundEgg: (id: string) => void
  easterEggsFound: Set<string>
}

// Tiny animated character SVG
function Character({ mood }: { mood: 'nervous' | 'tripped' | 'ready' }) {
  return (
    <motion.svg
      width="80" height="100" viewBox="0 0 80 100"
      aria-hidden="true"
      animate={mood === 'tripped' ? { rotate: [0, -20, 15, -10, 0] } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Body */}
      <ellipse cx="40" cy="75" rx="18" ry="22" fill="#7c3aed" opacity="0.9" />
      {/* Head */}
      <circle cx="40" cy="38" r="18" fill="#fcd5b5" />
      {/* Eyes */}
      {mood === 'nervous' && (
        <>
          <ellipse cx="33" cy="36" rx="3.5" ry="4" fill="#1e1b4b" />
          <ellipse cx="47" cy="36" rx="3.5" ry="4" fill="#1e1b4b" />
          <circle cx="34" cy="35" r="1" fill="white" />
          <circle cx="48" cy="35" r="1" fill="white" />
        </>
      )}
      {mood === 'tripped' && (
        <>
          <path d="M30 35 Q33 32 36 35" stroke="#1e1b4b" strokeWidth="2" fill="none" />
          <path d="M44 35 Q47 32 50 35" stroke="#1e1b4b" strokeWidth="2" fill="none" />
        </>
      )}
      {mood === 'ready' && (
        <>
          <ellipse cx="33" cy="37" rx="3" ry="3.5" fill="#1e1b4b" />
          <ellipse cx="47" cy="37" rx="3" ry="3.5" fill="#1e1b4b" />
          <circle cx="33.5" cy="36" r="1" fill="white" />
          <circle cx="47.5" cy="36" r="1" fill="white" />
          {/* Tiny smile */}
          <path d="M35 43 Q40 48 45 43" stroke="#9d4040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* Sweat drop for nervous */}
      {mood === 'nervous' && (
        <ellipse cx="54" cy="30" rx="3" ry="4" fill="#93c5fd" opacity="0.8" />
      )}
      {/* Arms */}
      <motion.line
        x1="22" y1="65" x2="10" y2="80"
        stroke="#fcd5b5" strokeWidth="5" strokeLinecap="round"
        animate={mood === 'ready' ? { x2: [10, 5], y2: [80, 65] } : {}}
      />
      <motion.line
        x1="58" y1="65" x2="70" y2="75"
        stroke="#fcd5b5" strokeWidth="5" strokeLinecap="round"
      />
      {/* Letter in hand */}
      {mood !== 'tripped' && (
        <g transform="translate(62, 65)">
          <rect x="0" y="0" width="16" height="12" rx="2" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" />
          <path d="M0 0 L8 7 L16 0" stroke="#fbbf24" strokeWidth="1" fill="none" />
        </g>
      )}
      {/* Dropped letter */}
      {mood === 'tripped' && (
        <motion.g
          initial={{ y: 0 }}
          animate={{ y: 20, rotate: 30 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '75px 80px' }}
        >
          <rect x="65" y="78" width="16" height="12" rx="2" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" transform="rotate(30, 73, 84)" />
        </motion.g>
      )}
      {/* Legs */}
      <rect x="30" y="93" width="8" height="7" rx="3" fill="#4c1d95" />
      <rect x="42" y="93" width="8" height="7" rx="3" fill="#4c1d95" />
    </motion.svg>
  )
}

function FloatingIsland({ onClick }: { onClick: () => void }) {
  return (
    <motion.g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Island base */}
      <ellipse cx="200" cy="130" rx="90" ry="22" fill="#1e1b4b" />
      <ellipse cx="200" cy="122" rx="85" ry="18" fill="#2d1b69" />
      {/* Grass top */}
      <ellipse cx="200" cy="115" rx="80" ry="14" fill="#3b0764" />
      <ellipse cx="200" cy="110" rx="75" ry="10" fill="#4c1d95" />
      {/* Small details */}
      <circle cx="155" cy="108" r="4" fill="#6d28d9" />
      <circle cx="245" cy="106" r="5" fill="#7c3aed" />
      <circle cx="175" cy="104" r="3" fill="#8b5cf6" />
      {/* Tiny stars on island */}
      <circle cx="185" cy="100" r="1.5" fill="#fbbf24" opacity="0.9" />
      <circle cx="215" cy="98" r="1" fill="#fbbf24" opacity="0.7" />
      <circle cx="230" cy="103" r="1.5" fill="#fbbf24" opacity="0.8" />
    </motion.g>
  )
}

export default function Scene0Intro({ onNext, foundEgg }: Props) {
  const [phase, setPhase] = useState(0)
  // 0 = dark with distant star
  // 1 = star flickers and island appears
  // 2 = character appears
  // 3 = character trips
  // 4 = character recovers, text reveals
  // 5 = text 2 appears
  // 6 = text 3 + buttons appear

  const [moonEgg, setMoonEgg] = useState(false)
  const [chaiEgg, setChaiEgg] = useState(false)

  useEffect(() => {
    // Auto-advance phases
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3200),
      setTimeout(() => setPhase(4), 4200),
      setTimeout(() => setPhase(5), 5500),
      setTimeout(() => setPhase(6), 7200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleMoonClick = () => {
    setMoonEgg(true)
    foundEgg('moon')
    setTimeout(() => setMoonEgg(false), 4000)
  }

  const handleChaiClick = () => {
    setChaiEgg(true)
    foundEgg('chai')
    setTimeout(() => setChaiEgg(false), 4000)
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'hidden',
      }}
    >
      {/* Moon - Easter Egg */}
      <motion.button
        onClick={handleMoonClick}
        aria-label="Click the moon"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.85 : 0 }}
        style={{
          position: 'absolute', top: '8%', right: '12%',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
            <defs>
              <radialGradient id="moonGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fcd34d" />
              </radialGradient>
            </defs>
            <circle cx="30" cy="30" r="22" fill="url(#moonGrad)" opacity="0.9" />
            <circle cx="22" cy="26" r="4" fill="#fbbf24" opacity="0.3" />
            <circle cx="35" cy="20" r="2.5" fill="#fbbf24" opacity="0.2" />
            <circle cx="38" cy="36" r="3" fill="#fbbf24" opacity="0.25" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {moonEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute', top: '16%', right: '6%',
              background: 'rgba(30,27,75,0.95)',
              border: '1px solid rgba(167,139,250,0.4)',
              borderRadius: '12px',
              padding: '12px 18px',
              maxWidth: '240px',
              fontSize: '0.85rem',
              color: '#c4b5fd',
              zIndex: 200,
              backdropFilter: 'blur(12px)',
            }}
          >
            🌕 "I had a whole speech prepared, and somehow this website became the speech."
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chai cup - Easter Egg */}
      <motion.button
        onClick={handleChaiClick}
        aria-label="Click the chai cup"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 0.8 : 0 }}
        style={{
          position: 'absolute', bottom: '15%', left: '8%',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="50" height="55" viewBox="0 0 50 55" aria-hidden="true">
            {/* Steam */}
            <motion.path d="M18 15 Q20 8 18 2" stroke="#c4b5fd" strokeWidth="1.5" fill="none" strokeLinecap="round"
              animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
            <motion.path d="M25 13 Q27 6 25 0" stroke="#c4b5fd" strokeWidth="1.5" fill="none" strokeLinecap="round"
              animate={{ opacity: [0.6, 0.2, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }} />
            <motion.path d="M32 15 Q34 8 32 2" stroke="#c4b5fd" strokeWidth="1.5" fill="none" strokeLinecap="round"
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }} />
            {/* Cup */}
            <path d="M8 18 L12 48 L38 48 L42 18 Z" fill="#7c3aed" opacity="0.9" />
            <path d="M8 18 Q25 24 42 18" fill="#9d84c9" />
            {/* Tea */}
            <ellipse cx="25" cy="26" rx="14" ry="4" fill="#92400e" opacity="0.7" />
            {/* Saucer */}
            <ellipse cx="25" cy="49" rx="20" ry="4" fill="#4c1d95" />
            {/* Handle */}
            <path d="M42 24 Q52 28 42 36" stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {chaiEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute', bottom: '26%', left: '4%',
              background: 'rgba(30,27,75,0.95)',
              border: '1px solid rgba(167,139,250,0.4)',
              borderRadius: '12px',
              padding: '12px 18px',
              maxWidth: '220px',
              fontSize: '0.85rem',
              color: '#c4b5fd',
              zIndex: 200,
              backdropFilter: 'blur(12px)',
            }}
          >
            ☕ "Imaginary chai. Real apology."
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Island with Character */}
      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="400" height="160" viewBox="0 0 400 160" aria-hidden="true">
                  <defs>
                    <filter id="islandGlow">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" />
                    </filter>
                    <radialGradient id="islandGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#4c1d95" />
                      <stop offset="100%" stopColor="#1e1b4b" />
                    </radialGradient>
                  </defs>
                  {/* Glow under island */}
                  <ellipse cx="200" cy="145" rx="100" ry="15" fill="#7c3aed" opacity="0.15" filter="url(#islandGlow)" />
                  <FloatingIsland onClick={() => {}} />
                  {/* Bridge of light connecting to next island (faint) */}
                  <motion.line
                    x1="290" y1="110" x2="400" y2="90"
                    stroke="rgba(167,139,250,0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </svg>

                {/* Character on the island */}
                {phase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ position: 'absolute', top: '0px', left: '50%', transform: 'translateX(-50%)' }}
                  >
                    <Character mood={phase === 3 ? 'tripped' : phase >= 4 ? 'ready' : 'nervous'} />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Reveals */}
      <div style={{
        textAlign: 'center',
        maxWidth: '540px',
        position: 'relative',
        zIndex: 10,
      }}>
        <AnimatePresence>
          {phase >= 4 && (
            <motion.h1
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                fontWeight: 700,
                color: '#f1f0ff',
                marginBottom: '1.5rem',
                lineHeight: 1.1,
              }}
            >
              Hey, Sid.
            </motion.h1>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 5 && (
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                color: '#c4b5fd',
                marginBottom: '0.75rem',
                lineHeight: 1.7,
              }}
            >
              Okay. I've been meaning to say something for a while.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 6 && (
            <>
              <motion.p
                variants={textVariants}
                initial="hidden"
                animate="visible"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  color: '#a78bfa',
                  marginBottom: '3rem',
                  fontStyle: 'italic',
                }}
              >
                And yes, I took too long. That's kind of the problem.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
              >
                <motion.button
                  onClick={onNext}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                    border: '1px solid rgba(167,139,250,0.4)',
                    borderRadius: '50px',
                    padding: '14px 28px',
                    color: '#f1f0ff',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                  }}
                >
                  Okay, explain yourself. →
                </motion.button>

                <motion.button
                  onClick={onNext}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(167,139,250,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    borderRadius: '50px',
                    padding: '14px 28px',
                    color: '#c4b5fd',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  ✨ Start the story
                </motion.button>
              </motion.div>

              {/* Skip */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.5 }}
                whileHover={{ opacity: 1 }}
                onClick={() => onNext()}
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
                skip intro ↓
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Handwritten annotation */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 0.6, rotate: -5 }}
            transition={{ delay: 0.8 }}
            style={{
              position: 'absolute',
              top: '12%',
              left: '6%',
              fontFamily: 'Caveat, cursive',
              fontSize: '1.1rem',
              color: '#fcd5b5',
              transform: 'rotate(-8deg)',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          >
            (took me long enough)
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
