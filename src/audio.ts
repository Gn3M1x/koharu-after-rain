export class RainAudio {
  private context?: AudioContext
  private gain?: GainNode
  private source?: AudioBufferSourceNode
  async start(intensity: number) {
    if (this.context?.state === 'closed') {
      this.context = undefined; this.gain = undefined; this.source = undefined
    }
    if (!this.context) {
      const context = new AudioContext(), length = context.sampleRate * 4
      const buffer = context.createBuffer(2, length, context.sampleRate)
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel)
        for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
      }
      const source = context.createBufferSource(); source.buffer = buffer; source.loop = true
      const highpass = context.createBiquadFilter(); highpass.type = 'highpass'; highpass.frequency.value = 420
      const lowpass = context.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 6500
      const gain = context.createGain(); gain.gain.value = .045 * intensity / 100
      source.connect(highpass).connect(lowpass).connect(gain).connect(context.destination); source.start()
      this.context = context; this.gain = gain; this.source = source
    }
    await this.context.resume(); this.setIntensity(intensity)
  }
  setIntensity(intensity: number) {
    if (this.gain && this.context) this.gain.gain.setTargetAtTime(.045 * intensity / 100, this.context.currentTime, .4)
  }
  async stop() { await this.context?.suspend() }
  dispose() {
    this.source?.stop()
    if (this.context?.state !== 'closed') void this.context?.close()
    this.context = undefined; this.gain = undefined; this.source = undefined
  }
}
