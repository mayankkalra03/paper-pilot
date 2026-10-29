import { Platform } from 'react-native';

// Pure JS base64 encoder for complete cross-platform safety
function uint8ToBase64(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < len ? bytes[i + 1] : 0;
    const b2 = i + 2 < len ? bytes[i + 2] : 0;

    const n = (b0 << 16) | (b1 << 8) | b2;
    result += chars[(n >> 18) & 63];
    result += chars[(n >> 12) & 63];
    result += i + 1 < len ? chars[(n >> 6) & 63] : '=';
    result += i + 2 < len ? chars[n & 63] : '=';
  }
  return result;
}

// Generate compact WAV PCM data URIs for self-contained, instant sound effects
function createWavDataUri(sampleRate: number, generateSamples: (numSamples: number) => number[]): string {
  const duration = 0.25; // seconds
  const numSamples = Math.floor(sampleRate * duration);
  const samples = generateSamples(numSamples);

  const blockAlign = 2; // 16-bit mono
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // 16 bits per sample

  // data subchunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] || 0));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  const b64 = uint8ToBase64(bytes);
  return `data:audio/wav;base64,${b64}`;
}

// Sound definitions:
const LIFT_URI = createWavDataUri(22050, (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    const t = i / num;
    const env = Math.sin(t * Math.PI) * (1 - t * 0.5);
    const noise = (Math.random() * 2 - 1) * 0.25;
    const tone = Math.sin(2 * Math.PI * (280 + t * 120) * (i / 22050)) * 0.35;
    arr.push((noise + tone) * env * 0.5);
  }
  return arr;
});

const CHIME_URI = createWavDataUri(22050, (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    const t = i / num;
    const env = Math.exp(-t * 6);
    const s1 = Math.sin(2 * Math.PI * 880 * (i / 22050));
    const s2 = Math.sin(2 * Math.PI * 1760 * (i / 22050)) * 0.4;
    arr.push((s1 + s2) * env * 0.6);
  }
  return arr;
});

const COLLISION_URI = createWavDataUri(22050, (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    const t = i / num;
    const env = Math.exp(-t * 10);
    const noise = (Math.random() * 2 - 1) * 0.6;
    const thud = Math.sin(2 * Math.PI * 90 * (i / 22050)) * 0.5;
    arr.push((noise + thud) * env * 0.6);
  }
  return arr;
});

const TAP_URI = createWavDataUri(22050, (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    const t = i / num;
    const env = Math.exp(-t * 25);
    const click = Math.sin(2 * Math.PI * 1200 * (i / 22050));
    arr.push(click * env * 0.3);
  }
  return arr;
});

class SoundService {
  private enabled: boolean = true;

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private async playUri(uri: string) {
    if (!this.enabled) return;

    if (Platform.OS === 'web') {
      try {
        const audio = new window.Audio(uri);
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {
        // Fallback for audio policy
      }
    }
  }

  public playLift() {
    this.playUri(LIFT_URI);
  }

  public playChime() {
    this.playUri(CHIME_URI);
  }

  public playCollision() {
    this.playUri(COLLISION_URI);
  }

  public playTap() {
    this.playUri(TAP_URI);
  }
}

export const soundService = new SoundService();
