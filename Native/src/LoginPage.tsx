import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import {
  CheckCircle2, ArrowRight,
  Code2, Workflow, LayoutTemplate, Leaf, BarChart2, Users,
  BrainCircuit, FileSearch, Shield, Cpu, Bot, Database,
  Eye, Music2, Plane, Camera, ShoppingBag, ClipboardList,
  FileText, ChefHat, Tag, Hotel, TrendingUp,
  FileJson, Gavel, Stethoscope, Store, Gamepad2,
} from 'lucide-react';
import { msalInstance } from './auth/msalInstance';
import { loginRequest } from './auth/authConfig';

/* ─── Network mesh canvas (dots + subtle connecting lines) ─── */
const MeshCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    type Node = { x: number; y: number; vx: number; vy: number };
    const nodes: Node[] = [];
    const N = 48;
    const MAX_DIST = 110;
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize(); window.addEventListener('resize', resize);
    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight;
    for (let i = 0; i < N; i++)
      nodes.push({
        x: Math.random() * W(), y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      });
    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
      });
      // Draw lines first
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = 0.08 * (1 - d / MAX_DIST);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw dots on top
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fill();
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
};

/* ─── App names horizontal marquee — all 25 actual apps ─── */
const ROW1 = [
  { name: 'SustainIQ™',           icon: BarChart2,     color: '#fbbf24' },
  { name: 'EcoLensAI™',           icon: Leaf,          color: '#34d399' },
  { name: 'SafeWatch™',           icon: Eye,           color: '#f87171' },
  { name: 'InterviewIQ™',         icon: Users,         color: '#f472b6' },
  { name: 'SkillIQ™',             icon: BrainCircuit,  color: '#fb923c' },
  { name: 'Resonance™',           icon: Music2,        color: '#c084fc' },
  { name: 'AeroIntel',            icon: Plane,         color: '#38bdf8' },
  { name: 'VisionIQ™',            icon: Camera,        color: '#a3e635' },
  { name: 'RetailIQ™',            icon: ShoppingBag,   color: '#67e8f9' },
  { name: 'CFO Lens™',            icon: TrendingUp,    color: '#0FD48E' },
  { name: 'Parsify',              icon: FileJson,      color: '#38bdf8' },
  { name: 'Scout',                icon: Gavel,         color: '#fbbf24' },
];

const ROW2 = [
  { name: 'Ops Reporting Portal™',icon: ClipboardList, color: '#818cf8' },
  { name: 'Quote Generator™',     icon: FileText,      color: '#60a5fa' },
  { name: 'IntelliFrame™',        icon: LayoutTemplate,color: '#e879f9' },
  { name: 'aiDE™',                icon: Code2,         color: '#818cf8' },
  { name: 'Digital Twin AI Chef™',icon: ChefHat,      color: '#fbbf24' },
  { name: 'PromoIQ™',             icon: Tag,           color: '#f472b6' },
  { name: 'ConciergeAI™',         icon: Hotel,         color: '#34d399' },
  { name: 'Orbit™',               icon: Workflow,      color: '#38bdf8' },
  { name: 'Fraud Investigation Command Center™', icon: Shield, color: '#1E90FF' },
  { name: 'GovernIQ™',            icon: Database,      color: '#1E90FF' },
  { name: 'MedScribe',            icon: Stethoscope,   color: '#f472b6' },
  { name: 'Retail Concierge',     icon: Store,         color: '#34d399' },
  { name: 'MedGame Studio',       icon: Gamepad2,      color: '#c084fc' },
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
        <MeshCanvas />
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
            <span className="lp-wordmark">Marketplace</span>
          </motion.div>

          {/* Headline */}
          <div className="lp-hero-text">
            <motion.p className="lp-eyebrow"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.1, ease:[0.22,1,0.36,1] }}
            >
              — SYSTECH ENTERPRISE AI
            </motion.p>

            <motion.h1 className="lp-headline"
              initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.65, delay:0.18, ease:[0.22,1,0.36,1] }}
            >
              Intelligence,<br />
              <span className="lp-headline-accent">amplified.</span>
            </motion.h1>

            <motion.p className="lp-sub"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.55, delay:0.28, ease:[0.22,1,0.36,1] }}
            >
              A unified hub where AI meets enterprise.
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
            <img src="/Systech_Logo1.png" alt="Systech" style={{ height:32 }} />
          </div>

          <div className="lp-card-badge">
            <span className="lp-badge-pulse" />
            Secure Access Portal
          </div>

          <h2 className="lp-card-title">Welcome back</h2>
          <p className="lp-card-sub">
            Sign in with your Microsoft account to access
            the Systech AI Marketplace.
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
            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? undefined : '0 8px 30px rgba(37,99,235,0.28)' }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ type:'spring', stiffness:400, damping:22 }}
          >
            {loading ? <span className="lp-spinner" /> : <MicrosoftLogo />}
            <span>{loading ? 'Redirecting to Microsoft…' : 'Sign in with Microsoft'}</span>
            {!loading && <ArrowRight size={16} className="lp-btn-arrow" />}
          </motion.button>

          <div className="lp-perks">
            {[
              'Access to all AI applications instantly',
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




