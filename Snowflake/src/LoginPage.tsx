import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import {
  CheckCircle2, ArrowRight,
  Code2, Workflow, LayoutTemplate, Leaf, BarChart2, Users,
  BrainCircuit, FileSearch, Shield, Cpu, Bot, Database,
  Eye, Music2, Plane, Camera, ShoppingBag, ClipboardList,
  FileText, ChefHat, Tag, Hotel,
} from 'lucide-react';
import { msalInstance } from './auth/msalInstance';
import { loginRequest } from './auth/authConfig';

/* ─── Snowflake crystal particle canvas ─── */
const SnowflakeCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    type Flake = {
      x: number; y: number;
      vx: number; vy: number;
      size: number; rotation: number; rotSpeed: number;
      opacity: number;
    };

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize(); window.addEventListener('resize', resize);
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight;

    const flakes: Flake[] = [];
    for (let i = 0; i < 40; i++) {
      flakes.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.22,
        vy: Math.random() * 0.35 + 0.10,
        size: Math.random() * 14 + 5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.006,
        opacity: Math.random() * 0.30 + 0.08,
      });
    }

    const drawCrystal = (x: number, y: number, size: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      /* Alternate crystals between Snowflake Blue and Star Blue */
      const isStarBlue = (Math.round(x + y) % 3 === 0);
      ctx.strokeStyle = isStarBlue ? `rgba(110,201,235,${alpha})` : `rgba(36,158,220,${alpha})`;
      ctx.lineWidth = 0.9;
      ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        // main arm
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);
        // inner branches
        ctx.moveTo(size * 0.42, 0);
        ctx.lineTo(size * 0.58, size * 0.17);
        ctx.moveTo(size * 0.42, 0);
        ctx.lineTo(size * 0.58, -size * 0.17);
        // outer branches
        ctx.moveTo(size * 0.68, 0);
        ctx.lineTo(size * 0.82, size * 0.15);
        ctx.moveTo(size * 0.68, 0);
        ctx.lineTo(size * 0.82, -size * 0.15);
        ctx.stroke();
      }
      // centre dot
      ctx.beginPath();
      ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = isStarBlue ? `rgba(110,201,235,${alpha * 1.5})` : `rgba(36,158,220,${alpha * 1.5})`;
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      flakes.forEach((f) => {
        f.x += f.vx; f.y += f.vy; f.rotation += f.rotSpeed;
        if (f.y > H() + f.size) { f.y = -f.size; f.x = Math.random() * W(); }
        if (f.x < -f.size) f.x = W() + f.size;
        if (f.x > W() + f.size) f.x = -f.size;
        drawCrystal(f.x, f.y, f.size, f.rotation, f.opacity);
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
};

/* ─── App names horizontal marquee — 8 visible apps ─── */
const ROW1 = [
  { name: 'VisionIQ™',                   icon: Camera,        color: '#a3e635' },
  { name: 'SustainIQ™',              icon: BarChart2,     color: '#fbbf24' },
  { name: 'IntelliFrame™',             icon: LayoutTemplate,color: '#e879f9' },
  { name: 'AeroIntel',                icon: Plane,         color: '#38bdf8' },
];

const ROW2 = [
  { name: 'PromoIQ™',    icon: Tag,           color: '#f472b6' },
  { name: 'SysMart',                  icon: ShoppingBag,   color: '#67e8f9' },
  { name: 'SkillIQ™',                  icon: BrainCircuit,  color: '#fb923c' },
  { name: 'Loan Document Processing', icon: FileText,      color: '#60a5fa' },
];

const MarqueeRow = ({ items, reverse = false, dur = 22 }: {
  items: { name: string; icon: React.ElementType; color: string }[]; reverse?: boolean; dur?: number;
}) => (
  <div className="lp-marquee-track">
    <div className={`lp-marquee-inner ${reverse ? 'lp-marquee-rev' : ''}`}
      style={{ animationDuration: `${dur}s` }}>
      {[...items, ...items].map((app, i) => {
        const Icon = app.icon;
        return (
          <div key={i} className="lp-marquee-chip">
            <Icon size={15} strokeWidth={2} style={{ color: app.color, flexShrink: 0 }} />
            <span>{app.name}</span>
          </div>
        );
      })}
    </div>
  </div>
);

const AppMarquee = () => (
  <div className="lp-marquee-wrap">
    <MarqueeRow items={ROW1} dur={22} />
    <MarqueeRow items={ROW2} reverse dur={28} />
  </div>
);

/* ─── Snowflake geometric icon (official brand mark style) ─── */
const SnowflakeBrandIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {/* 6-armed geometric crystal matching Snowflake Inc brand proportions */}
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <g key={deg} transform={`rotate(${deg} 12 12)`}>
        {/* Main arm */}
        <line x1="12" y1="12" x2="12" y2="2.5"  stroke="#249edc" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Inner branches — Star Blue teal */}
        <line x1="12" y1="7"  x2="8.8" y2="5.1" stroke="#6ec9eb" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="12" y1="7"  x2="15.2" y2="5.1" stroke="#6ec9eb" strokeWidth="1.3" strokeLinecap="round"/>
        {/* Outer branches */}
        <line x1="12" y1="4"  x2="9.8" y2="2.7" stroke="#249edc" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="12" y1="4"  x2="14.2" y2="2.7" stroke="#249edc" strokeWidth="1.1" strokeLinecap="round"/>
      </g>
    ))}
    <circle cx="12" cy="12" r="1.8" fill="#249edc" />
  </svg>
);

