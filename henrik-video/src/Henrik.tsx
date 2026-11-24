import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import timing from './timing.json';

const BG = '#0b0d12', FG = '#f4f1ea', ACC = '#ff6a3d', ACC2 = '#3dd6ff', GREEN = '#7dff9a', DIM = '#7d8494', CARD = '#151923';
const font = 'Inter, "Inter Display", sans-serif';
const mono = '"DejaVu Sans Mono", monospace';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Szenen-Kontext: Länge der aktuellen Szene, damit Einsätze relativ zum Sprechtext sitzen
const LenCtx = React.createContext(300);
const useAt = () => { const len = React.useContext(LenCtx); return (x: number) => Math.round(x * len); };

const useSpr = (delay = 0, damping = 14) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, mass: 0.6}});
};
const appear = (f: number, at: number, len = 12) => interpolate(f, [at, at + len], [0, 1], clamp);

const Scene: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => {
  const f = useCurrentFrame(); const len = React.useContext(LenCtx);
  const out = interpolate(f, [len - 8, len], [1, 0], clamp);
  const inn = interpolate(f, [0, 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: font, color: FG, padding: 80, textAlign: 'center', opacity: Math.min(out, inn), transform: `scale(${1 + (1 - out) * 0.06})`, ...style}}>{children}</AbsoluteFill>
  );
};

const Words: React.FC<{text: string; delay?: number; size?: number; color?: string; stagger?: number; highlight?: string[]; weight?: number}> = ({text, delay = 0, size = 110, color = FG, stagger = 4, highlight = [], weight = 800}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.28}px`, fontSize: size, fontWeight: weight, lineHeight: 1.12, letterSpacing: size > 80 ? -2 : 0}}>
      {text.split(' ').map((w, i) => {
        const s = spring({frame: f - delay - i * stagger, fps, config: {damping: 12, mass: 0.5}});
        return <span key={i} style={{display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 70}px) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`, color: highlight.includes(w) ? ACC : color}}>{w}</span>;
      })}
    </div>
  );
};

const Card: React.FC<{at: number; color: string; title: string; sub: string; tag?: string; from?: 'left' | 'right'}> = ({at, color, title, sub, tag, from = 'left'}) => {
  const s = useSpr(at, 13);
  const dx = (1 - s) * (from === 'left' ? -900 : 900);
  return (
    <div style={{width: 920, background: CARD, borderLeft: `14px solid ${color}`, borderRadius: 26, padding: '34px 40px', textAlign: 'left', transform: `translateX(${dx}px)`, opacity: s, marginTop: 26, boxShadow: '0 20px 60px #0008'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 56, fontWeight: 900, color}}>{title}</div>
        {tag && <div style={{fontFamily: mono, fontSize: 28, color: DIM, border: `2px solid ${DIM}55`, borderRadius: 40, padding: '6px 18px'}}>{tag}</div>}
      </div>
      <div style={{fontSize: 36, color: FG, opacity: 0.85, marginTop: 8}}>{sub}</div>
    </div>
  );
};

// 1 — Intro
const Intro: React.FC = () => {
  const f = useCurrentFrame(); const at = useAt();
  const s = useSpr(10, 10);
  const ring = interpolate(f, [0, 40], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const scanY = interpolate(f, [at(0.55), at(0.8)], [-200, 2100], clamp);
  return (
    <Scene>
      <div style={{position: 'absolute', width: 900 * ring, height: 900 * ring, borderRadius: '50%', border: `6px solid ${ACC}`, opacity: 1 - ring * 0.7}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: scanY, height: 6, background: ACC2, boxShadow: `0 0 40px ${ACC2}`}} />
      <div style={{fontSize: 50, color: DIM, fontWeight: 700, letterSpacing: 10, opacity: ring}}>CLAUDE ANALYSIERT</div>
      <div style={{fontSize: 230, fontWeight: 900, letterSpacing: -10, transform: `scale(${0.6 + s * 0.4})`, opacity: s}}>Henrik</div>
      <div style={{fontSize: 52, color: ACC2, fontFamily: mono, opacity: appear(f, at(0.2))}}>@Henner4746</div>
      <div style={{position: 'absolute', bottom: 330, display: 'flex', gap: 20, opacity: appear(f, at(0.55))}}>
        {['22 Repos', 'Drive', 'Mails'].map((x, i) => (
          <div key={x} style={{fontFamily: mono, fontSize: 34, padding: '12px 26px', borderRadius: 40, border: `2px solid ${ACC2}`, color: ACC2, opacity: appear(f, at(0.55) + i * 8)}}>{x} ✓</div>
        ))}
      </div>
    </Scene>
  );
};

