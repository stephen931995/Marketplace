import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import {
  CheckCircle2, ArrowRight, ArrowLeft,
  Code2, Workflow, LayoutTemplate, Leaf, BarChart2, Users,
  BrainCircuit, FileSearch, Shield, Cpu, Bot, Database,
  Eye, Music2, Plane, Camera, ShoppingBag, ClipboardList,
  FileText, ChefHat, Tag, Hotel, TrendingUp,
  User, Mail, Building2, X,
} from 'lucide-react';
import { msalInstance } from './auth/msalInstance';
import { loginRequest } from './auth/authConfig';
import { isWorkEmail } from './workEmail';

/* ─── Official Databricks Logo ─── */
const DatabricksLogo = ({ height = 22 }: { height?: number }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Databricks-logo.svg"
    alt="Databricks"
    style={{ height, width: 'auto', filter: 'brightness(0) invert(1)' }}
  />
);

/* ─── Databricks Spark Particle Canvas ─── */
const MeshCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    };

    const COLORS = [
      'rgba(235,22,0,',   // Databricks red
      'rgba(235,22,0,',    // Databricks red lighter
      'rgba(255,140,66,',  // orange
      'rgba(0,199,177,',   // teal
      'rgba(255,255,255,', // white
    ];

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight;
    const N = 55;
    const MAX_DIST = 120;

    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;
      });

      // Connecting lines — red/orange tones
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const a = 0.06 * (1 - d / MAX_DIST);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(235,22,0,${a})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles — colored sparks
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
};

/* ─── App names horizontal marquee — 10 visible apps ─── */
const ROW1 = [
  { name: 'VisionIQ™',                     icon: Camera,        color: '#FF8C42' },
  { name: 'SustainIQ™',                    icon: Leaf,          color: '#0FD48E' },
  { name: 'EcoLensAI™',                    icon: BarChart2,     color: '#00C7B1' },
  { name: 'RetailIQ™',                     icon: ShoppingBag,   color: '#1E90FF' },
  { name: 'CFO Lens™',                     icon: TrendingUp,    color: '#0FD48E' },
];