/* ─── Microsoft logo ─── */
const MicrosoftLogo = () => (
  <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
    <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
    <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);

/* ─── Main ─── */
const LoginPage = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState<string | null>(null);

  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) { msalInstance.setActiveAccount(accounts[0]); onAuthenticated(); }
  }, [onAuthenticated]);

  const handleLogin = async () => {
    setLoading(true); setError(null);
    try { await msalInstance.loginRedirect(loginRequest); }
    catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">

      {/* ══ LEFT ══ */}
      <div className="lp-left">
        <SnowflakeCanvas />
        <div className="lp-orb lp-orb1" />
        <div className="lp-orb lp-orb2" />

        <div className="lp-left-inner">

          {/* Brand */}
          <motion.div className="lp-brand"
            initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
          >
            <img src="/Systech_Logo1.png" alt="Systech" className="lp-logo" />
            <div className="lp-brand-divider" />
            {/* Official Snowflake logo — white version on dark panel */}
            <img
              src="/snowflake_logo.svg"
              alt="Snowflake"
              className="lp-sf-logo"
            />
          </motion.div>

          {/* Headline */}
          <div className="lp-hero-text">
            <motion.p className="lp-eyebrow"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.1, ease:[0.22,1,0.36,1] }}
            >
              — SYSTECH × SNOWFLAKE
            </motion.p>

            <motion.h1 className="lp-headline"
              initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.65, delay:0.18, ease:[0.22,1,0.36,1] }}
            >
              Data apps,<br />
              <span className="lp-headline-accent">unleashed.</span>
            </motion.h1>

            <motion.p className="lp-sub"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.55, delay:0.28, ease:[0.22,1,0.36,1] }}
            >
              Snowflake-native AI applications built for enterprise scale.
            </motion.p>
          </div>

          {/* Horizontal marquee — pinned to bottom */}
          <motion.div style={{ overflow:'hidden', marginTop:'auto', paddingBottom:'12px' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ duration:0.7, delay:0.45 }}
          >
            <AppMarquee />
          </motion.div>

        </div>
      </div>

      {/* ══ RIGHT ══ */}
      <div className="lp-right">
        <motion.div className="lp-card"
          initial={{ opacity:0, x:40, scale:0.97 }}
          animate={{ opacity:1, x:0,  scale:1    }}
          transition={{ duration:0.7, delay:0.18, ease:[0.22,1,0.36,1] }}
        >
          <div className="lp-card-mobile-logo">
            <img src="/Systech_Logo1.png" alt="Systech" style={{ height:32, marginRight: 12 }} />
            <img src="/snowflake_logo.svg" alt="Snowflake" style={{ height:20 }} />
          </div>

          <div className="lp-card-badge">
            <span className="lp-badge-pulse" />
            Snowflake Native App
          </div>

          <h2 className="lp-card-title">Welcome back</h2>
          <p className="lp-card-sub">
            Sign in with your Microsoft account to access
            the Systech Snowflake Marketplace.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div className="lp-error"
                initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button className={`lp-btn ${loading ? 'lp-btn-loading' : ''}`}
            onClick={handleLogin} disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? undefined : '0 8px 30px rgba(36,158,220,0.40)' }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ type:'spring', stiffness:400, damping:22 }}
          >
            {loading ? <span className="lp-spinner" /> : <MicrosoftLogo />}
            <span>{loading ? 'Redirecting to Microsoft…' : 'Sign in with Microsoft'}</span>
            {!loading && <ArrowRight size={16} className="lp-btn-arrow" />}
          </motion.button>

          <div className="lp-perks">
            {[
              'Snowflake-native apps — no data movement',
              'Enterprise-grade security with Azure AD',
            ].map((perk) => (
              <div key={perk} className="lp-perk">
                <CheckCircle2 size={14} strokeWidth={2.5} className="lp-perk-icon" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          <p className="lp-card-footer">
            By signing in you agree to Systech's{' '}
            <span className="lp-card-footer-link">Terms of Service</span>{' '}
            and{' '}
            <span className="lp-card-footer-link">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;


