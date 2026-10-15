import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SceneId } from '../App'
import { audio } from '../utils/audio'

interface Props {
  onNext: () => void
  onGoTo: (s: SceneId) => void
  foundEgg: (id: string) => void
  easterEggsFound: Set<string>
  soundEnabled: boolean
  gameComplete: boolean
  setGameComplete: (v: boolean) => void
}

const WORLD_W = 800
const WORLD_H = 500
const CHAR_W = 32
const CHAR_H = 40
const SPEED = 4

interface GameObj {
  id: string
  x: number
  y: number
  w: number
  h: number
  collected?: boolean
  defeated?: boolean
}

const ITEMS_INIT: GameObj[] = [
  { id: 'lantern', x: 680, y: 340, w: 36, h: 36 },
  { id: 'toolkit', x: 100, y: 80, w: 36, h: 36 },
  { id: 'clock', x: 400, y: 160, w: 36, h: 36 },
  { id: 'badge', x: 580, y: 80, w: 36, h: 36 },
]

const OBSTACLES_INIT: GameObj[] = [
  { id: 'excuse', x: 280, y: 300, w: 60, h: 60 },
  { id: 'fog', x: 500, y: 200, w: 70, h: 50 },
  { id: 'cloud', x: 200, y: 180, w: 60, h: 40 },
  { id: 'ego', x: 650, y: 200, w: 70, h: 70 },
]

const ITEM_INFO: Record<string, { label: string; emoji: string; desc: string }> = {
  lantern: { label: 'Listening Lantern', emoji: '🏮', desc: 'Represents listening instead of assuming.' },
  toolkit: { label: 'Communication Toolkit', emoji: '🧰', desc: 'Represents talking about problems before they grow.' },
  clock: { label: 'Patience Clock', emoji: '⏰', desc: 'Represents not waiting to address an issue.' },
  badge: { label: 'Accountability Badge', emoji: '🎖️', desc: 'Represents admitting mistakes without excuses.' },
}

const OBSTACLE_INFO: Record<string, { label: string; emoji: string; action: string }> = {
  excuse: { label: 'Excuse Machine', emoji: '🤖', action: 'Turn it off' },
  fog: { label: 'Assumption Fog', emoji: '🌫️', action: 'Clear it' },
  cloud: { label: 'Overthinking Cloud', emoji: '💭', action: 'Slow it down' },
  ego: { label: 'Ego Monster', emoji: '😤', action: 'Acknowledge a mistake' },
}

function overlap(a: { x: number; y: number; w: number; h: number }, b: GameObj) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

