import { motion } from 'framer-motion'
import type { SceneId } from '../App'

interface Props {
  current: SceneId
  total: number
  scenes: string[]
  onJump: (s: SceneId) => void
}

export default function SceneIndicator({ current, total, scenes, onJump }: Props) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      aria-label="Scene navigation"
      style={{
        position: 'fixed',
        right: '1.25rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {Array.from({ length: total }, (_, i) => i + 1).map(i => (
        <button
          key={i}
          onClick={() => onJump(i as SceneId)}
          title={scenes[i]}
          aria-label={`Go to scene: ${scenes[i]}`}
          aria-current={current === i ? 'step' : undefined}
          style={{
            width: current === i ? 10 : 6,
            height: current === i ? 10 : 6,
            borderRadius: '50%',
            border: '1.5px solid rgba(167,139,250,0.5)',
            background: current === i ? '#a78bfa' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
            padding: 0,
            boxShadow: current === i ? '0 0 8px #a78bfa' : 'none',
            alignSelf: 'center',
          }}
        />
      ))}
    </motion.nav>
  )
}
