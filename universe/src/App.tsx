import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StarField from './components/StarField'
import SoundToggle from './components/SoundToggle'
import SceneIndicator from './components/SceneIndicator'
import Scene0Intro from './scenes/Scene0Intro'
import Scene1Office from './scenes/Scene1Office'
import Scene2Letter from './scenes/Scene2Letter'
import Scene3Islands from './scenes/Scene3Islands'
import Scene4Museum from './scenes/Scene4Museum'
import Scene5Constellation from './scenes/Scene5Constellation'
import Scene6Game from './scenes/Scene6Game'
import Scene7Sunrise from './scenes/Scene7Sunrise'
import Scene8Final from './scenes/Scene8Final'
import { audio } from './utils/audio'
import { config } from './config'

export type SceneId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const SCENES = [
  'Opening',
  'Friendship Dept.',
  'The Letter',
  'Three Islands',
  'Museum',
  'Constellation',
  'Mini-Game',
  'Sunrise Promise',
  'The End',
]

export default function App() {
  const [scene, setScene] = useState<SceneId>(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [easterEggsFound, setEasterEggsFound] = useState<Set<string>>(new Set())
  const [discoveredStars, setDiscoveredStars] = useState<Set<number>>(new Set())
  const [bridgePlanks, setBridgePlanks] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [latestEgg, setLatestEgg] = useState<string | null>(null)

  const goTo = (s: SceneId) => setScene(s)
  const next = () => setScene(prev => Math.min(prev + 1, 8) as SceneId)

  const foundEgg = (id: string) => {
    setEasterEggsFound(prev => {
      const nextSet = new Set([...prev, id])
      return nextSet
    })
    setLatestEgg(id)
    if (soundEnabled) {
      audio.playChime(950)
    }
    setTimeout(() => {
      setLatestEgg(null)
    }, 4500)
  }

  useEffect(() => {
    audio.setSoundEnabled(soundEnabled)
  }, [soundEnabled])

  // Bg color transition based on scene
  const bgColors: Record<SceneId, string> = {
    0: '#070714',
    1: '#0d0a1f',
    2: '#0a0a1a',
    3: '#0e0e24',
    4: '#0a1020',
    5: '#040410',
    6: '#0c0f20',
    7: '#1a0a2e',
    8: '#0f0520',
  }

  useEffect(() => {
    document.body.style.background = bgColors[scene]
  }, [scene])

  const sceneProps = {
    onNext: next,
    onGoTo: goTo,
    soundEnabled,
    foundEgg,
    easterEggsFound,
  }

  const EGG_TITLES: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(config.easterEggs).map(([k, v]) => [k, `Secret Unlocked: ${v.label}`])
    ),
    plane: 'Secret Unlocked: Message Delivered',
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <StarField scene={scene} />

      <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled(e => !e)} />

      {/* Skip forward button */}
      {scene < 8 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={next}
          aria-label="Skip to next scene"
          title="Skip to next scene"
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 100,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: '50px',
            padding: '7px 14px',
            color: '#c4b5fd',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.25s',
          }}
        >
          Skip scene →
        </motion.button>
      )}

      {scene > 0 && scene < 8 && (
        <SceneIndicator current={scene} total={8} scenes={SCENES} onJump={goTo} />
      )}

      {/* Easter Egg Notification Toast */}
      <AnimatePresence>
        {latestEgg && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              zIndex: 200,
              background: 'rgba(26, 16, 60, 0.94)',
              border: '1px solid rgba(167, 139, 250, 0.5)',
              borderRadius: '12px',
              padding: '10px 18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#fcd5b5',
              fontSize: '0.85rem',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>✦</span>
            <div>
              <div style={{ fontWeight: 600, color: '#f3e8ff' }}>
                {EGG_TITLES[latestEgg] || 'Secret Discovered!'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#c4b5fd' }}>
                {easterEggsFound.size} of 7 secrets found
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {scene === 0 && (
          <Scene0Intro key="s0" {...sceneProps} />
        )}
        {scene === 1 && (
          <Scene1Office key="s1" {...sceneProps} />
        )}
        {scene === 2 && (
          <Scene2Letter key="s2" {...sceneProps} />
        )}
        {scene === 3 && (
          <Scene3Islands key="s3" {...sceneProps} bridgePlanks={bridgePlanks} setBridgePlanks={setBridgePlanks} />
        )}
        {scene === 4 && (
          <Scene4Museum key="s4" {...sceneProps} />
        )}
        {scene === 5 && (
          <Scene5Constellation
            key="s5"
            {...sceneProps}
            discoveredStars={discoveredStars}
            setDiscoveredStars={setDiscoveredStars}
          />
        )}
        {scene === 6 && (
          <Scene6Game key="s6" {...sceneProps} gameComplete={gameComplete} setGameComplete={setGameComplete} />
        )}
        {scene === 7 && (
          <Scene7Sunrise key="s7" {...sceneProps} />
        )}
        {scene === 8 && (
          <Scene8Final key="s8" {...sceneProps} onReplay={() => setScene(0)} />
        )}
      </AnimatePresence>
    </div>
  )
}
