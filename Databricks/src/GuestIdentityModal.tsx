import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { isWorkEmail } from './workEmail';

/* ── Databricks color tokens ── */
const DB = {
  navy: '#1B3139',
  navy900: '#0B2026',
  lava: '#EB1600',
  oat: '#F9F7F4',
  slate: '#5A6F77',
  line: '#DCE0E2',
  white: '#FFFFFF',
};

export interface GuestIdentity {
  name: string;
  email: string;
}

/**
 * Mandatory identity gate for guest logins.
 *
 * Every guest signs in through one shared Azure AD account, so activity logs
 * cannot tell one guest from another. This modal captures the name + email the
 * person used when they requested guest access. It has no close button, no
 * backdrop dismiss and no ESC handler — the only way out is to submit.
 */
export default function GuestIdentityModal({
  onSubmit,
}: {
  onSubmit: (identity: GuestIdentity) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Lock background scroll while the gate is up
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!isWorkEmail(trimmedEmail)) {
      setError('Please enter the work email you used when requesting guest access.');
      return;
    }
    setError(null);
    onSubmit({ name: trimmedName, email: trimmedEmail.toLowerCase() });
  };

  const fieldWrap: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: DB.oat, border: `1px solid ${DB.line}`,
    borderRadius: '10px', padding: '11px 14px',
  };
  const fieldInput: React.CSSProperties = {
    flex: 1, border: 'none', background: 'transparent', outline: 'none',
    fontSize: '14px', color: DB.navy, fontFamily: 'inherit',
  };
  const fieldLabel: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: DB.slate,
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px',
    display: 'block',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-identity-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(11,32,38,0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', overflowY: 'auto',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        style={{
          width: '100%', maxWidth: '440px',
          background: DB.white, borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 24px 60px -12px rgba(11,32,38,0.45)',
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${DB.navy900} 0%, ${DB.navy} 100%)`,
          padding: '26px 30px 24px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: '-40px', top: '-40px',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(235,22,0,0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '11px',
              background: 'rgba(235,22,0,0.14)', border: '1px solid rgba(235,22,0,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <ShieldCheck size={22} color={DB.lava} />
            </div>
            <p style={{
              margin: '0 0 5px 0', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: DB.lava,
            }}>
              Guest Access
            </p>
            <h2 id="guest-identity-title" style={{
              margin: 0, fontSize: '20px', fontWeight: 800,
              color: DB.white, letterSpacing: '-0.02em',
            }}>
              Before you continue
            </h2>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 30px 28px' }}>
          <p style={{ margin: '0 0 22px 0', fontSize: '14px', lineHeight: '22px', color: DB.slate }}>
            Please fill in the <strong style={{ color: DB.navy }}>name</strong> and{' '}
            <strong style={{ color: DB.navy }}>email</strong> you gave while raising the
            guest login request. This is required to continue.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="guest-identity-name" style={fieldLabel}>Name</label>
            <div style={fieldWrap}>
              <User size={16} color={DB.slate} style={{ flexShrink: 0 }} />
              <input
                id="guest-identity-name"
                type="text"
                required
                autoFocus
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                style={fieldInput}
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="guest-identity-email" style={fieldLabel}>Work Email</label>
            <div style={fieldWrap}>
              <Mail size={16} color={DB.slate} style={{ flexShrink: 0 }} />
              <input
                id="guest-identity-email"
                type="email"
                required
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                style={fieldInput}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(235,22,0,0.07)', border: '1px solid rgba(235,22,0,0.22)',
                borderRadius: '9px', padding: '10px 13px', marginBottom: '16px',
                fontSize: '13px', color: DB.lava, lineHeight: '18px',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            style={{
              width: '100%', padding: '13px 20px',
              background: DB.lava, color: DB.white, border: 'none', borderRadius: '10px',
              fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'inherit',
            }}
          >
            <span>Continue to Marketplace</span>
            <ArrowRight size={16} />
          </button>

          <p style={{
            margin: '16px 0 0 0', fontSize: '11.5px', lineHeight: '17px',
            color: DB.slate, textAlign: 'center',
          }}>
            We use this only to know who is exploring the marketplace.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

