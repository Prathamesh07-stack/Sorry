import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SceneId } from '../App'

interface Props {
  onNext: () => void
  onGoTo: (s: SceneId) => void
  foundEgg: (id: string) => void
  easterEggsFound: Set<string>
  soundEnabled: boolean
  onReplay: () => void
}

const CHOICES = [
  {
    id: 'okay',
    label: 'Okay, I read it.',
    response: 'Thank you for hearing me out, Sid. I appreciate it.',
    emoji: '✦',
    color: '#7c3aed',
  },
  {
    id: 'time',
    label: 'I need some time.',
    response: 'Of course. Take the time you need. There\'s no rush.',
    emoji: '🌙',
    color: '#5b21b6',
  },
  {
    id: 'talk',
    label: 'Let\'s talk sometime.',
    response: 'Whenever you\'re comfortable. I\'ll listen.',
    emoji: '✈️',
    color: '#4c1d95',
  },
]

export default function Scene8Final({ onReplay, onGoTo, foundEgg }: Props) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [showReplay, setShowReplay] = useState(false)
  const [planeEgg, setPlaneEgg] = useState(false)

  const handleChoice = (id: string) => {
    setChosen(id)
    setTimeout(() => setShowReplay(true), 2000)
  }

  const chosenData = CHOICES.find(c => c.id === chosen)

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
      {/* Warm background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(251,191,36,0.15) 0%, rgba(244,114,182,0.08) 40%, transparent 80%)',
        }}
      />

      {/* Glowing particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            borderRadius: '50%',
            background: '#fbbf24',
            zIndex: 2,
            pointerEvents: 'none',
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 6,
          }}
        />
      ))}

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '600px',
        textAlign: 'center',
        padding: '0 1rem',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ marginBottom: '3rem' }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '3rem', marginBottom: '1.5rem' }}
          >
            🌅
          </motion.div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
            color: '#fcd5b5',
            marginBottom: '0.75rem',
          }}>
            That's it from me.
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            color: '#c4b5fd',
            lineHeight: 1.7,
            marginBottom: '0.5rem',
          }}>
            No pressure to respond right now. No right or wrong answer here.
          </p>
          <p style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '1.1rem',
            color: '#9d84c9',
          }}>
            These buttons are just for you — they don't send anything anywhere.
          </p>
        </motion.div>

        {/* Choices or response */}
        <AnimatePresence mode="wait">
          {!chosen ? (
            <motion.div
              key="choices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {CHOICES.map((choice, i) => (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  onClick={() => handleChoice(choice.id)}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: `0 10px 40px ${choice.color}40`,
                    borderColor: choice.color,
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'rgba(30,27,75,0.6)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    borderRadius: '16px',
                    padding: '1.2rem 2rem',
                    color: '#f1f0ff',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'border-color 0.3s',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{choice.emoji}</span>
                  {choice.label}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="response"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background: `linear-gradient(135deg, ${chosenData!.color}25, rgba(30,27,75,0.8))`,
                border: `1px solid ${chosenData!.color}50`,
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                backdropFilter: 'blur(12px)',
                boxShadow: `0 20px 60px ${chosenData!.color}20`,
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{chosenData!.emoji}</div>
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                color: '#fcd5b5',
                lineHeight: 1.65,
                fontStyle: 'italic',
              }}>
                "{chosenData!.response}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post-choice options */}
        <AnimatePresence>
          {showReplay && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <motion.button
                onClick={() => onGoTo(2)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  borderRadius: '50px', padding: '11px 22px',
                  color: '#c4b5fd', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                }}
              >
                ✉️ Re-read the letter
              </motion.button>
              <motion.button
                onClick={onReplay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  borderRadius: '50px', padding: '11px 22px',
                  color: '#c4b5fd', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                }}
              >
                🔄 Replay from the start
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating paper airplane easter egg */}
        <motion.div
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -12, 5, 0],
            rotate: [0, 8, -6, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ marginTop: '2.5rem' }}
        >
          <motion.button
            onClick={() => {
              setPlaneEgg(true)
              foundEgg('airplane')
              setTimeout(() => setPlaneEgg(false), 4000)
            }}
            whileHover={{ scale: 1.2, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Click the paper airplane"
            title="Click me ✦"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              filter: 'drop-shadow(0 4px 12px rgba(251,191,36,0.5))',
            }}
          >
            ✈️
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {planeEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: '1rem',
                background: 'rgba(30,27,75,0.95)',
                border: '1px solid rgba(167,139,250,0.4)',
                borderRadius: '12px',
                padding: '10px 18px',
                display: 'inline-block',
                color: '#c4b5fd',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.88rem',
                backdropFilter: 'blur(12px)',
              }}
            >
              ✈️ "Message delivered. No reply required."
            </motion.div>
          )}
        </AnimatePresence>

        {/* Universe credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
          style={{
            marginTop: '4rem',
            fontFamily: 'Caveat, cursive',
            fontSize: '1rem',
            color: '#6b5b9e',
            lineHeight: 1.7,
          }}
        >
          <p>Made with ✦ and a lot of reflection.</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>
            A Little Universe for Sid — built just for you.
          </p>
        </motion.div>

        {/* Easter egg count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 3 }}
          style={{
            marginTop: '1rem',
            fontFamily: 'Caveat, cursive',
            fontSize: '0.85rem',
            color: '#4b3a70',
          }}
        >
          psst: there are 7 hidden easter eggs in this universe ✦
        </motion.div>
      </div>
    </motion.div>
  )
}
