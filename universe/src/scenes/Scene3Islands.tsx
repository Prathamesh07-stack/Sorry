import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SceneId } from '../App'
import { audio } from '../utils/audio'

interface Props {
  onNext: () => void
  onGoTo: (s: SceneId) => void
  foundEgg: (id: string) => void
  easterEggsFound: Set<string>
  soundEnabled: boolean
  bridgePlanks: number
  setBridgePlanks: (n: number) => void
}

type IslandId = 1 | 2 | 3

const ISLANDS = [
  {
    id: 1 as IslandId,
    icon: '⏰',
    title: 'The Clock That Kept Ticking',
    headline: 'I took too long.',
    message: 'Waiting too long to address something doesn\'t automatically make it easier to fix. Sometimes it only leaves more room for misunderstanding. I should have made the effort sooner.',
    reveal: 'I can\'t get that time back. I can learn not to repeat the same mistake.',
    action: 'Click the clock to stop it',
    actionLabel: 'Stop the clock',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.4)',
  },
  {
    id: 2 as IslandId,
    icon: '🌫️',
    title: 'The Fog of Assumptions',
    headline: 'I didn\'t understand you properly.',
    message: 'I should not have treated my understanding of the situation as the whole picture. I should have listened, asked questions, and tried to understand your side instead of making assumptions.',
    reveal: 'Understanding starts with listening, not assuming.',
    action: 'Move the lantern to clear the fog',
    actionLabel: 'Clear the fog',
    color: '#6d28d9',
    glow: 'rgba(109,40,217,0.4)',
  },
  {
    id: 3 as IslandId,
    icon: '🌉',
    title: 'The Bridge I Almost Left Behind',
    headline: 'I considered letting go too quickly.',
    message: 'I treated small fights as reasons to consider walking away instead of seeing them as moments where I needed to communicate better. I should have tried to work things out.',
    reveal: 'Repair takes effort from the people involved. An apology can begin that effort, but it cannot decide the outcome.',
    action: 'Click the planks to rebuild the bridge',
    actionLabel: 'Rebuild the bridge',
    color: '#5b21b6',
    glow: 'rgba(91,33,182,0.4)',
  },
]

const PLANK_COUNT = 6

