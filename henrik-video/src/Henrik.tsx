import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

const BG = '#0b0d12', FG = '#f4f1ea', ACC = '#ff6a3d', ACC2 = '#3dd6ff', DIM = '#7d8494';
const font = 'Inter, "Inter Display", sans-serif';
const mono = '"DejaVu Sans Mono", monospace';

const useSpring = (delay = 0, damping = 14) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, mass: 0.6}});
};
const fadeOut = (f: number, end: number, len = 8) => interpolate(f, [end - len, end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: font, color: FG, padding: 80, textAlign: 'center', ...style}}>{children}</AbsoluteFill>
);

// Wort-für-Wort-Einflug
const Words: React.FC<{text: string; delay?: number; size?: number; color?: string; stagger?: number; highlight?: string[]}> = ({text, delay = 0, size = 110, color = FG, stagger = 4, highlight = []}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.28}px`, fontSize: size, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2}}>
      {text.split(' ').map((w, i) => {
        const s = spring({frame: f - delay - i * stagger, fps, config: {damping: 12, mass: 0.5}});
        return <span key={i} style={{display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 80}px) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`, color: highlight.includes(w) ? ACC : color}}>{w}</span>;
      })}
    </div>
  );
};

// 1 — Intro
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(18, 10);
  const ring = interpolate(f, [0, 40], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <Center style={{opacity: fadeOut(f, 90)}}>
      <div style={{position: 'absolute', width: 900 * ring, height: 900 * ring, borderRadius: '50%', border: `6px solid ${ACC}`, opacity: 1 - ring * 0.7}} />
      <div style={{fontSize: 56, color: DIM, fontWeight: 600, letterSpacing: 8, opacity: ring}}>CLAUDE ANALYSIERT</div>
      <div style={{fontSize: 230, fontWeight: 900, letterSpacing: -10, transform: `scale(${0.6 + s * 0.4})`, opacity: s}}>Henrik</div>
      <div style={{fontSize: 48, color: ACC2, fontFamily: mono, opacity: interpolate(f, [40, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>@Henner4746</div>
    </Center>
  );
};

// 2 — Nachteule
const lines = ['$ cargo build --release', '   Compiling kern.rs', '   Compiling telefon.rs', '   Compiling wache.rs', '   Compiling pushdialog.rs', '    Finished heimnetz v2.29.3'];
const NightOwl: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0);
  return (
    <Center style={{opacity: fadeOut(f, 120), justifyContent: 'flex-start', paddingTop: 260}}>
      <div style={{fontSize: 200, fontWeight: 900, fontFamily: mono, color: ACC2, transform: `scale(${s})`}}>22:34</div>
      <div style={{fontSize: 52, color: DIM, marginBottom: 60}}>Dienstagabend. Er ist noch dran.</div>
      <div style={{width: 900, background: '#151923', borderRadius: 24, padding: 40, textAlign: 'left', fontFamily: mono, fontSize: 38, border: '2px solid #232a38'}}>
        {lines.map((l, i) => {
          const start = 20 + i * 12;
          const chars = Math.floor(interpolate(f, [start, start + 10], [0, l.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
          const last = i === lines.length - 1;
          return <div key={i} style={{color: last ? '#7dff9a' : i === 0 ? FG : DIM, height: 56}}>{l.slice(0, chars)}</div>;
        })}
      </div>
    </Center>
  );
};

// 3 — Versionszähler
const Versions: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 60], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const minor = Math.round(p * 29);
  const patch = minor === 29 ? 3 : Math.floor((f * 7) % 10);
  const s = useSpring(62, 8);
  return (
    <Center style={{opacity: fadeOut(f, 115)}}>
      <div style={{fontSize: 60, color: DIM, fontWeight: 600}}>heimnetz-dashboard</div>
      <div style={{fontSize: 210, fontWeight: 900, fontFamily: mono, letterSpacing: -6, color: minor === 29 ? ACC : FG}}>v2.{minor}.{patch}</div>
      <div style={{marginTop: 40, opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
        <Words text="Aufgeben? Kein Konzept." delay={66} size={100} highlight={['Konzept.']} />
      </div>
    </Center>
  );
};

// 4 — Sparfuchs
const Thrifty: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const price = spring({frame: f, fps, config: {damping: 9}});
  const strike = interpolate(f, [25, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = f > 25 && f < 40 ? Math.sin(f * 3) * 12 : 0;
  return (
    <Center style={{opacity: fadeOut(f, 150)}}>
      <div style={{fontSize: 64, color: DIM, fontWeight: 600, marginBottom: 20}}>Motion-Graphics-Skill für</div>
      <div style={{position: 'relative', transform: `scale(${price}) translateX(${shake}px)`}}>
        <div style={{fontSize: 300, fontWeight: 900, letterSpacing: -12}}>15 €</div>
        <div style={{position: 'absolute', left: -20, top: '52%', height: 26, width: `${strike * 110}%`, background: ACC, transform: 'rotate(-8deg)', borderRadius: 13}} />
      </div>
      <div style={{marginTop: 50}}><Words text="Sehe ich überhaupt nicht ein." delay={42} size={84} highlight={['überhaupt', 'nicht']} /></div>
      <div style={{marginTop: 90, fontSize: 44, fontFamily: mono, color: ACC2, opacity: interpolate(f, [85, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        Repo: claude-code-api-cost
      </div>
      <div style={{fontSize: 46, color: DIM, marginTop: 14, opacity: interpolate(f, [95, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        Er weiß genau, was jeder Token kostet.
      </div>
    </Center>
  );
};

// 5 — Interessen-Kacheln
const tiles = [
  {t: 'BeamNG', s: 'Mods, ADAS, ganze Erde', c: ACC},
  {t: 'Flugbuch', s: 'henrik-flugbuch', c: ACC2},
  {t: 'Salsa', s: 'salsanow-session-guide', c: '#ff3d8b'},
  {t: 'Rust', s: 'kern.rs · wache.rs', c: '#ffb23d'},
  {t: 'Privacy', s: 'SearXNG · awesome-privacy', c: '#7dff9a'},
  {t: 'Lyrics', s: 'lyrics-in-the-sky', c: '#b98cff'},
];
const Interests: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (
    <Center style={{opacity: fadeOut(f, 150)}}>
      <Words text="22 Repos. Null Langeweile." size={96} highlight={['Null']} />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 70, width: 940}}>
        {tiles.map((x, i) => {
          const s = spring({frame: f - 20 - i * 7, fps, config: {damping: 11, mass: 0.5}});
          return (
            <div key={i} style={{background: '#151923', border: `3px solid ${x.c}`, borderRadius: 28, padding: '44px 24px', transform: `scale(${s}) rotate(${(1 - s) * (i % 2 ? 20 : -20)}deg)`, opacity: s}}>
              <div style={{fontSize: 72, fontWeight: 900, color: x.c}}>{x.t}</div>
              <div style={{fontSize: 30, color: DIM, fontFamily: mono, marginTop: 10}}>{x.s}</div>
            </div>
          );
        })}
      </div>
    </Center>
  );
};

// 6 — Local first
const LocalFirst: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 10);
  const cloudX = interpolate(f, [30, 70], [0, 1400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  return (
    <Center style={{opacity: fadeOut(f, 120)}}>
      <div style={{fontSize: 70, fontWeight: 800, color: DIM, transform: `translateX(${cloudX}px) rotate(${cloudX / 40}deg)`}}>☁ Cloud-Abo</div>
      <div style={{fontSize: 190, fontWeight: 900, letterSpacing: -8, lineHeight: 0.95, marginTop: 40, transform: `scale(${s})`}}>
        LOCAL<br /><span style={{color: ACC}}>FIRST.</span>
      </div>
      <div style={{marginTop: 60}}><Words text="Eigener Server. Eigene App. Eigene Regeln." delay={55} size={60} stagger={3} color={FG} /></div>
    </Center>
  );
};

// 7 — Fazit
const verdict = ['Tüftler.', 'Sparfuchs.', 'Nachteule.'];
const Verdict: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (
    <Center style={{opacity: fadeOut(f, 200)}}>
      <div style={{fontSize: 52, color: DIM, letterSpacing: 6, fontWeight: 700, marginBottom: 40}}>MEINE EINSCHÄTZUNG</div>
      {verdict.map((w, i) => {
        const s = spring({frame: f - 10 - i * 14, fps, config: {damping: 7, mass: 0.7}});
        return <div key={i} style={{fontSize: 150, fontWeight: 900, letterSpacing: -6, lineHeight: 1.05, transform: `scale(${interpolate(s, [0, 1], [3, 1])})`, opacity: Math.min(1, s * 2), color: i === 1 ? ACC : FG}}>{w}</div>;
      })}
      <div style={{marginTop: 70, width: 900}}>
        <Words text="Baut lieber drei Nächte selbst, als 15 € zu zahlen –" delay={65} size={54} stagger={3} />
        <div style={{height: 20}} />
        <Words text="und hat damit meistens recht." delay={100} size={66} stagger={4} highlight={['recht.']} />
      </div>
    </Center>
  );
};

// 8 — Outro
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0);
  return (
    <Center>
      <div style={{fontSize: 60, color: DIM, opacity: s}}>Dieses Video hat gekostet:</div>
      <div style={{fontSize: 340, fontWeight: 900, color: '#7dff9a', transform: `scale(${s})`, letterSpacing: -14}}>0 €</div>
      <div style={{fontSize: 48, fontFamily: mono, color: ACC2, opacity: interpolate(f, [20, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>Claude + Remotion</div>
    </Center>
  );
};

const scenes: [React.FC, number][] = [[Intro, 90], [NightOwl, 120], [Versions, 115], [Thrifty, 150], [Interests, 150], [LocalFirst, 120], [Verdict, 200], [Outro, 75]];
export const TOTAL = scenes.reduce((a, [, d]) => a + d, 0);

const Background: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(f / 60) * 30}% ${40 + Math.cos(f / 80) * 20}%, ${ACC}22, transparent 55%), radial-gradient(circle at ${50 - Math.sin(f / 70) * 30}% 80%, ${ACC2}1a, transparent 50%)`}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
    </AbsoluteFill>
  );
};

export const Henrik: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      <Background />
      {scenes.map(([C, d], i) => { const from = at; at += d; return <Sequence key={i} from={from} durationInFrames={d}><C /></Sequence>; })}
    </AbsoluteFill>
  );
};