const ROW2 = [
  { name: 'IntelliFrame™',                 icon: LayoutTemplate,color: '#FF8C42' },
  { name: 'PromoIQ™',                      icon: Tag,           color: '#EB1600' },
  { name: 'SkillIQ™',                      icon: BrainCircuit,  color: '#EB1600' },
  { name: 'Fraud Investigation Command Center™', icon: Shield,  color: '#1E90FF' },
  { name: 'GovernIQ™',                     icon: Database,      color: '#1E90FF' },
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
/** n8n webhook that emails guest credentials */
const GUEST_WEBHOOK_URL = 'https://n8n.systechusa.com/webhook/guest-access';

type GuestStatus = 'idle' | 'sending' | 'sent' | 'error';

const LoginPage = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState<string | null>(null);

  /* Guest access modal */
  const [guestOpen,   setGuestOpen  ] = useState(false);
  const [guestView,   setGuestView  ] = useState<'choice' | 'form'>('choice');
  const [guestStatus, setGuestStatus] = useState<GuestStatus>('idle');
  const [guestError,  setGuestError ] = useState<string | null>(null);
  const [guestForm,   setGuestForm  ] = useState({ name: '', email: '', company: '' });

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

  const closeGuest = () => {
    if (guestStatus === 'sending') return;
    setGuestOpen(false);
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Accept only work emails — reject personal / disposable providers
    if (!isWorkEmail(guestForm.email)) {
      setGuestStatus('error');
      setGuestError('Please use your work email address only.');
      return;
    }

    setGuestStatus('sending'); setGuestError(null);
    try {
      // Store the requester's details (best-effort — must not block credential delivery)
      fetch('/api/guest-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        guestForm.name.trim(),
          workEmail:   guestForm.email.trim(),
          companyName: guestForm.company.trim(),
        }),
      }).catch(console.error);

      // Email the credentials via n8n (primary action)
      const res = await fetch(GUEST_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    guestForm.name.trim(),
          email:   guestForm.email.trim(),
          company: guestForm.company.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setGuestStatus('sent');
      setGuestForm({ name: '', email: '', company: '' });
    } catch (err: unknown) {
      setGuestStatus('error');
      setGuestError(err instanceof Error ? err.message : 'Could not send credentials. Please try again.');
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
            <DatabricksLogo height={28} />
            <div className="lp-brand-divider" />
            <img src="/Systech_Logo1.png" alt="Systech" className="lp-logo" />
            <span className="lp-wordmark">Marketplace</span>
          </motion.div>

          {/* Headline */}
          <div className="lp-hero-text">
            <motion.p className="lp-eyebrow"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:0.1, ease:[0.22,1,0.36,1] }}
            >
              — SYSTECH ENTERPRISE AI · BUILT ON DATABRICKS
            </motion.p>

            <motion.h1 className="lp-headline"
              initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.65, delay:0.18, ease:[0.22,1,0.36,1] }}
            >
              Data Intelligence,<br />
              <span className="lp-headline-accent">Ignited.</span>
            </motion.h1>

            <motion.p className="lp-sub"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.55, delay:0.28, ease:[0.22,1,0.36,1] }}
            >
              Enterprise AI apps — powered by Databricks, delivered by Systech.
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Databricks-logo.svg"
                alt="Databricks"
                style={{ height: 28, width: 'auto' }}
              />
              <span style={{ width: 1, height: 24, background: '#DCE0E2', flexShrink: 0 }} />
              <img src="/Systech_Logo1.png" alt="Systech" style={{ height: 32, width: 'auto', opacity: 0.8 }} />
            </div>
          </div>

          <div className="lp-card-badge">
            <span className="lp-badge-pulse" />
            Secure Access Portal
          </div>

          <h2 className="lp-card-title">Welcome back</h2>
          <p className="lp-card-sub">
            Sign in with your Microsoft account to access
            the Systech Databricks Marketplace.
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
            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? undefined : '0 8px 30px rgba(235,22,0,0.35)' }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ type:'spring', stiffness:400, damping:22 }}
          >
            {loading ? <span className="lp-spinner" /> : <MicrosoftLogo />}
            <span>{loading ? 'Redirecting to Microsoft…' : 'Systechians, login here'}</span>
            {!loading && <ArrowRight size={16} className="lp-btn-arrow" />}
          </motion.button>

          {/* Guest access */}
          <div className="lp-guest">
            <div className="lp-guest-divider"><span>Are you a Guest&nbsp;?</span></div>
            <motion.button
              type="button"
              className="lp-guest-btn"
              onClick={() => { setGuestOpen(true); setGuestView('choice'); setGuestStatus('idle'); setGuestError(null); }}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              transition={{ type:'spring', stiffness:400, damping:22 }}
            >
              <Users size={16} strokeWidth={2} className="lp-guest-icon" />
              <span>Continue as Guest</span>
              <ArrowRight size={15} className="lp-btn-arrow" />
            </motion.button>
          </div>

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

      {/* ══ GUEST ACCESS MODAL ══ */}
      <AnimatePresence>
        {guestOpen && (
          <motion.div
            className="lp-guest-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeGuest}
          >
            <motion.div
              className="lp-guest-modal"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lp-guest-close" onClick={closeGuest} aria-label="Close">
                <X size={18} />
              </button>

              {guestStatus === 'sent' ? (
                /* ── Success state ── */
                <div className="lp-guest-success">
                  <div className="lp-guest-success-icon">
                    <CheckCircle2 size={34} strokeWidth={2} />
                  </div>
                  <h3 className="lp-guest-modal-title">Credentials on the way!</h3>
                  <p className="lp-guest-modal-sub">
                    We've emailed your guest login details. Please check your inbox
                    (and spam folder) to access the Systech Databricks Marketplace.
                  </p>
                  <button className="lp-btn" style={{ marginBottom: 0 }} onClick={closeGuest}>
                    <span>Got it</span>
                  </button>
                </div>
              ) : guestView === 'choice' ? (
                /* ── Choice state: Microsoft login + Request Access ── */
                <>
                  <div className="lp-guest-modal-head">
                    <div className="lp-guest-modal-badge"><User size={18} strokeWidth={2} /></div>
                    <h3 className="lp-guest-modal-title">Guest Access</h3>
                    <p className="lp-guest-modal-sub">
                      Already have your guest credentials? Sign in below.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="lp-btn"
                    style={{ marginBottom: 0 }}
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? <span className="lp-spinner" /> : <MicrosoftLogo />}
                    <span>{loading ? 'Redirecting to Microsoft…' : 'Sign in with Guest ID'}</span>
                    {!loading && <ArrowRight size={16} className="lp-btn-arrow" />}
                  </button>

                  <div className="lp-guest-divider" style={{ margin: '18px 0' }}>
                    <span>New here&nbsp;?</span>
                  </div>

                  <button
                    type="button"
                    className="lp-guest-btn"
                    onClick={() => { setGuestView('form'); setGuestStatus('idle'); setGuestError(null); }}
                  >
                    <User size={16} strokeWidth={2} className="lp-guest-icon" />
                    <span>Request Access</span>
                    <ArrowRight size={15} className="lp-btn-arrow" />
                  </button>
                </>
              ) : (
                /* ── Form state ── */
                <>
                  <div className="lp-guest-modal-head">
                    <button
                      type="button"
                      onClick={() => { setGuestView('choice'); setGuestStatus('idle'); setGuestError(null); }}
                      style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 4 }}
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <div className="lp-guest-modal-badge"><User size={18} strokeWidth={2} /></div>
                    <h3 className="lp-guest-modal-title">Request Access</h3>
                    <p className="lp-guest-modal-sub">
                      Tell us a little about you and we'll email your guest
                      credentials right away.
                    </p>
                  </div>

                  <form className="lp-guest-form" onSubmit={handleGuestSubmit}>
                    <label className="lp-field">
                      <span className="lp-field-label">Name</span>
                      <div className="lp-field-wrap">
                        <User size={16} className="lp-field-icon" />
                        <input
                          type="text" required placeholder="Jane Doe"
                          value={guestForm.name}
                          onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                          disabled={guestStatus === 'sending'}
                        />
                      </div>
                    </label>

                    <label className="lp-field">
                      <span className="lp-field-label">Work Email</span>
                      <div className="lp-field-wrap">
                        <Mail size={16} className="lp-field-icon" />
                        <input
                          type="email" required placeholder="jane@company.com"
                          value={guestForm.email}
                          onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                          disabled={guestStatus === 'sending'}
                        />
                      </div>
                    </label>

                    <label className="lp-field">
                      <span className="lp-field-label">Company Name</span>
                      <div className="lp-field-wrap">
                        <Building2 size={16} className="lp-field-icon" />
                        <input
                          type="text" required placeholder="Acme Corp"
                          value={guestForm.company}
                          onChange={(e) => setGuestForm({ ...guestForm, company: e.target.value })}
                          disabled={guestStatus === 'sending'}
                        />
                      </div>
                    </label>

                    <AnimatePresence>
                      {guestStatus === 'error' && guestError && (
                        <motion.div className="lp-error"
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          {guestError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      className={`lp-btn ${guestStatus === 'sending' ? 'lp-btn-loading' : ''}`}
                      style={{ marginBottom: 0, marginTop: 4 }}
                      disabled={guestStatus === 'sending'}
                    >
                      {guestStatus === 'sending' ? <span className="lp-spinner" /> : <Mail size={16} />}
                      <span>{guestStatus === 'sending' ? 'Submitting request…' : 'Request Access'}</span>
                      {guestStatus !== 'sending' && <ArrowRight size={16} className="lp-btn-arrow" />}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;




