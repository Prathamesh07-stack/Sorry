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


function TerminalLine({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setVisible(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          clearInterval(interval)
        }
      }, 28)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, delay])

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#86efac', marginBottom: '6px', minHeight: '1.4em' }}>
      {visible}
      {!done && <span style={{ animation: 'blink 1s step-end infinite', color: '#86efac' }}>█</span>}
    </div>
  )
}

export default function Scene1Office({ onNext, foundEgg }: Props) {
  const [stampVisible, setStampVisible] = useState(false)
  const [printerActive, setPrinterActive] = useState(false)
  const [printerEgg, setPrinterEgg] = useState(false)
  const [clockEgg, setClockEgg] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setStampVisible(true), 5000)
    const t2 = setTimeout(() => setPrinterActive(true), 6500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handlePrinterClick = () => {
    setPrinterEgg(true)
    foundEgg('printer')
    setTimeout(() => setPrinterEgg(false), 4000)
  }

  const handleClockClick = () => {
    setClockEgg(true)
    foundEgg('clock')
    setTimeout(() => setClockEgg(false), 4000)
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
        padding: '2rem',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes paperFeed { 0% { transform: translateY(0); } 50% { transform: translateY(8px); } 100% { transform: translateY(0); } }
      `}</style>

      {/* Floating cloud-office effect */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '100%', maxWidth: '700px' }}
      >
        {/* Office header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: 'rgba(30,27,75,0.8)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '8px',
            padding: '6px 20px',
            marginBottom: '1rem',
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem', color: '#fcd5b5' }}>
              🏢 cloud floor 7 — established approximately too late
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
            color: '#f1f0ff',
            letterSpacing: '-0.02em',
          }}>
            The Friendship Maintenance Department
          </h1>
        </motion.div>

        {/* Terminal / Case File */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            background: '#080812',
            border: '1px solid rgba(134,239,172,0.3)',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 0 80px rgba(0,50,0,0.08)',
          }}
        >
          {/* Terminal bar */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ marginLeft: '8px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#4b5563' }}>
              case_file_SID-001.txt — CONFIDENTIAL
            </span>
          </div>

          <TerminalLine text="CASE NUMBER: SID-001" delay={300} />
          <TerminalLine text="SUBJECT: A friendship that deserved better communication." delay={800} />
          <div style={{ height: '1px', background: 'rgba(134,239,172,0.15)', margin: '10px 0' }} />
          <TerminalLine text="ISSUE 01: Took too long to fix things." delay={1400} />
          <TerminalLine text="ISSUE 02: Misunderstood the situation instead of trying harder to understand." delay={2200} />
          <TerminalLine text="ISSUE 03: Considered letting go over small fights rather than working through them." delay={3200} />
          <div style={{ height: '1px', background: 'rgba(134,239,172,0.15)', margin: '10px 0' }} />
          <TerminalLine text="EXCUSES FILED: None." delay={4300} />
          <TerminalLine text="RESPONSIBILITY ACCEPTED: 100%." delay={4900} />
          <TerminalLine text="LESSONS LEARNED: Still in progress." delay={5500} />
          <TerminalLine text="CURRENT MISSION: Offer a genuine apology without expecting anything in return." delay={6100} />

          {/* Big Red Stamp */}
          <AnimatePresence>
            {stampVisible && (
              <motion.div
                initial={{ opacity: 0, rotate: -15, scale: 2 }}
                animate={{ opacity: 1, rotate: -12, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '5%',
                  transform: 'translateY(-50%) rotate(-12deg)',
                  background: 'transparent',
                  border: '4px solid #ef4444',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  color: '#ef4444',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(0.7rem, 2vw, 1rem)',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  lineHeight: 1.3,
                  boxShadow: '0 0 20px rgba(239,68,68,0.3)',
                  opacity: 0.9,
                  pointerEvents: 'none',
                }}
              >
                YEP.<br />THAT WAS<br />ON ME.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Printer + Clock row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {/* Clock - Easter Egg */}
          <motion.button
            onClick={handleClockClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Click the clock"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
                <circle cx="30" cy="30" r="26" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
                <motion.line x1="30" y1="30" x2="30" y2="10" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round"
                  animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '30px 30px' }} />
                <motion.line x1="30" y1="30" x2="44" y2="38" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"
                  animate={{ rotate: [0, 360] }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '30px 30px' }} />
                <circle cx="30" cy="30" r="3" fill="#7c3aed" />
              </svg>
            </motion.div>
            {clockEgg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: -50 }} exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(30,27,75,0.95)', border: '1px solid rgba(167,139,250,0.4)',
                  borderRadius: '10px', padding: '10px 14px', whiteSpace: 'nowrap',
                  fontSize: '0.8rem', color: '#c4b5fd', zIndex: 50, backdropFilter: 'blur(8px)',
                }}
              >
                ⏰ "The clock has officially filed a complaint about my timing."
              </motion.div>
            )}
          </motion.button>

          {/* Animated Printer - Easter Egg */}
          <AnimatePresence>
            {printerActive && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handlePrinterClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Click the printer"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}
              >
                <svg width="80" height="70" viewBox="0 0 80 70" aria-hidden="true">
                  {/* Paper coming out */}
                  <motion.rect x="22" y="0" width="36" height="20" rx="2" fill="#fef3c7"
                    animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                  {/* Text on paper */}
                  <motion.g animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <rect x="26" y="5" width="28" height="1.5" rx="1" fill="#9d84c9" opacity="0.5" />
                    <rect x="26" y="9" width="20" height="1.5" rx="1" fill="#9d84c9" opacity="0.5" />
                  </motion.g>
                  {/* Printer body */}
                  <rect x="10" y="18" width="60" height="32" rx="6" fill="#2d1b69" />
                  <rect x="18" y="22" width="44" height="12" rx="3" fill="#1e1b4b" />
                  {/* Lights */}
                  <motion.circle cx="60" cy="28" r="3" fill="#86efac"
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  <circle cx="68" cy="28" r="3" fill="#fbbf24" opacity="0.5" />
                  {/* Legs */}
                  <rect x="18" y="50" width="10" height="14" rx="3" fill="#1e1b4b" />
                  <rect x="52" y="50" width="10" height="14" rx="3" fill="#1e1b4b" />
                </svg>

                {printerEgg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)',
                      background: 'rgba(30,27,75,0.95)', border: '1px solid rgba(167,139,250,0.4)',
                      borderRadius: '10px', padding: '10px 14px', whiteSpace: 'nowrap',
                      fontSize: '0.8rem', color: '#c4b5fd', zIndex: 50, backdropFilter: 'blur(8px)',
                    }}
                  >
                    🖨️ "Printing another excuse... ERROR: Excuses not accepted here."
                  </motion.div>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Printer note */}
        <AnimatePresence>
          {printerActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontFamily: 'Caveat, cursive',
                fontSize: '1.1rem',
                color: '#fcd5b5',
                opacity: 0.85,
              }}
            >
              📋 Recommended action: Stop overthinking the apology, start taking responsibility, and communicate better next time.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        <AnimatePresence>
          {printerActive && (
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
                Continue to the letter →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
