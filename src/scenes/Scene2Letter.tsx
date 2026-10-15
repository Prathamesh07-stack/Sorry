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
}

import { config } from '../config'

const LETTER_PARAGRAPHS = config.letter.paragraphs

export default function Scene2Letter({ onNext }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [showFull, setShowFull] = useState(false)
  const [folded, setFolded] = useState(false)

  const visibleParagraphs = showFull ? LETTER_PARAGRAPHS : LETTER_PARAGRAPHS.slice(0, 8)

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
      }}
    >
      {/* Scene header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem', color: '#fcd5b5', opacity: 0.7, marginBottom: '0.5rem' }}>
          ✦ a quiet library, somewhere between the stars
        </p>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
          color: '#f1f0ff',
        }}>
          The Letter I Should Have Written Sooner
        </h2>
      </motion.div>

      {/* Floating lanterns in background */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${10 + i * 25}%`,
            top: `${15 + (i % 2) * 10}%`,
            fontSize: '1.5rem',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          🏮
        </motion.div>
      ))}

      {/* Drifting pages */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`page-${i}`}
          aria-hidden="true"
          animate={{
            x: [0, 30, 0],
            y: [0, -15, 0],
            rotate: [i * 10 - 10, i * 10, i * 10 - 10],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            right: `${5 + i * 15}%`,
            top: `${20 + i * 15}%`,
            width: 40,
            height: 50,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.08)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}

      {/* Envelope */}
      <AnimatePresence mode="wait">
        {!envelopeOpen && !folded && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'relative', zIndex: 10 }}
          >
            <motion.button
              onClick={() => {
                setEnvelopeOpen(true)
                audio.playPaper()
              }}
              whileHover={{ scale: 1.03, boxShadow: '0 20px 60px rgba(124,58,237,0.4)' }}
              whileTap={{ scale: 0.98 }}
              aria-label="Open the letter"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="220" height="160" viewBox="0 0 220 160" aria-hidden="true">
                  <defs>
                    <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="100%" stopColor="#fde68a" />
                    </linearGradient>
                    <filter id="envShadow">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#7c3aed" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  {/* Envelope body */}
                  <rect x="5" y="30" width="210" height="125" rx="8" fill="url(#envGrad)" filter="url(#envShadow)" />
                  {/* Envelope flap */}
                  <path d="M5 30 L110 90 L215 30 Z" fill="#fde68a" />
                  <path d="M5 30 L5 155 L215 155 L215 30 L110 90 Z" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                  {/* Diagonal lines */}
                  <line x1="5" y1="155" x2="110" y2="90" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
                  <line x1="215" y1="155" x2="110" y2="90" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
                  {/* Wax seal */}
                  <circle cx="110" cy="100" r="18" fill="#7c3aed" />
                  <circle cx="110" cy="100" r="14" fill="#6d28d9" />
                  <text x="110" y="105" textAnchor="middle" fontSize="14" fill="#fef3c7" fontFamily="serif">✦</text>
                  {/* Handwritten name */}
                  <text x="110" y="75" textAnchor="middle" fontSize="16" fill="#92400e" fontFamily="Caveat, cursive" fontStyle="italic">{config.recipient.name}</text>
                </svg>
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5 }}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#c4b5fd', marginTop: '1rem' }}
              >
                click to open ✦
              </motion.span>
            </motion.button>
          </motion.div>
        )}

        {/* Letter content */}
        {envelopeOpen && !folded && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: '640px',
              width: '100%',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Paper */}
            <div
              style={{
                background: 'linear-gradient(160deg, #fefce8, #fef3c7)',
                borderRadius: '4px',
                padding: 'clamp(1.5rem, 5vw, 3rem)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(251,191,36,0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Paper texture lines */}
              {[...Array(20)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute', left: 0, right: 0,
                  top: `${50 + i * 28}px`, height: '1px',
                  background: 'rgba(180,150,80,0.1)', pointerEvents: 'none',
                }} />
              ))}

              {/* Pen animation */}
              <motion.div
                aria-hidden="true"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 0 }}
                style={{ position: 'absolute', top: 12, right: 12, fontSize: '1.5rem' }}
              >✒️</motion.div>

              <p style={{
                fontFamily: 'Caveat, cursive', fontSize: '0.9rem', color: '#92400e',
                marginBottom: '0.5rem', opacity: 0.7,
              }}>
                October 2026
              </p>

              <div style={{ fontFamily: 'Caveat, cursive', color: '#1c1917', lineHeight: 1.85, fontSize: 'clamp(1rem, 2.5vw, 1.15rem)' }}>
                {visibleParagraphs.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    style={{
                      marginBottom: '1.1rem',
                      fontWeight: i === 0 ? 700 : i === LETTER_PARAGRAPHS.length - 1 ? 600 : 400,
                      fontSize: i === 0 ? '1.3em' : '1em',
                    }}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              {/* Show full / fold buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {!showFull && (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowFull(true)}
                    style={{
                      background: '#7c3aed',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '10px 22px',
                      color: 'white',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    Read the whole letter ↓
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setFolded(false)
                    setEnvelopeOpen(false)
                    setShowFull(false)
                  }}
                  style={{
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: '50px',
                    padding: '10px 22px',
                    color: '#7c3aed',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Fold the letter ✦
                </motion.button>
              </div>
            </div>

            {/* Next button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{ textAlign: 'center', marginTop: '2rem' }}
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
                Continue to the islands →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