// 2 — Builder
const Builder: React.FC = () => {
  const f = useCurrentFrame(); const at = useAt();
  const strike = interpolate(f, [at(0.1), at(0.16)], [0, 1], clamp);
  return (
    <Scene style={{justifyContent: 'flex-start', paddingTop: 300}}>
      <div style={{position: 'relative', fontSize: 96, fontWeight: 900, color: DIM}}>
        Software kaufen
        <div style={{position: 'absolute', left: -10, top: '55%', height: 14, width: `${strike * 105}%`, background: ACC, borderRadius: 7, transform: 'rotate(-4deg)'}} />
      </div>
      <Words text="Selbst bauen." delay={at(0.17)} size={140} highlight={['bauen.']} />
      <div style={{marginTop: 40}}>
        <Card at={at(0.3)} color={GREEN} title="BitDM" tag="Dart" sub="Verschlüsselter Messenger ohne Telefonnummer" />
        <Card at={at(0.55)} color="#ffb23d" title="Photo-Sync" tag="Rust" sub="Foto-Backup mit Duplikat-Erkennung" from="right" />
        <Card at={at(0.7)} color={ACC2} title="Heimnetz" tag="Rust + Android" sub="Dashboard mit eigener App" />
      </div>
    </Scene>
  );
};

// 3 — Nachteule
const lines = ['$ cargo build --release', '   Compiling kern.rs', '   Compiling telefon.rs', '   Compiling wache.rs', '    Finished heimnetz'];
const Night: React.FC = () => {
  const f = useCurrentFrame(); const at = useAt();
  const s = useSpr(0);
  const p = interpolate(f, [at(0.3), at(0.55)], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const minor = Math.round(p * 29); const patch = minor === 29 ? 3 : Math.floor((f * 7) % 10);
  const moon = interpolate(f, [0, at(1)], [0, 1]);
  return (
    <Scene style={{justifyContent: 'flex-start', paddingTop: 220}}>
      <div style={{position: 'absolute', right: 120, top: 120 - moon * 30, width: 140, height: 140, borderRadius: '50%', boxShadow: `-30px 10px 0 0 #ffe9a8`, transform: 'rotate(-20deg)'}} />
      <div style={{fontSize: 200, fontWeight: 900, fontFamily: mono, color: ACC2, transform: `scale(${s})`}}>22:34</div>
      <div style={{width: 900, background: CARD, borderRadius: 24, padding: 36, textAlign: 'left', fontFamily: mono, fontSize: 36, border: '2px solid #232a38', marginTop: 20}}>
        {lines.map((l, i) => {
          const st = 8 + i * 8; const ch = Math.floor(interpolate(f, [st, st + 8], [0, l.length], clamp));
          return <div key={i} style={{color: i === lines.length - 1 ? GREEN : i === 0 ? FG : DIM, height: 52}}>{l.slice(0, ch)}</div>;
        })}
      </div>
      <div style={{fontSize: 190, fontWeight: 900, fontFamily: mono, letterSpacing: -6, marginTop: 50, color: minor === 29 ? ACC : FG, opacity: appear(f, at(0.28))}}>v2.{minor}.{patch}</div>
      <div style={{marginTop: 20}}><Words text="Aufgeben? Kein Konzept." delay={at(0.7)} size={96} highlight={['Konzept.']} /></div>
    </Scene>
  );
};

// 4 — Privacy
const Privacy: React.FC = () => {
  const f = useCurrentFrame(); const at = useAt();
  const s = useSpr(0, 10);
  const cloudX = interpolate(f, [at(0.72), at(0.92)], [0, 1400], {...clamp, easing: Easing.in(Easing.cubic)});
  const lock = useSpr(at(0.05), 8);
  return (
    <Scene>
      <svg width={220} height={260} viewBox="0 0 220 260" style={{transform: `scale(${lock})`, marginBottom: 30}}>
        <path d="M50 120 V80 a60 60 0 0 1 120 0 V120" fill="none" stroke={ACC} strokeWidth={22} strokeLinecap="round" />
        <rect x={20} y={115} width={180} height={140} rx={28} fill={ACC} />
        <circle cx={110} cy={180} r={20} fill={BG} />
      </svg>
      <div style={{fontSize: 170, fontWeight: 900, letterSpacing: -8, lineHeight: 0.95, transform: `scale(${s})`}}>LOCAL<br /><span style={{color: ACC}}>FIRST.</span></div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20, marginTop: 60}}>
        {[['Eigene Suchmaschine', 'SearXNG', at(0.38)], ['Eigener Server', 'VPS „henner“', at(0.5)]].map(([a, b, d]) => (
          <div key={a as string} style={{fontSize: 52, fontWeight: 800, opacity: appear(f, d as number), transform: `translateY(${(1 - appear(f, d as number)) * 30}px)`}}>
            {a} <span style={{fontFamily: mono, fontSize: 36, color: ACC2}}>· {b}</span>
          </div>
        ))}
      </div>
      <div style={{fontSize: 64, fontWeight: 800, color: DIM, marginTop: 50, opacity: appear(f, at(0.62)), transform: `translateX(${cloudX}px) rotate(${cloudX / 40}deg)`}}>☁ Cloud? Nur wenn's sein muss.</div>
    </Scene>
  );
};

