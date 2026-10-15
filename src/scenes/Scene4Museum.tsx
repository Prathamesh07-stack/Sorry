import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SceneId } from '../App'

interface Props {
  onNext: () => void
  onGoTo: (s: SceneId) => void
  foundEgg: (id: string) => void
  easterEggsFound: Set<string>
  soundEnabled: boolean
}

interface Exhibit {
  id: string
  emoji: string
  title: string
  caption: string
  color: string
  easterEgg?: string
}

const EXHIBITS: Exhibit[] = [
  {
    id: 'idiot',
    emoji: '🏆',
    title: 'The Certified Idiot Award',
    caption: 'Awarded for making things more complicated than they needed to be.',
    color: '#fbbf24',
    easterEgg: 'trophy',
  },
  {
    id: 'overthink',
    emoji: '🤔',
    title: 'The Overthinking Department',
    caption: 'An impressive amount of thinking. Not always the right kind.',
    color: '#a78bfa',
  },
  {
    id: 'argument',
    emoji: '📺',
    title: 'The Argument Replay Machine',
    caption: 'Sometimes the solution was probably a conversation.',
    color: '#60a5fa',
  },
  {
    id: 'timemachine',
    emoji: '⏰',
    title: 'The Time Machine That Arrived Late',
    caption: 'Would have been useful before I took so long to fix things.',
    color: '#f472b6',
  },
  {
    id: 'toolkit',
    emoji: '🧰',
    title: 'The Friendship Maintenance Kit',
    caption: 'Essential equipment for handling disagreements like a reasonable human being.',
    color: '#34d399',
  },
  {
    id: 'appreciation',
    emoji: '⭐',
    title: 'The Best-Friend Appreciation Trophy',
    caption: 'Because one disagreement should never make me forget that I value this friendship.',
    color: '#fcd5b5',
    easterEgg: 'trophy',
  },
]

function TrophyAnimation({ color }: { color?: string }) {
  return (
    <motion.div
      animate={{ rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        fontSize: '3rem',
        display: 'block',
        textAlign: 'center',
        filter: color ? `drop-shadow(0 0 16px ${color}80)` : 'none',
      }}
    >
      🏆
    </motion.div>
  )
}

function ThinkingAnimation() {
  return (
    <div style={{ position: 'relative', height: '80px', width: '80px' }}>
      <div style={{ fontSize: '2rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>🤔</div>
      {['?', '?', '!', '?'].map((c, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: `${20 + Math.sin(i * 90 * Math.PI / 180) * 28}px`,
            left: `${40 + Math.cos(i * 90 * Math.PI / 180) * 32}px`,
            color: '#a78bfa',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  )
}

function TVAnimation() {
  return (
    <motion.div
      animate={{ x: [0, -2, 2, 0] }}
      transition={{ duration: 0.3, repeat: Infinity }}
    >
      <svg width="80" height="70" viewBox="0 0 80 70" aria-hidden="true">
        {/* TV body */}
        <rect x="5" y="10" width="70" height="48" rx="6" fill="#1e1b4b" stroke="#4c1d95" strokeWidth="2" />
        {/* Screen */}
        <rect x="12" y="16" width="56" height="36" rx="3" fill="#0d0d2b" />
        {/* Stick figures arguing */}
        <motion.g animate={{ x: [-2, 2, -2] }} transition={{ duration: 0.4, repeat: Infinity }}>
          <circle cx="28" cy="28" r="5" fill="#c4b5fd" />
          <line x1="28" y1="33" x2="28" y2="45" stroke="#c4b5fd" strokeWidth="2" />
          <line x1="28" y1="37" x2="20" y2="42" stroke="#c4b5fd" strokeWidth="2" />
          <motion.line x1="28" y1="37" x2="38" y2="34" stroke="#c4b5fd" strokeWidth="2"
            animate={{ rotate: [-20, 20, -20] }} transition={{ duration: 0.3, repeat: Infinity }}
            style={{ transformOrigin: '28px 37px' }} />
        </motion.g>
        <motion.g animate={{ x: [2, -2, 2] }} transition={{ duration: 0.4, repeat: Infinity }}>
          <circle cx="52" cy="28" r="5" fill="#fcd5b5" />
          <line x1="52" y1="33" x2="52" y2="45" stroke="#fcd5b5" strokeWidth="2" />
          <line x1="52" y1="37" x2="60" y2="42" stroke="#fcd5b5" strokeWidth="2" />
          <motion.line x1="52" y1="37" x2="42" y2="34" stroke="#fcd5b5" strokeWidth="2"
            animate={{ rotate: [20, -20, 20] }} transition={{ duration: 0.3, repeat: Infinity }}
            style={{ transformOrigin: '52px 37px' }} />
        </motion.g>
        {/* Speech bubbles */}
        <motion.text x="18" y="24" fontSize="8" fill="#fbbf24"
          animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}>
          !!
        </motion.text>
        <motion.text x="50" y="24" fontSize="8" fill="#f472b6"
          animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>
          ??
        </motion.text>
        {/* TV legs */}
        <rect x="28" y="58" width="6" height="10" rx="2" fill="#1e1b4b" />
        <rect x="46" y="58" width="6" height="10" rx="2" fill="#1e1b4b" />
        {/* Antenna */}
        <line x1="35" y1="10" x2="30" y2="2" stroke="#4c1d95" strokeWidth="2" />
        <line x1="45" y1="10" x2="50" y2="2" stroke="#4c1d95" strokeWidth="2" />
      </svg>
    </motion.div>
  )
}

function TimeMachineAnimation() {
  return (
    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="32" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" />
        </svg>
      </motion.div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
        ⚙️
      </div>
      {/* Calendar pages flying out */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ position: 'absolute', top: 0, left: '50%', fontSize: '0.7rem' }}
          animate={{
            x: [0, (i - 1) * 30, (i - 1) * 50],
            y: [0, -20, -40],
            opacity: [0.8, 0.4, 0],
            rotate: [0, i * 30 - 30],
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
        >
          📅
        </motion.div>
      ))}
    </div>
  )
}

function ToolkitAnimation() {
  const tools = ['👂', '📓', '⏸️', '📖']
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100px' }}>
      {tools.map((tool, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          style={{ fontSize: '1.5rem' }}
        >
          {tool}
        </motion.div>
      ))}
    </div>
  )
}

function GlowingTrophy() {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'relative', fontSize: '3rem', display: 'inline-block' }}
    >
      <motion.div
        style={{
          position: 'absolute', inset: '-12px',
          background: 'radial-gradient(circle, rgba(251,191,36,0.3), transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      ⭐
    </motion.div>
  )
}