function Island1({ onComplete, completed }: { onComplete: () => void; completed: boolean }) {
  const [stopped, setStopped] = useState(completed)

  const handleStop = () => {
    setStopped(true)
    onComplete()
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="200" height="160" viewBox="0 0 200 160" aria-hidden="true">
        {/* Island */}
        <ellipse cx="100" cy="135" rx="85" ry="18" fill="#1e1b4b" />
        <ellipse cx="100" cy="128" rx="80" ry="14" fill="#2d1b69" />
        <ellipse cx="100" cy="122" rx="74" ry="10" fill="#3b0764" />
        {/* Clock tower */}
        <rect x="78" y="45" width="44" height="75" rx="4" fill="#4c1d95" />
        <rect x="82" y="40" width="36" height="10" rx="2" fill="#5b21b6" />
        {/* Clock face */}
        <circle cx="100" cy="80" r="18" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
        <motion.line x1="100" y1="80" x2="100" y2="65" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round"
          animate={stopped ? {} : { rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 80px' }} />
        <motion.line x1="100" y1="80" x2="112" y2="88" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"
          animate={stopped ? {} : { rotate: [0, 360] }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 80px' }} />
        <circle cx="100" cy="80" r="3" fill="#7c3aed" />
        {/* Calendar pages flying */}
        {!stopped && [0, 1, 2].map(i => (
          <motion.rect key={i} x={60 + i * 15} y={20} width="12" height="16" rx="1" fill="#fef3c7" opacity="0.6"
            animate={{ y: [20, -20], x: [60 + i * 15, 40 + i * 20], rotate: [0, 30 * (i - 1)], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }} />
        ))}
        {/* Still effect when stopped */}
        {stopped && (
          <motion.circle cx="100" cy="80" r="22" stroke="#86efac" strokeWidth="1.5" fill="none"
            initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }} />
        )}
      </svg>
      {!stopped ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStop}
          style={{
            marginTop: '1rem',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid #7c3aed',
            borderRadius: '8px',
            padding: '8px 18px',
            color: '#c4b5fd',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          ⏱️ Stop the clock
        </motion.button>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem', color: '#86efac', marginTop: '0.75rem' }}
        >
          ✓ I can't get that time back. I can learn not to repeat the same mistake.
        </motion.p>
      )}
    </div>
  )
}

function Island2({ onComplete, completed }: { onComplete: () => void; completed: boolean }) {
  const [fogCleared, setFogCleared] = useState(completed)
  const [lanternX, setLanternX] = useState(completed ? 160 : 30)

  const clearFog = () => {
    if (fogCleared) return
    audio.playChime(720)
    setLanternX(160)
    setFogCleared(true)
    onComplete()
  }

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    if (fogCleared) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 200
    setLanternX(Math.max(10, Math.min(190, x)))
    if (x > 110 && !fogCleared) {
      clearFog()
    }
  }

  const handleTouchMove = (e: React.TouchEvent<SVGElement>) => {
    if (fogCleared) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 200
    setLanternX(Math.max(10, Math.min(190, x)))
    if (x > 110 && !fogCleared) {
      clearFog()
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <svg
        width="200" height="160" viewBox="0 0 200 160"
        style={{ cursor: fogCleared ? 'default' : 'pointer', overflow: 'visible' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={clearFog}
        aria-label="Move the lantern to clear the fog"
      >
        {/* Island */}
        <ellipse cx="100" cy="140" rx="85" ry="14" fill="#1e1b4b" />
        <ellipse cx="100" cy="133" rx="80" ry="11" fill="#2d1b69" />
        {/* Forest */}
        {[30, 60, 90, 120, 150].map((x, i) => (
          <g key={i}>
            <rect x={x - 3} y={85 + i % 2 * 10} width="6" height={40 - i % 2 * 10} fill="#3b0764" />
            <polygon points={`${x},${65 + i % 2 * 8} ${x - 14},${90 + i % 2 * 10} ${x + 14},${90 + i % 2 * 10}`} fill="#4c1d95" />
          </g>
        ))}
        {/* Fog */}
        {!fogCleared && (
          <>
            <motion.ellipse cx="70" cy="100" rx="65" ry="30" fill="#4c1d95" opacity="0.5"
              animate={{ scaleX: [1, 1.08, 1], opacity: [0.5, 0.35, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }} />
            <motion.ellipse cx="130" cy="110" rx="70" ry="25" fill="#5b21b6" opacity="0.4"
              animate={{ scaleX: [1, 0.92, 1], opacity: [0.4, 0.55, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }} />
          </>
        )}
        {/* Paths */}
        <path d="M20 135 Q60 115 100 120" stroke="#6d28d9" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="5 4" />
        <path d="M100 120 Q140 125 180 135" stroke="#6d28d9" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="5 4" />
        {/* Lantern */}
        <motion.g style={{ transform: `translateX(${lanternX - 30}px)` }}>
          <circle cx="30" cy="85" r="14" fill="#fbbf24" opacity={fogCleared ? 0.9 : 0.7} />
          <motion.circle cx="30" cy="85" r="24" fill="#fbbf24" opacity="0.15"
            animate={{ r: [24, 32, 24] }} transition={{ duration: 2, repeat: Infinity }} />
          <rect x="26" y="70" width="8" height="6" rx="2" fill="#d97706" />
          <line x1="30" y1="70" x2="30" y2="60" stroke="#d97706" strokeWidth="1.5" />
        </motion.g>
      </svg>
      {!fogCleared ? (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <motion.button
            onClick={clearFog}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(124,58,237,0.15))',
              border: '1px solid rgba(167,139,250,0.5)',
              borderRadius: '50px',
              padding: '8px 20px',
              color: '#f3e8ff',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 15px rgba(167,139,250,0.2)',
            }}
          >
            🏮 Clear the fog
          </motion.button>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9d84c9' }}>
            drag lantern or click anywhere to clear
          </span>
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem', color: '#86efac', marginTop: '0.75rem' }}
        >
          ✓ Understanding starts with listening, not assuming.
        </motion.p>
      )}
    </div>
  )
}

function Island3({ planks, onPlankClick, completed }: { planks: number; onPlankClick: () => void; completed: boolean }) {
  const handlePlankAction = () => {
    if (completed) return
    audio.playChime(520 + planks * 80)
    onPlankClick()
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <svg
        width="220" height="160" viewBox="0 0 220 160"
        aria-label="Bridge with planks to repair"
        style={{ cursor: completed ? 'default' : 'pointer' }}
        onClick={handlePlankAction}
      >
        {/* Left island */}
        <ellipse cx="45" cy="130" rx="42" ry="14" fill="#1e1b4b" />
        <ellipse cx="45" cy="124" rx="38" ry="10" fill="#2d1b69" />
        <ellipse cx="45" cy="119" rx="33" ry="7" fill="#3b0764" />
        {/* Right island */}
        <ellipse cx="175" cy="130" rx="42" ry="14" fill="#1e1b4b" />
        <ellipse cx="175" cy="124" rx="38" ry="10" fill="#2d1b69" />
        <ellipse cx="175" cy="119" rx="33" ry="7" fill="#3b0764" />
        {/* Character repairing */}
        <g transform="translate(30, 85)">
          <circle cx="15" cy="12" r="8" fill="#fcd5b5" />
          <ellipse cx="15" cy="26" rx="8" ry="10" fill="#7c3aed" />
          {/* Arm with hammer */}
          <motion.line x1="20" y1="20" x2="32" y2="30" stroke="#fcd5b5" strokeWidth="3" strokeLinecap="round"
            animate={{ rotate: completed ? 0 : [0, -30, 0] }}
            transition={{ duration: 0.8, repeat: completed ? 0 : Infinity }}
            style={{ transformOrigin: '20px 20px' }} />
        </g>
        {/* River */}
        <motion.path d="M85 80 Q110 90 135 80 Q150 70 165 80" stroke="rgba(96,165,250,0.3)" strokeWidth="15" fill="none"
          animate={{ d: ['M85 80 Q110 90 135 80 Q150 70 165 80', 'M85 85 Q110 75 135 85 Q150 95 165 85'] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }} />
        {/* Bridge rails */}
        <line x1="80" y1="95" x2="140" y2="95" stroke="#5b21b6" strokeWidth="3" opacity="0.6" />
        <line x1="80" y1="108" x2="140" y2="108" stroke="#5b21b6" strokeWidth="3" opacity="0.6" />
        {/* Planks */}
        {Array.from({ length: PLANK_COUNT }, (_, i) => {
          const isBuilt = i < planks
          const x = 80 + (i * 10)
          return (
            <motion.rect
              key={i}
              x={x + 1} y={94} width={8} height={16}
              rx="2"
              fill={isBuilt ? '#fbbf24' : '#1e1b4b'}
              stroke={isBuilt ? '#d97706' : '#3b0764'}
              strokeWidth="1.5"
              initial={isBuilt ? { scaleY: 0 } : {}}
              animate={isBuilt ? { scaleY: 1 } : {}}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          )
        })}
        {/* Completion glow */}
        {completed && (
          <motion.line x1="80" y1="101" x2="140" y2="101" stroke="#fbbf24" strokeWidth="5"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7] }} transition={{ duration: 1 }} />
        )}
      </svg>
      {!completed ? (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <motion.button
            onClick={handlePlankAction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(245,158,11,0.2))',
              border: '1px solid rgba(251,191,36,0.6)',
              borderRadius: '50px',
              padding: '8px 22px',
              color: '#fef3c7',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 15px rgba(251,191,36,0.25)',
            }}
          >
            🔨 Place plank ({planks}/{PLANK_COUNT})
          </motion.button>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#9d84c9' }}>
            click bridge or tap button to add a plank
          </span>
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem', color: '#86efac', marginTop: '0.75rem' }}
        >
          ✓ Repair takes effort. An apology can begin that effort, but cannot decide the outcome.
        </motion.p>
      )}
    </div>
  )
}

