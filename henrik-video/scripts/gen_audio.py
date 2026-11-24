"""Erzeugt Sprecher (Piper TTS), Beat und Whooshes -> public/soundtrack.wav + src/timing.json"""
import json, subprocess, sys, wave, os
import numpy as np
MODEL = sys.argv[1]
SR, FPS, LEAD, TAIL = 22050, 30, 0.35, 0.75
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scenes = json.load(open(os.path.join(root, 'scripts/script.json')))

def read_wav(p):
    with wave.open(p) as w:
        assert w.getframerate() == SR
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768

vo_parts, timing, t = [], [], 0.0
for s in scenes:
    p = f'/tmp/vo_{s["id"]}.wav'
    subprocess.run([sys.executable, '-m', 'piper', '-m', MODEL, '-f', p, '--length-scale', '0.86'], input=s['vo'].encode(), check=True, capture_output=True)
    a = read_wav(p)
    dur = LEAD + len(a) / SR + TAIL
    frames = int(np.ceil(dur * FPS)); dur = frames / FPS
    vo_parts.append((t + LEAD, a)); timing.append({'id': s['id'], 'frames': frames}); t += dur
total = t + 0.5
N = int(total * SR); tt = np.arange(N) / SR
vo = np.zeros(N, np.float32)
for start, a in vo_parts:
    i = int(start * SR); vo[i:i + len(a)] += a

# --- Beat: 108 BPM, Am F C G ---
bpm = 108; beat = 60 / bpm; rng = np.random.default_rng(1)
mus = np.zeros(N, np.float32)
def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig))
    if i < N: mus[i:j] += sig[:j - i]
def env(n, a=0.005, d=0.3):
    x = np.arange(n) / SR; return np.minimum(x / a, 1) * np.exp(-x / d)
kick_n = int(0.35 * SR); kx = np.arange(kick_n) / SR
kick = np.sin(2 * np.pi * (45 + 90 * np.exp(-kx * 30)) * kx) * np.exp(-kx * 9)
hat_n = int(0.06 * SR); hat = np.diff(rng.standard_normal(hat_n + 1)) * np.exp(-np.arange(hat_n) / SR * 70) * 0.12
snare_n = int(0.2 * SR); snare = rng.standard_normal(snare_n) * np.exp(-np.arange(snare_n) / SR * 18) * 0.25
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
f = lambda m: 440 * 2 ** ((m - 69) / 12)
nb = int(total / beat)
for b in range(nb):
    at = b * beat
    if b >= 4: add(kick * 0.9, at)
    if b >= 4 and b % 2 == 1: add(snare, at)
    if b >= 2: add(hat, at + beat / 2); add(hat * 0.6, at)
    if b % 4 == 0:
        ch = chords[(b // 4) % 4]; n = int(4 * beat * SR); x = np.arange(n) / SR
        pad = sum(np.sin(2 * np.pi * f(m) * x + 0.3 * np.sin(2 * np.pi * 0.5 * x)) + 0.3 * np.sin(2 * np.pi * 2 * f(m) * x) for m in ch)
        add(pad * env(n, 0.4, 3.0) * 0.05, at)
    ch = chords[(b // 4) % 4]; n = int(beat * 0.9 * SR); x = np.arange(n) / SR
    bass = np.sign(np.sin(2 * np.pi * f(ch[0] - 24) * x)) * 0.5 + np.sin(2 * np.pi * f(ch[0] - 24) * x)
    if b >= 4: add(bass * env(n, 0.01, 0.25) * 0.09, at)
# Fade in/out
mus *= np.clip(tt / 1.5, 0, 1) * np.clip((total - tt) / 2.0, 0, 1)
# Ducking unter Sprache
vo_env = np.convolve(np.abs(vo), np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')
duck = 1 - 0.55 * np.clip(vo_env * 12, 0, 1)
mix = mus * duck * 0.8 + vo * 1.0
# Whoosh an jedem Szenenwechsel
acc = 0
for s in timing[:-1]:
    acc += s['frames'] / FPS; n = int(0.5 * SR); x = np.arange(n) / n
    noise = rng.standard_normal(n); k = np.clip((1 - np.abs(x - 0.6) * 2.2), 0, 1) ** 2
    sm = np.convolve(noise, np.ones(9) / 9, 'same') - np.convolve(noise, np.ones(60) / 60, 'same')
    w = sm * k * 0.35; i = int((acc - 0.3) * SR); mix[i:i + n] += w[:N - i]
mix = mix / max(1, np.abs(mix).max() / 0.95)
with wave.open(os.path.join(root, 'public/soundtrack.wav'), 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
json.dump(timing, open(os.path.join(root, 'src/timing.json'), 'w'), indent=1)
print(timing, 'total', round(total, 1), 's')