export default function Scene6Game({ onNext, foundEgg, gameComplete, setGameComplete }: Props) {
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [items, setItems] = useState<GameObj[]>(ITEMS_INIT.map(i => ({ ...i })))
  const [obstacles, setObstacles] = useState<GameObj[]>(OBSTACLES_INIT.map(o => ({ ...o })))
  const [charPos, setCharPos] = useState({ x: 50, y: 300 })
  const [facing, setFacing] = useState<'left' | 'right'>('right')
  const [flash, setFlash] = useState<string | null>(null)
  const [egoEgg, setEgoEgg] = useState(false)
  const keys = useRef<Set<string>>(new Set())
  const animRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const startedRef = useRef(false)
  const charRef = useRef(charPos)
  charRef.current = charPos

  const collected = items.filter(i => i.collected).length
  const totalItems = items.length

  const resetGame = () => {
    setItems(ITEMS_INIT.map(i => ({ ...i })))
    setObstacles(OBSTACLES_INIT.map(o => ({ ...o })))
    setCharPos({ x: 50, y: 300 })
    setFacing('right')
    setFlash(null)
    setGameComplete(false)
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keys.current.add(e.key)
    if (e.key === 'Escape' || e.key === 'p') {
      setPaused(p => !p)
    }
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keys.current.delete(e.key)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  const gameLoop = useCallback(() => {
    if (pausedRef.current || !startedRef.current) {
      animRef.current = requestAnimationFrame(gameLoop)
      return
    }

    setCharPos(prev => {
      let { x, y } = prev

      if (keys.current.has('ArrowLeft') || keys.current.has('a') || keys.current.has('A')) {
        x = Math.max(0, x - SPEED)
        setFacing('left')
      }
      if (keys.current.has('ArrowRight') || keys.current.has('d') || keys.current.has('D')) {
        x = Math.min(WORLD_W - CHAR_W, x + SPEED)
        setFacing('right')
      }
      if (keys.current.has('ArrowUp') || keys.current.has('w') || keys.current.has('W')) {
        y = Math.max(0, y - SPEED)
      }
      if (keys.current.has('ArrowDown') || keys.current.has('s') || keys.current.has('S')) {
        y = Math.min(WORLD_H - CHAR_H, y + SPEED)
      }

      const hitbox = { x, y, w: CHAR_W, h: CHAR_H }

      // Check item pickups
      setItems(prev => prev.map(item => {
        if (!item.collected && overlap(hitbox, item)) {
          audio.playCollect()
          setFlash(`Picked up: ${ITEM_INFO[item.id].label}!`)
          setTimeout(() => setFlash(null), 2000)
          return { ...item, collected: true }
        }
        return item
      }))

      // Check obstacle interactions
      setObstacles(prev => prev.map(obs => {
        if (!obs.defeated && overlap(hitbox, obs)) {
          if (!obs.defeated) {
            audio.playResolve()
            setFlash(`${OBSTACLE_INFO[obs.id].action}: ${OBSTACLE_INFO[obs.id].label}!`)
            setTimeout(() => setFlash(null), 2000)
            if (obs.id === 'ego') {
              setEgoEgg(true)
              foundEgg('ego')
              setTimeout(() => setEgoEgg(false), 4000)
            }
          }
          return { ...obs, defeated: true }
        }
        return obs
      }))

      return { x, y }
    })

    // Check win condition
    setItems(prev => {
      const allCollected = prev.every(i => i.collected)
      if (allCollected && !gameComplete) {
        setGameComplete(true)
      }
      return prev
    })

    animRef.current = requestAnimationFrame(gameLoop)
  }, [gameComplete, setGameComplete, foundEgg])

  useEffect(() => {
    startedRef.current = started
    pausedRef.current = paused
  }, [started, paused])

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameLoop])

  // Mobile controls
  const moveDir = useRef<{ x: number; y: number } | null>(null)

  const startMobileMove = (dx: number, dy: number) => {
    moveDir.current = { x: dx, y: dy }
    if (dx < 0) { keys.current.add('ArrowLeft'); setFacing('left') }
    else if (dx > 0) { keys.current.add('ArrowRight'); setFacing('right') }
    if (dy < 0) keys.current.add('ArrowUp')
    else if (dy > 0) keys.current.add('ArrowDown')
  }

  const stopMobileMove = (dx: number, dy: number) => {
    if (dx < 0) keys.current.delete('ArrowLeft')
    else if (dx > 0) keys.current.delete('ArrowRight')
    if (dy < 0) keys.current.delete('ArrowUp')
    else if (dy > 0) keys.current.delete('ArrowDown')
  }

  const scale = Math.min(1, (typeof window !== 'undefined' ? window.innerWidth - 32 : 800) / WORLD_W)

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
        paddingTop: 'clamp(2rem, 6vh, 3rem)',
      }}
    >
      {/* Ego egg message */}
      <AnimatePresence>
        {egoEgg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: '5rem', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(30,27,75,0.95)', border: '1px solid rgba(167,139,250,0.4)',
              borderRadius: '12px', padding: '12px 20px', zIndex: 200,
              color: '#c4b5fd', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
              backdropFilter: 'blur(12px)',
            }}
          >
            😤 "Character development. Finally."
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '1.5rem', maxWidth: '600px' }}
      >
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
          color: '#f1f0ff',
          marginBottom: '0.25rem',
        }}>
          Operation Un-Idiot
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#9d84c9' }}>
          Collect all {totalItems} items ({collected}/{totalItems}) • Resolve all obstacles • Arrow keys / WASD / Touch controls
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {items.map(item => (
            <span
              key={item.id}
              style={{
                fontSize: '1.1rem',
                opacity: item.collected ? 1 : 0.3,
                transition: 'opacity 0.3s',
                filter: item.collected ? 'drop-shadow(0 0 6px rgba(167,139,250,0.8))' : 'none',
              }}
              title={ITEM_INFO[item.id].label}
            >
              {ITEM_INFO[item.id].emoji}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Game area */}
      {!started ? (
        <motion.div
          style={{
            background: 'rgba(30,27,75,0.7)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '20px',
            padding: '2rem 3rem',
            textAlign: 'center',
            maxWidth: '480px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕹️</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#f1f0ff', marginBottom: '1rem' }}>
            Ready, player one?
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#c4b5fd', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Navigate the floating island to collect 4 useful items while resolving obstacles
            by walking into them. No fighting — just accountability.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              onClick={() => setStarted(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                border: 'none', borderRadius: '50px', padding: '12px 28px',
                color: '#f1f0ff', fontSize: '1rem', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              }}
            >
              Start game →
            </motion.button>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '50px', padding: '12px 28px', color: '#c4b5fd',
                fontSize: '1rem', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              }}
            >
              Skip the game
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <>
          <div style={{
            position: 'relative',
            width: `${WORLD_W * scale}px`,
            height: `${WORLD_H * scale}px`,
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid rgba(124,58,237,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <svg
              width={WORLD_W * scale}
              height={WORLD_H * scale}
              viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
              style={{ display: 'block' }}
            >
              {/* Sky */}
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#070714" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
              </defs>
              <rect width={WORLD_W} height={WORLD_H} fill="url(#skyGrad)" />

              {/* Island platform */}
              <ellipse cx="400" cy="460" rx="380" ry="50" fill="#1e1b4b" />
              <ellipse cx="400" cy="445" rx="370" ry="40" fill="#2d1b69" />
              <ellipse cx="400" cy="432" rx="360" ry="30" fill="#3b0764" />

              {/* Ground */}
              <rect x="20" y="420" width="760" height="30" rx="8" fill="#4c1d95" />

              {/* Decorative elements */}
              {[80, 200, 350, 500, 650, 730].map((x, i) => (
                <g key={i}>
                  <rect x={x} y={390 - i % 2 * 20} width="6" height={30 + i % 2 * 20} rx="2" fill="#6d28d9" />
                  <polygon points={`${x + 3},${370 - i % 2 * 20} ${x - 10},${390 - i % 2 * 20} ${x + 16},${390 - i % 2 * 20}`} fill="#7c3aed" />
                </g>
              ))}

              {/* Items */}
              {items.map(item => !item.collected && (
                <g key={item.id}>
                  <motion.g
                    style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
                  >
                    {/* Glow */}
                    <circle cx={item.w / 2} cy={item.h / 2} r="24" fill="rgba(167,139,250,0.1)" />
                    <circle cx={item.w / 2} cy={item.h / 2} r="20" fill="rgba(167,139,250,0.15)" />
                    {/* Item */}
                    <text x={item.w / 2} y={item.h / 2 + 6} textAnchor="middle" fontSize="24">
                      {ITEM_INFO[item.id].emoji}
                    </text>
                    {/* Label */}
                    <text x={item.w / 2} y={item.h + 14} textAnchor="middle" fontSize="8" fill="#c4b5fd">
                      {ITEM_INFO[item.id].label}
                    </text>
                  </motion.g>
                </g>
              ))}

              {/* Obstacles */}
              {obstacles.map(obs => (
                <g key={obs.id} style={{ transform: `translate(${obs.x}px, ${obs.y}px)` }}>
                  {!obs.defeated ? (
                    <>
                      <motion.circle
                        cx={obs.w / 2} cy={obs.h / 2} r={obs.w / 2 + 8}
                        fill="rgba(239,68,68,0.1)"
                        animate={{ r: [obs.w / 2 + 5, obs.w / 2 + 14, obs.w / 2 + 5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <text x={obs.w / 2} y={obs.h / 2 + 8} textAnchor="middle" fontSize="28">
                        {OBSTACLE_INFO[obs.id].emoji}
                      </text>
                      <text x={obs.w / 2} y={obs.h + 14} textAnchor="middle" fontSize="7" fill="#f87171">
                        {OBSTACLE_INFO[obs.id].label}
                      </text>
                    </>
                  ) : (
                    <motion.g
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <text x={obs.w / 2} y={obs.h / 2 + 8} textAnchor="middle" fontSize="28">✓</text>
                    </motion.g>
                  )}
                </g>
              ))}

              {/* Character */}
              <g style={{ transform: `translate(${charPos.x}px, ${charPos.y}px)` }}>
                {/* Shadow */}
                <ellipse cx={CHAR_W / 2} cy={CHAR_H + 4} rx="12" ry="4" fill="rgba(0,0,0,0.3)" />
                {/* Body */}
                <ellipse cx={CHAR_W / 2} cy={CHAR_H * 0.7} rx="11" ry="13" fill="#7c3aed" />
                {/* Head */}
                <circle cx={CHAR_W / 2} cy={CHAR_H * 0.3} r="11" fill="#fcd5b5" />
                {/* Eyes */}
                <circle cx={facing === 'right' ? CHAR_W / 2 + 4 : CHAR_W / 2 - 4} cy={CHAR_H * 0.28} r="2.5" fill="#1e1b4b" />
                <circle cx={facing === 'right' ? CHAR_W / 2 + 7 : CHAR_W / 2 - 7} cy={CHAR_H * 0.28} r="2.5" fill="#1e1b4b" />
                {/* Smile */}
                <path
                  d={facing === 'right'
                    ? `M${CHAR_W / 2 + 2} ${CHAR_H * 0.35} Q${CHAR_W / 2 + 5} ${CHAR_H * 0.4} ${CHAR_W / 2 + 8} ${CHAR_H * 0.35}`
                    : `M${CHAR_W / 2 - 2} ${CHAR_H * 0.35} Q${CHAR_W / 2 - 5} ${CHAR_H * 0.4} ${CHAR_W / 2 - 8} ${CHAR_H * 0.35}`}
                  stroke="#9d4040" strokeWidth="1.5" fill="none" strokeLinecap="round"
                />
                {/* Legs */}
                <rect x={CHAR_W / 2 - 9} y={CHAR_H * 0.8} width="7" height="10" rx="3" fill="#4c1d95" />
                <rect x={CHAR_W / 2 + 2} y={CHAR_H * 0.8} width="7" height="10" rx="3" fill="#4c1d95" />
              </g>

              {/* Flash message */}
              {flash && (
                <g>
                  <rect x="50" y="20" width="700" height="40" rx="8" fill="rgba(30,27,75,0.9)" />
                  <text x="400" y="46" textAnchor="middle" fontSize="14" fill="#86efac" fontFamily="Inter, sans-serif">
                    ✓ {flash}
                  </text>
                </g>
              )}

              {/* Pause overlay */}
              {paused && (
                <g>
                  <rect width={WORLD_W} height={WORLD_H} fill="rgba(10,10,26,0.8)" />
                  <text x="400" y="240" textAnchor="middle" fontSize="36" fill="#f1f0ff" fontFamily="Playfair Display, serif">
                    Paused
                  </text>
                  <text x="400" y="285" textAnchor="middle" fontSize="16" fill="#9d84c9" fontFamily="Inter, sans-serif">
                    Press P or Esc to resume
                  </text>
                </g>
              )}

              {/* Win overlay */}
              {gameComplete && (
                <g>
                  <rect width={WORLD_W} height={WORLD_H} fill="rgba(10,10,26,0.85)" />
                  <text x="400" y="200" textAnchor="middle" fontSize="28" fill="#fbbf24" fontFamily="Playfair Display, serif">
                    🎉 QUEST COMPLETE: LEARNED SOMETHING USEFUL
                  </text>
                  <text x="400" y="260" textAnchor="middle" fontSize="14" fill="#c4b5fd" fontFamily="Inter, sans-serif">
                    Unfortunately, becoming a better best friend
                  </text>
                  <text x="400" y="285" textAnchor="middle" fontSize="14" fill="#c4b5fd" fontFamily="Inter, sans-serif">
                    requires practice outside this game too.
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Controls row */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setPaused(p => !p)}
              style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '8px', padding: '8px 16px', color: '#c4b5fd',
                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              onClick={resetGame}
              style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '8px', padding: '8px 16px', color: '#c4b5fd',
                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              🔄 Restart
            </button>
            <button
              onClick={onNext}
              style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '8px', padding: '8px 16px', color: '#9d84c9',
                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              Skip ↓
            </button>
          </div>

          {/* Mobile D-pad */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div>
              <button
                onPointerDown={() => startMobileMove(0, -1)}
                onPointerUp={() => stopMobileMove(0, -1)}
                onPointerLeave={() => stopMobileMove(0, -1)}
                style={dpadStyle}
                aria-label="Move up"
              >▲</button>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onPointerDown={() => startMobileMove(-1, 0)}
                onPointerUp={() => stopMobileMove(-1, 0)}
                onPointerLeave={() => stopMobileMove(-1, 0)}
                style={dpadStyle}
                aria-label="Move left"
              >◀</button>
              <div style={{ width: 44, height: 44 }} />
              <button
                onPointerDown={() => startMobileMove(1, 0)}
                onPointerUp={() => stopMobileMove(1, 0)}
                onPointerLeave={() => stopMobileMove(1, 0)}
                style={dpadStyle}
                aria-label="Move right"
              >▶</button>
            </div>
            <div>
              <button
                onPointerDown={() => startMobileMove(0, 1)}
                onPointerUp={() => stopMobileMove(0, 1)}
                onPointerLeave={() => stopMobileMove(0, 1)}
                style={dpadStyle}
                aria-label="Move down"
              >▼</button>
            </div>
          </div>

          {/* Continue after win */}
          <AnimatePresence>
            {gameComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginTop: '1.5rem' }}
              >
                <motion.button
                  onClick={onNext}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                    border: 'none', borderRadius: '50px', padding: '14px 32px',
                    color: '#f1f0ff', fontSize: '1rem', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  }}
                >
                  Watch the sunrise →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}

const dpadStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  background: 'rgba(124,58,237,0.3)',
  border: '1px solid rgba(167,139,250,0.4)',
  borderRadius: '8px',
  color: '#c4b5fd',
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  touchAction: 'none',
  userSelect: 'none',
}