export default function Scene3Islands({ onNext, bridgePlanks, setBridgePlanks }: Props) {
  const [islandProgress, setIslandProgress] = useState<Set<IslandId>>(new Set())
  const [activeIsland, setActiveIsland] = useState<IslandId | null>(1)
  const allDone = islandProgress.size === 3 && bridgePlanks >= PLANK_COUNT

  const complete = (id: IslandId) => setIslandProgress(prev => new Set([...prev, id]))

  const islands = ISLANDS.map(island => ({
    ...island,
    completed: island.id === 3 ? bridgePlanks >= PLANK_COUNT : islandProgress.has(island.id),
  }))

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
        justifyContent: 'flex-start',
        padding: '2rem 1rem',
        paddingTop: 'clamp(2rem, 8vh, 5rem)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '600px' }}
      >
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
          color: '#f1f0ff',
          marginBottom: '0.5rem',
        }}>
          Three Things I Needed to Understand
        </h2>
        <p style={{ fontFamily: 'Caveat, cursive', color: '#9d84c9', fontSize: '1rem' }}>
          three floating islands, three mistakes, three lessons
        </p>
      </motion.div>

      {/* Island tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {islands.map(island => (
          <motion.button
            key={island.id}
            onClick={() => setActiveIsland(island.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: activeIsland === island.id ? island.color : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeIsland === island.id ? island.color : 'rgba(167,139,250,0.2)'}`,
              borderRadius: '50px',
              padding: '8px 20px',
              color: activeIsland === island.id ? 'white' : '#c4b5fd',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeIsland === island.id ? `0 0 20px ${island.glow}` : 'none',
            }}
          >
            <span>{island.icon}</span>
            <span>{island.completed ? '✓' : `Island ${island.id}`}</span>
          </motion.button>
        ))}
      </div>

      {/* Active island */}
      <AnimatePresence mode="wait">
        {islands.map(island => activeIsland === island.id && (
          <motion.div
            key={island.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            style={{
              maxWidth: '680px',
              width: '100%',
              background: 'rgba(30,27,75,0.6)',
              border: `1px solid ${island.color}40`,
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              backdropFilter: 'blur(12px)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${island.color}20`,
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: '0.9rem', color: '#9d84c9', marginBottom: '0.5rem' }}>
                {island.icon} {island.title}
              </p>
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                color: '#f1f0ff',
                marginBottom: '1rem',
                fontStyle: 'italic',
              }}>
                {island.headline}
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                color: '#c4b5fd',
                lineHeight: 1.75,
                marginBottom: '2rem',
              }}>
                {island.message}
              </p>
            </motion.div>

            {/* Interactive element */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {island.id === 1 && (
                <Island1 completed={islandProgress.has(1)} onComplete={() => complete(1)} />
              )}
              {island.id === 2 && (
                <Island2 completed={islandProgress.has(2)} onComplete={() => complete(2)} />
              )}
              {island.id === 3 && (
                <Island3
                  planks={bridgePlanks}
                  completed={bridgePlanks >= PLANK_COUNT}
                  onPlankClick={() => setBridgePlanks(Math.min(bridgePlanks + 1, PLANK_COUNT))}
                />
              )}
            </div>

            {/* Bridge of light to next island */}
            {island.id < 3 && (
              <motion.div
                style={{ textAlign: 'center' }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span style={{ color: '#7c3aed', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
                  ✦ ─────── ✦ ─────── ✦
                </span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* End message + continue */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginTop: '2rem', maxWidth: '480px' }}
          >
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              color: '#fcd5b5',
              fontStyle: 'italic',
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}>
              "Three things I can't undo. Three things I can learn from."
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
              Visit the museum →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip option */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2 }}
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
        skip ahead ↓
      </motion.button>
    </motion.div>
  )
}