const ANIMATIONS: Record<string, React.ReactNode> = {
  idiot: <TrophyAnimation color="#fbbf24" />,
  overthink: <ThinkingAnimation />,
  argument: <TVAnimation />,
  timemachine: <TimeMachineAnimation />,
  toolkit: <ToolkitAnimation />,
  appreciation: <GlowingTrophy />,
}

export default function Scene4Museum({ onNext, foundEgg }: Props) {
  const [activeExhibit, setActiveExhibit] = useState<string | null>(null)
  const [trophyEgg, setTrophyEgg] = useState(false)

  const handleExhibitClick = (exhibit: Exhibit) => {
    setActiveExhibit(prev => prev === exhibit.id ? null : exhibit.id)
    if (exhibit.easterEgg === 'trophy') {
      setTrophyEgg(true)
      foundEgg('trophy')
      setTimeout(() => setTrophyEgg(false), 4000)
    }
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
        padding: '2rem 1rem',
        paddingTop: 'clamp(2rem, 6vh, 4rem)',
      }}
    >
      {/* Trophy egg message */}
      <AnimatePresence>
        {trophyEgg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: '5rem', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(30,27,75,0.95)', border: '1px solid rgba(251,191,36,0.4)',
              borderRadius: '12px', padding: '12px 20px', zIndex: 200,
              color: '#fbbf24', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
              backdropFilter: 'blur(12px)',
            }}
          >
            🏆 "Certified best friend. Currently working on the improvement part."
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '600px' }}
      >
        <div style={{
          display: 'inline-block',
          background: 'rgba(30,27,75,0.7)',
          border: '1px solid rgba(167,139,250,0.3)',
          borderRadius: '8px',
          padding: '4px 16px',
          marginBottom: '0.75rem',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: '0.9rem', color: '#fcd5b5' }}>
            🎨 admission is free, judgment is not
          </span>
        </div>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
          color: '#f1f0ff',
        }}>
          The Very Unofficial Museum of Best-Friend Nonsense
        </h2>
      </motion.div>

      {/* Exhibits grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
        maxWidth: '900px',
        width: '100%',
      }}>
        {EXHIBITS.map((exhibit, i) => (
          <motion.div
            key={exhibit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.button
              onClick={() => handleExhibitClick(exhibit)}
              whileHover={{ scale: 1.03, boxShadow: `0 10px 40px ${exhibit.color}30` }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                background: activeExhibit === exhibit.id
                  ? `linear-gradient(135deg, ${exhibit.color}20, rgba(30,27,75,0.9))`
                  : 'rgba(30,27,75,0.6)',
                border: `1px solid ${activeExhibit === exhibit.id ? exhibit.color + '60' : 'rgba(167,139,250,0.2)'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'left',
                backdropFilter: 'blur(12px)',
                transition: 'background 0.3s, border-color 0.3s',
              }}
              aria-expanded={activeExhibit === exhibit.id}
              aria-label={`Exhibit: ${exhibit.title}`}
            >
              {/* Exhibit number */}
              <div style={{
                fontFamily: 'Caveat, cursive',
                fontSize: '0.8rem',
                color: exhibit.color,
                marginBottom: '0.75rem',
                opacity: 0.8,
              }}>
                EXHIBIT {String.fromCharCode(65 + i)}
              </div>

              {/* Animation area */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
                minHeight: '80px',
                alignItems: 'center',
              }}>
                {ANIMATIONS[exhibit.id]}
              </div>

              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.05rem',
                color: '#f1f0ff',
                marginBottom: '0.5rem',
                lineHeight: 1.3,
              }}>
                {exhibit.title}
              </h3>

              <AnimatePresence>
                {activeExhibit === exhibit.id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#c4b5fd',
                      lineHeight: 1.6,
                      marginTop: '0.5rem',
                    }}
                  >
                    {exhibit.caption}
                  </motion.p>
                )}
              </AnimatePresence>

              {activeExhibit !== exhibit.id && (
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  color: '#6b5b9e',
                  marginTop: '0.25rem',
                }}>
                  click to read →
                </p>
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Customization note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5 }}
        style={{
          marginTop: '2rem',
          fontFamily: 'Caveat, cursive',
          fontSize: '0.9rem',
          color: '#6b5b9e',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        ✏️ (future exhibits: space reserved for actual memories and inside jokes)
      </motion.div>

      {/* Continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ textAlign: 'center', marginTop: '2.5rem' }}
      >
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
          Head to the constellation →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
