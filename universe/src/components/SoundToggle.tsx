import { motion } from 'framer-motion'

interface Props { enabled: boolean; onToggle: () => void }

export default function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      onClick={onToggle}
      aria-label={enabled ? 'Disable ambient sound' : 'Enable ambient sound'}
      title={enabled ? 'Sound ON' : 'Sound OFF'}
      style={{
        position: 'fixed',
        top: '1.25rem',
        left: '1.25rem',
        zIndex: 100,
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(167,139,250,0.3)',
        borderRadius: '50px',
        padding: '8px 16px',
        color: '#c4b5fd',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s',
      }}
    >
      <span style={{ fontSize: '1rem' }}>{enabled ? '🔊' : '🔇'}</span>
      <span>{enabled ? 'sound on' : 'sound off'}</span>
    </motion.button>
  )
}
