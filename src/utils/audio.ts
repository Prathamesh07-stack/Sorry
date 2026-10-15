// Web Audio API Synthesizer for "A Little Universe for Sid"
// Fully self-contained, no external audio files required, strictly respects soundEnabled

class AudioManager {
  private ctx: AudioContext | null = null
  private ambientGain: GainNode | null = null
  private ambientOscs: OscillatorNode[] = []
  private isPlayingAmbient = false

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public setSoundEnabled(enabled: boolean) {
    if (enabled) {
      this.startAmbient()
    } else {
      this.stopAmbient()
    }
  }

  public startAmbient() {
    if (this.isPlayingAmbient) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      this.stopAmbient()

      // Warm low ambient drone (D major 9th chord floating gently)
      // D2 (73.4Hz), A2 (110Hz), F#3 (185Hz), C#4 (277.2Hz)
      const freqs = [73.4, 110.0, 185.0, 277.18]
      const master = ctx.createGain()
      master.gain.setValueAtTime(0.001, ctx.currentTime)
      master.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 3)

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(320, ctx.currentTime)
      filter.Q.setValueAtTime(1.5, ctx.currentTime)

      master.connect(filter)
      filter.connect(ctx.destination)

      this.ambientOscs = freqs.map((f, i) => {
        const osc = ctx.createOscillator()
        const oscGain = ctx.createGain()
        osc.type = i === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(f, ctx.currentTime)

        // Subtle gentle detune wobble
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.setValueAtTime(0.1 + i * 0.05, ctx.currentTime)
        lfoGain.gain.setValueAtTime(0.8, ctx.currentTime)
        lfo.connect(osc.frequency)
        lfo.start()

        oscGain.gain.setValueAtTime(0.25 / freqs.length, ctx.currentTime)
        osc.connect(oscGain)
        oscGain.connect(master)
        osc.start()
        return osc
      })

      this.ambientGain = master
      this.isPlayingAmbient = true
    } catch {
      // Audio autoplay policy or device fallback
    }
  }

  public stopAmbient() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8)
      }
      setTimeout(() => {
        this.ambientOscs.forEach(o => {
          try { o.stop() } catch {}
        })
        this.ambientOscs = []
        this.isPlayingAmbient = false
      }, 900)
    } catch {
      this.isPlayingAmbient = false
    }
  }

  // Soft button click
  public playClick() {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.09)
    } catch {}
  }

  // Soft celestial chime (e.g. clicking star or finding egg)
  public playChime(freq = 880) {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.4)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.85)
    } catch {}
  }

  // Paper rustle sound
  public playPaper() {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      // White noise buffer
      const bufferSize = ctx.sampleRate * 0.2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1200, ctx.currentTime)
      filter.Q.setValueAtTime(3, ctx.currentTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noise.start()
    } catch {}
  }

  // Game item collect sound (cheerful ascending arpeggio)
  public playCollect() {
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq)
      }, idx * 70)
    })
  }

  // Obstacle resolved sound (warm reassuring cadence)
  public playResolve() {
    const notes = [392.0, 493.88, 587.33, 783.99] // G4, B4, D5, G5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq)
      }, idx * 90)
    })
  }
}

export const audio = new AudioManager()
