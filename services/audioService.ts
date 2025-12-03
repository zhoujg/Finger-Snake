class AudioController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    // AudioContext handles are created lazily on first interaction
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Pre-load voices
        const loadVoices = () => {
            this.voices = window.speechSynthesis.getVoices();
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }
  }

  private getContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    return this.ctx;
  }

  // To resume context (browsers block audio until user interaction)
  public async init() {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }
    // Trigger a silent utterance to unlock speech synthesis on iOS
    if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(utterance);
    }
  }

  public speakCantonese(text: string) {
    if (this.isMuted || !window.speechSynthesis) return;

    // Cancel previous speech to avoid queue buildup
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a Cantonese voice (zh-HK), fallback to generic Chinese
    const cantoneseVoice = this.voices.find(v => v.lang === 'zh-HK') || 
                           this.voices.find(v => v.lang === 'zh-TW') ||
                           this.voices.find(v => v.lang.startsWith('zh'));
    
    if (cantoneseVoice) {
        utterance.voice = cantoneseVoice;
        utterance.lang = cantoneseVoice.lang;
    } else {
        utterance.lang = 'zh-HK'; // Try setting lang even if voice object isn't found
    }

    utterance.rate = 0.9; // Slightly slower for learning
    utterance.pitch = 1.1; // Slightly higher/clearer

    window.speechSynthesis.speak(utterance);
  }

  public playEatSound(pitchMultiplier: number = 1.0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Soft chime sound to accompany speech
    const now = ctx.currentTime;
    osc.type = 'sine';
    
    const baseFreq = 500 + (pitchMultiplier * 50);
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);

    gain.gain.setValueAtTime(0.05, now); // Lower volume so it doesn't overpower speech
    gain.gain.linearRampToValueAtTime(0, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export const audioService = new AudioController();