// 5 — Freizeit
const tiles = [
  {t: 'BeamNG', s: 'Einmal um die ganze Erde', c: ACC, x: 0.18},
  {t: 'Lyrics', s: 'Songtexte im Minecraft-Himmel', c: '#b98cff', x: 0.38},
  {t: 'Mods', s: 'Fabric · Java', c: GREEN, x: 0.45},
  {t: 'henrik.click', s: 'Vom Orbit zur Landebahn', c: ACC2, x: 0.68},
];
const Play: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const at = useAt();
  return (
    <Scene>
      <Words text="Wenn er nicht programmiert …" size={80} delay={0} stagger={3} />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 70, width: 940}}>
        {tiles.map((x, i) => {
          const s = spring({frame: f - at(x.x), fps, config: {damping: 11, mass: 0.5}});
          return (
            <div key={i} style={{background: CARD, border: `3px solid ${x.c}`, borderRadius: 28, padding: '56px 24px', transform: `scale(${s}) rotate(${(1 - s) * (i % 2 ? 20 : -20)}deg)`, opacity: s}}>
              <div style={{fontSize: x.t.length > 8 ? 54 : 74, fontWeight: 900, color: x.c}}>{x.t}</div>
              <div style={{fontSize: 30, color: FG, opacity: 0.8, marginTop: 12}}>{x.s}</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

// 6 — Hartnäckig
const Stubborn: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const at = useAt();
  const mail = useSpr(at(0.2), 12);
  const stamp = spring({frame: f - at(0.42), fps, config: {damping: 8}});
  return (
    <Scene>
      <Words text="Und wehe, etwas läuft schief." size={84} stagger={3} highlight={['schief.']} />
      <div style={{position: 'relative', width: 900, marginTop: 60, background: FG, color: BG, borderRadius: 24, padding: 44, textAlign: 'left', transform: `translateY(${(1 - mail) * 600}px) rotate(${(1 - mail) * 10 - 2}deg)`, opacity: mail}}>
        <div style={{fontSize: 30, color: '#666', fontFamily: mono}}>Betreff:</div>
        <div style={{fontSize: 52, fontWeight: 900, marginTop: 6}}>Formelle Beschwerde</div>
        <div style={{fontSize: 34, fontFamily: mono, marginTop: 14, color: '#444'}}>Fall-Nr. ●●●●●●●●</div>
        <div style={{position: 'absolute', right: 30, bottom: 30, fontSize: 46, fontWeight: 900, color: ACC, border: `6px solid ${ACC}`, borderRadius: 14, padding: '6px 20px', transform: `rotate(-14deg) scale(${interpolate(stamp, [0, 1], [3, 1])})`, opacity: Math.min(1, stamp * 2)}}>GESENDET</div>
      </div>
      <div style={{position: 'relative', height: 330, width: 900, marginTop: 70}}>
        {[0, 1, 2].map(i => {
          const s = spring({frame: f - at(0.62) - i * 6, fps, config: {damping: 12}});
          return (
            <div key={i} style={{position: 'absolute', left: 150, top: 20, width: 600, background: CARD, border: `3px solid ${ACC2}`, borderRadius: 22, padding: '28px 30px', textAlign: 'left', transform: `rotate(${(i - 1) * 9 * s}deg) translateX(${(i - 1) * 150 * s}px)`, opacity: s}}>
              <div style={{fontSize: 36, fontWeight: 900, color: ACC2}}>Festpreisanfrage</div>
              <div style={{fontSize: 28, fontFamily: mono, color: DIM, marginTop: 8}}>Angebot {i + 1} / 3</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

// 7 — Sparfuchs
const Thrifty: React.FC = () => {
  const f = useCurrentFrame(); const at = useAt();
  const tokens = Math.floor(interpolate(f, [0, at(0.4)], [0, 184213], clamp));
  const cost = (tokens * 0.000015).toFixed(4);
  const p = useSpr(at(0.45), 9);
  const strike = interpolate(f, [at(0.68), at(0.74)], [0, 1], clamp);
  const shake = f > at(0.68) && f < at(0.76) ? Math.sin(f * 3) * 12 : 0;
  return (
    <Scene>
      <div style={{fontFamily: mono, fontSize: 40, color: ACC2}}>claude-code-api-cost</div>
      <div style={{background: CARD, borderRadius: 24, padding: '30px 50px', marginTop: 20, fontFamily: mono, display: 'flex', gap: 60, border: '2px solid #232a38'}}>
        <div><div style={{fontSize: 28, color: DIM}}>TOKENS</div><div style={{fontSize: 64, fontWeight: 700}}>{tokens.toLocaleString('de-DE')}</div></div>
        <div><div style={{fontSize: 28, color: DIM}}>KOSTEN</div><div style={{fontSize: 64, fontWeight: 700, color: GREEN}}>${cost}</div></div>
      </div>
      <div style={{position: 'relative', marginTop: 90, transform: `scale(${p}) translateX(${shake}px)`}}>
        <div style={{fontSize: 56, color: DIM, fontWeight: 700}}>Skill für</div>
        <div style={{fontSize: 280, fontWeight: 900, letterSpacing: -12, lineHeight: 1}}>15 €</div>
        <div style={{position: 'absolute', left: -20, top: '62%', height: 26, width: `${strike * 110}%`, background: ACC, transform: 'rotate(-8deg)', borderRadius: 13}} />
      </div>
      <div style={{marginTop: 50}}><Words text="Sieht er überhaupt nicht ein." delay={at(0.75)} size={78} stagger={3} highlight={['überhaupt', 'nicht']} /></div>
    </Scene>
  );
};

// 8 — Fazit
const Verdict: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const at = useAt();
  const v: [string, number][] = [['Tüftler.', 0.08], ['Sparfuchs.', 0.15], ['Nachteule.', 0.23]];
  const tail: [string, number][] = [['Löst Probleme, statt sie hinzunehmen.', 0.33], ['Meistens selbst.', 0.58], ['Meistens nachts.', 0.67], ['Meistens richtig gut.', 0.77]];
  return (
    <Scene>
      <div style={{fontSize: 50, color: DIM, letterSpacing: 8, fontWeight: 700, marginBottom: 30, opacity: appear(f, 0)}}>MEIN FAZIT</div>
      {v.map(([w, x], i) => {
        const s = spring({frame: f - at(x), fps, config: {damping: 7, mass: 0.7}});
        return <div key={w} style={{fontSize: 150, fontWeight: 900, letterSpacing: -6, lineHeight: 1.05, transform: `scale(${interpolate(s, [0, 1], [3, 1])})`, opacity: Math.min(1, s * 2), color: i === 1 ? ACC : FG}}>{w}</div>;
      })}
      <div style={{marginTop: 60, display: 'flex', flexDirection: 'column', gap: 14}}>
        {tail.map(([t, x], i) => (
          <div key={t} style={{fontSize: i === 0 ? 52 : 62, fontWeight: i === 3 ? 900 : 700, color: i === 3 ? GREEN : FG, opacity: appear(f, at(x), 8), transform: `translateY(${(1 - appear(f, at(x), 8)) * 30}px)`}}>{t}</div>
        ))}
      </div>
    </Scene>
  );
};

// 9 — Outro
const Outro: React.FC = () => {
  const f = useCurrentFrame(); const s = useSpr(12);
  return (
    <Scene>
      <div style={{fontSize: 60, color: DIM, opacity: appear(f, 0)}}>Dieses Video hat gekostet:</div>
      <div style={{fontSize: 340, fontWeight: 900, color: GREEN, transform: `scale(${s})`, letterSpacing: -14}}>0 €</div>
      <div style={{fontSize: 48, fontFamily: mono, color: ACC2, opacity: appear(f, 35)}}>Claude + Remotion</div>
    </Scene>
  );
};

const map: Record<string, React.FC> = {intro: Intro, builder: Builder, night: Night, privacy: Privacy, play: Play, stubborn: Stubborn, thrifty: Thrifty, verdict: Verdict, outro: Outro};
export const TOTAL = timing.reduce((a, s) => a + s.frames, 0) + 15;

const Background: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(f / 60) * 30}% ${40 + Math.cos(f / 80) * 20}%, ${ACC}22, transparent 55%), radial-gradient(circle at ${50 - Math.sin(f / 70) * 30}% 80%, ${ACC2}1a, transparent 50%)`}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)', backgroundSize: '60px 60px', backgroundPosition: `0 ${f * 0.5}px`}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${(f / TOTAL) * 100}%`, background: ACC}} />
    </AbsoluteFill>
  );
};

export const Henrik: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile('soundtrack.wav')} />
      {timing.map((s) => {
        const C = map[s.id]; const from = at; at += s.frames;
        return <Sequence key={s.id} from={from} durationInFrames={s.frames}><LenCtx.Provider value={s.frames}><C /></LenCtx.Provider></Sequence>;
      })}
    </AbsoluteFill>
  );
};
