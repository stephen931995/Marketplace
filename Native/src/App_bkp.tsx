import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle2, ChevronLeft,
  Globe, Database,
  ExternalLink,
  Code2, Server, Play, X, Menu, Send, LogOut, BookOpen,
} from 'lucide-react';
import { apps, AppDetail } from './data';
import LoginPage from './LoginPage';
import { msalInstance } from './auth/msalInstance';

/* ─────────────────────────────────────
   APP CARD — 3D tilt + shine
───────────────────────────────────── */
const AppCard = ({
  app,
  onClick,
  index = 0,
}: {
  app: AppDetail;
  onClick: (a: AppDetail) => void;
  index?: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 7;
    const rotX = -((y - cy) / cy) * 7;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.025)`;
    const shine = el.querySelector('.card-shine') as HTMLElement;
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.18) 0%, transparent 65%)`;
      shine.style.opacity = '1';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    const shine = el.querySelector('.card-shine') as HTMLElement;
    if (shine) shine.style.opacity = '0';
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove as EventListener);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove as EventListener);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const coverFallback = `https://picsum.photos/seed/${app.id}-cover/800/480`;
  const logoFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=4F46E5&color=fff&size=128&bold=true`;

  return (
    <motion.div
      ref={cardRef}
      className="app-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(app)}
    >
      <div className="card-shine" />
      {/* Cover image — category badge pinned top-right */}
      <div className="app-card-cover">
        <img
          src={app.coverImage}
          alt={app.name}
          onError={(e) => { (e.target as HTMLImageElement).src = coverFallback; }}
        />
        <div className="app-card-cover-overlay" />
        <span className="app-card-category">{app.category}</span>
      </div>

      {/* Body — logo + name in same row, then desc, tags, footer */}
      <div className="app-card-body">
        <div className="app-card-header">
          <img
            src={app.logo}
            alt={app.name + ' logo'}
            className="app-card-logo"
            onError={(e) => { (e.target as HTMLImageElement).src = logoFallback; }}
          />
          <h3 className="app-card-name">{app.name}</h3>
        </div>
        <p className="app-card-desc">{app.shortDescription}</p>
        <div className="app-card-tags">
          {app.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────
   NAVBAR
───────────────────────────────────── */
const Navbar = ({
  page,
  onNav,
  onLogout,
  azureUser,
}: {
  page: string;
  onNav: (p: string) => void;
  onLogout: () => void;
  azureUser?: { name: string; email: string };
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = azureUser
    ? azureUser.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <button className="nav-brand" onClick={() => onNav('marketplace')}>
          <img src="/Systech_Logo1.png" alt="Systech Logo" style={{ height: 52, width: 'auto' }} />
        </button>
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <button
            className={`nav-link ${page === 'marketplace' ? 'nav-link-active' : ''}`}
            onClick={() => { onNav('marketplace'); setMenuOpen(false); }}
          >
            Marketplace
          </button>
          <a href="https://www.systechusa.com/solutions" target="_blank" rel="noopener noreferrer" className="nav-link">Solutions</a>
          <a href="https://teams.microsoft.com/l/channel/19%3A2EQ3dOIk3cG2cHmHgH7duGWFHFPmDgjF4gF2svGwFjs1%40thread.tacv2/Systech%20Marketplace?groupId=385632f1-f355-486c-a220-e939becc47ec&tenantId=17dcec91-66ec-4c4b-a988-473694df546c" target="_blank" rel="noopener noreferrer" className="nav-link">Contact</a>
        </div>
        <div className="nav-right">
          {azureUser && (
            <div className="nav-user-wrap" ref={userMenuRef}>
              <button
                className="nav-user-btn"
                onClick={() => setUserMenuOpen((o) => !o)}
                title={azureUser.name}
              >
                <span className="nav-user-avatar">{initials}</span>
                <span className="nav-user-name">{azureUser.name.split(' ')[0]}</span>
                <LogOut size={13} className="nav-user-chevron" />
              </button>
              {userMenuOpen && (
                <div className="nav-user-menu">
                  <div className="nav-user-menu-header">
                    <div className="nav-user-menu-avatar">{initials}</div>
                    <div>
                      <p className="nav-user-menu-name">{azureUser.name}</p>
                      <p className="nav-user-menu-email">{azureUser.email}</p>
                    </div>
                  </div>
                  <div className="nav-user-menu-divider" />
                  <button
                    className="nav-logout-btn"
                    onClick={() => { setUserMenuOpen(false); onLogout(); }}
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────
   FOOTER
───────────────────────────────────── */
const Footer = ({ onNav }: { onNav: (p: string) => void }) => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <img src="/Systech_Logo1.png" alt="Systech Logo" style={{ height: 35, width: '35px' }} />
        <span className="footer-brand-name">Systech Solutions</span>
        <p className="footer-tagline">30+ years of data mastery.<br />Powering enterprise intelligence worldwide.</p>
      </div>
      <div className="footer-links-grid">
        <div>
          <p className="footer-col-title">Company</p>
          <a href="https://www.systechusa.com/about" target="_blank" rel="noopener noreferrer">About Us</a>
          <a href="https://www.systechusa.com/careers" target="_blank" rel="noopener noreferrer">Careers</a>
          <a href="https://www.systechusa.com/news" target="_blank" rel="noopener noreferrer">News</a>
        </div>
        <div>
          <p className="footer-col-title">Platform</p>
          <button onClick={() => onNav('marketplace')}>Marketplace</button>
          <a href="https://www.systechusa.com/solutions" target="_blank" rel="noopener noreferrer">Solutions</a>
          <a href="https://www.systechusa.com/case-studies" target="_blank" rel="noopener noreferrer">Case Studies</a>
        </div>
        <div>
          <p className="footer-col-title">Connect</p>
          <a href="mailto:info@systechusa.com">info@systechusa.com</a>
          <a href="https://www.systechusa.com/contact-us" target="_blank" rel="noopener noreferrer">Contact Us</a>
          <a href="https://www.linkedin.com/company/systech-solutions" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2025 Systech Solutions Inc. All rights reserved.</span>
      <span className="footer-powered">Glendale, CA · Singapore · Chennai · Dubai</span>
    </div>
  </footer>
);

/* ─────────────────────────────────────
   MARKETPLACE
───────────────────────────────────── */
const TECH_CATS = ['Data Engineering', 'Security', 'Design', 'Reporting', 'Tech'];

const ALL_CATEGORIES = ['All', ...Array.from(new Set(
  apps.map((a) => TECH_CATS.includes(a.category) ? 'Tech' : a.category)
)).sort()];

const Marketplace = ({ onAppClick, restoreScrollY }: { onAppClick: (a: AppDetail) => void; restoreScrollY?: number }) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');

  React.useEffect(() => {
    if (restoreScrollY && restoreScrollY > 0) {
      window.scrollTo({ top: restoreScrollY, behavior: 'instant' });
    }
  }, []);

  const filtered = apps.filter((a) => {
    const matchCat =
      cat === 'All' ||
      (cat === 'Tech' ? TECH_CATS.includes(a.category) : a.category === cat);
    const q = query.toLowerCase();
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.shortDescription.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  return (
    <section className="marketplace-page">
      <div className="mp-hero">
        <div className="mp-hero-orb mp-hero-orb-1" />
        <div className="mp-hero-orb mp-hero-orb-2" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="sec-eyebrow-light" style={{ textAlign: 'center' }}>Systech Analytics</p>
          <h1 className="mp-title">Application Marketplace</h1>
          <p className="mp-sub">17 enterprise-grade AI applications across 10+ industries</p>
          <div className="mp-stats-row">
            {[
              { val: '17', label: 'Total Apps' },
              { val: '10+', label: 'Categories' },
              { val: '100%', label: 'AI-Powered' },
            ].map((s) => (
              <div key={s.label} className="mp-stat">
                <span className="mp-stat-val">{s.val}</span>
                <span className="mp-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mp-controls">
        <div className="mp-search-wrap">
          <Search size={17} className="mp-search-icon" />
          <input
            type="text"
            placeholder="Search applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mp-search"
          />
          {query && (
            <button className="mp-search-clear" onClick={() => setQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className="mp-cats">
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              className={`mp-cat-btn ${cat === c ? 'mp-cat-active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mp-grid">
        <AnimatePresence>
          {filtered.map((app, i) => (
            <AppCard key={app.id} app={app} onClick={onAppClick} index={i} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="mp-empty">
            <Search size={36} color="var(--muted)" />
            <p>No applications match your search.</p>
            <button className="btn-outline" onClick={() => { setQuery(''); setCat('All'); }}>Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────
   APP DETAILS
───────────────────────────────────── */
type Tab = 'Overview' | 'Usage' | 'Reviews';

interface ReviewEntry {
  id?: number;
  user_name: string;
  user_email: string;
  review_text: string;
  created_at?: string;
}

interface AzureUser {
  name: string;
  email: string;
}

const AppDetails = ({
  app,
  onBack,
  azureUser,
}: {
  app: AppDetail;
  onBack: () => void;
  azureUser: AzureUser;
}) => {
  const appTabs: Tab[] = ['Overview', 'Usage', 'Reviews'];
  const [tab, setTab] = useState<Tab>('Overview');
  const [videoOpen, setVideoOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch reviews from API when Reviews tab is opened
  useEffect(() => {
    if (tab !== 'Reviews') return;
    setReviewsLoading(true);
    fetch(`/api/reviews/${app.id}`)
      .then((r) => r.json())
      .then((data) => { setReviews(Array.isArray(data) ? data : []); })
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [tab, app.id]);

  const coverFallback = `https://picsum.photos/seed/${app.id}-detail/1400/600`;
  const logoFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=4F46E5&color=fff&size=256&bold=true`;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmitError(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          userName: azureUser.name,
          userEmail: azureUser.email,
          reviewText: reviewText.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      const saved: ReviewEntry = await res.json();
      setReviews((prev) => [saved, ...prev]);
      setReviewText('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setSubmitError('Could not save your review. Please try again.');
    }
  };

  return (
    <div className="detail-page">
      {/* BANNER */}
      <div className="detail-banner">
        <img
          src={app.coverImage}
          alt={app.name}
          className="detail-banner-img"
          onError={(e) => { (e.target as HTMLImageElement).src = coverFallback; }}
        />
        <div className="detail-banner-overlay" />
        <div className="detail-banner-content">
          <button className="detail-back-btn" onClick={onBack}>
            <ChevronLeft size={16} /> Marketplace
          </button>
          <div className="detail-banner-info">
            <img
              src={app.logo}
              alt={app.name}
              className="detail-banner-logo"
              onError={(e) => { (e.target as HTMLImageElement).src = logoFallback; }}
            />
            <div>
              <div className="detail-banner-cat">{app.category}</div>
              <h1 className="detail-banner-name">{app.name}</h1>
              <p className="detail-banner-sub">{app.shortDescription}</p>
              <div className="detail-banner-tags">
                {app.tags.map((t) => (
                  <span key={t} className="tag tag-light">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="detail-body">
        <div className="detail-main">
          {/* TABS */}
          <div className="detail-tabs">
            {appTabs.map((t) => (
              <button
                key={t}
                className={`tab-btn ${tab === t ? 'tab-btn-active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
                {tab === t && (
                  <motion.div className="tab-underline" layoutId="tab-underline" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="tab-content"
            >
              {/* ── OVERVIEW ── */}
              {tab === 'Overview' && (
                <div className="tab-overview">
                  <div className="tab-section">
                    <h3 className="tab-sec-title">About this Application</h3>
                    <p className="tab-body-text">{app.overview}</p>
                  </div>
                  <div className="tab-section">
                    <h3 className="tab-sec-title">Key Capabilities</h3>
                    <ul className="feature-list">
                      {app.features.map((f) => (
                        <li key={f} className="feature-item">
                          <CheckCircle2 size={16} color="#2563eb" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="tab-section">
                    <h3 className="tab-sec-title">Business Value</h3>
                    <div className="business-value-card">{app.businessImpact}</div>
                  </div>
                </div>
              )}

              {/* ── USAGE ── */}
              {tab === 'Usage' && (
                <div className="usage-layout">
                  <div className="tab-section">
                    <h3 className="tab-sec-title">System Requirements</h3>
                    <div className="req-grid">
                      {[
                        { icon: <Server size={18} />, label: 'Cloud Platform', val: 'Azure / AWS / GCP' },
                        { icon: <Code2 size={18} />, label: 'API Version', val: 'REST v2, GraphQL' },
                        { icon: <Database size={18} />, label: 'Data Platform', val: 'Fabric / Snowflake / Databricks' },
                        { icon: <Globe size={18} />, label: 'Browser Support', val: 'Chrome, Edge, Firefox, Safari' },
                      ].map((r) => (
                        <div key={r.label} className="req-card">
                          <span className="req-icon">{r.icon}</span>
                          <div>
                            <p className="req-label">{r.label}</p>
                            <p className="req-val">{r.val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-section">
                    <h3 className="tab-sec-title">Integration Guide</h3>
                    <div className="steps-list">
                      {[
                        { n: '01', title: 'Connect', desc: 'Authenticate via OAuth 2.0 or API key with your data platform.' },
                        { n: '02', title: 'Configure', desc: 'Map your data schemas and set up transformation pipelines.' },
                        { n: '03', title: 'Deploy', desc: 'One-click deploy to cloud or choose on-premise installation.' },
                        { n: '04', title: 'Monitor', desc: 'Track performance, usage, and alerts via the unified dashboard.' },
                      ].map((s) => (
                        <div key={s.n} className="step-item">
                          <span className="step-num">{s.n}</span>
                          <div>
                            <p className="step-title">{s.title}</p>
                            <p className="step-desc">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-section">
                    <h3 className="tab-sec-title">Deployment Options</h3>
                    <div className="deploy-badges">
                      {['Cloud-Native', 'On-Premise', 'Hybrid', 'Containerised (Docker/K8s)'].map((d) => (
                        <span key={d} className="deploy-badge">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── REVIEWS ── */}
              {tab === 'Reviews' && (
                <div className="reviews-layout">
                  {/* Submit a review */}
                  <div className="tab-section">
                    <h3 className="tab-sec-title">Share Your Experience</h3>
                    {/* Azure AD user identity badge */}
                    <div className="review-user-badge">
                      <div className="review-user-avatar">{azureUser.name[0].toUpperCase()}</div>
                      <div className="review-user-info">
                        <span className="review-user-name">{azureUser.name}</span>
                        <span className="review-user-email">{azureUser.email}</span>
                      </div>
                    </div>
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                      <textarea
                        className="review-textarea"
                        placeholder="Write your feedback about this application..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        maxLength={500}
                        required
                      />
                      <div className="review-form-footer">
                        {submitted && (
                          <span className="review-success">
                            <CheckCircle2 size={15} color="#10b981" /> Review submitted — thank you!
                          </span>
                        )}
                        {submitError && (
                          <span className="review-error">{submitError}</span>
                        )}
                        <button type="submit" className="btn-primary review-submit-btn">
                          <Send size={14} /> Submit Review
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Review list */}
                  <div className="tab-section">
                    <h3 className="tab-sec-title">Community Reviews</h3>
                    {reviewsLoading ? (
                      <div className="reviews-loading">Loading reviews…</div>
                    ) : reviews.length === 0 ? (
                      <div className="reviews-empty">No reviews yet. Be the first to share your experience!</div>
                    ) : (
                      <div className="review-cards">
                        {reviews.map((r) => (
                          <div key={r.id ?? r.user_email + r.created_at} className="review-card">
                            <div className="review-card-header">
                              <div className="review-avatar">{r.user_name[0].toUpperCase()}</div>
                              <div>
                                <p className="review-name">{r.user_name}</p>
                                <p className="review-email">{r.user_email}</p>
                              </div>
                            </div>
                            <p className="review-text">{r.review_text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SIDEBAR */}
        <div className="detail-sidebar">
          <div className="sidebar-card">
            <div className="detail-try-wrap">
              <a
                href="https://teams.microsoft.com/l/channel/19%3A2EQ3dOIk3cG2cHmHgH7duGWFHFPmDgjF4gF2svGwFjs1%40thread.tacv2/Systech%20Marketplace?groupId=385632f1-f355-486c-a220-e939becc47ec&tenantId=17dcec91-66ec-4c4b-a988-473694df546c"
                target="_blank"
                rel="noopener noreferrer"
                className="detail-try-btn"
              >
                <ExternalLink size={16} />
                Request Demo
              </a>
            </div>
            <div className="sidebar-divider" />
            <div className="sidebar-meta">
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-label">Publisher</span>
                <span className="sidebar-meta-val">Systech Solutions</span>
              </div>
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-label">Category</span>
                <span className="sidebar-meta-val">{app.category}</span>
              </div>
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-label">Version</span>
                <span className="sidebar-meta-val">v1.0.0</span>
              </div>
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-label">Updated</span>
                <span className="sidebar-meta-val">Mar 2026</span>
              </div>
              <div className="sidebar-meta-row">
                <span className="sidebar-meta-label">License</span>
                <span className="sidebar-meta-val">Enterprise</span>
              </div>
            </div>
            {app.note && (
              <>
                <div className="sidebar-divider" />
                <div className="sidebar-note">
                  <span className="sidebar-note-icon">ℹ️</span>
                  <span>{app.note}</span>
                </div>
              </>
            )}
          </div>

          {/* Watch Video button — only shown when a demo video exists */}
          {app.demoVideo && (
            <motion.button
              className="watch-video-btn"
              onClick={() => setVideoOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="watch-video-play">
                <Play size={16} strokeWidth={2.5} fill="currentColor" />
              </span>
              Watch Demo Video
            </motion.button>
          )}

          {/* Contact Our Team — opens Microsoft Teams channel */}
          <motion.a
            href="https://teams.microsoft.com/l/channel/19%3A2EQ3dOIk3cG2cHmHgH7duGWFHFPmDgjF4gF2svGwFjs1%40thread.tacv2/Systech%20Marketplace?groupId=385632f1-f355-486c-a220-e939becc47ec&tenantId=17dcec91-66ec-4c4b-a988-473694df546c"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-team-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="contact-team-icon">
              {/* Microsoft Teams icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="#7B83EB"/>
                <path d="M19.5 9h-5a.5.5 0 00-.5.5V15a4 4 0 004 4h.5a4 4 0 004-4v-5.5a.5.5 0 00-.5-.5H19.5z" fill="#5059C9"/>
                <circle cx="8" cy="5.5" r="3.5" fill="#7B83EB"/>
                <path d="M13 10H3a1 1 0 00-1 1v6a5 5 0 005 5 5 5 0 005-5v-6a1 1 0 00-1-1z" fill="#7B83EB"/>
              </svg>
            </span>
            <span className="contact-team-text">
              <span className="contact-team-label">Contact Support</span>
              <span className="contact-team-sub">Open in Microsoft Teams</span>
            </span>
          </motion.a>

          {/* User Manual button — opens SharePoint PDF in popup */}
          {app.manualUrl && (
            <motion.button
              className="user-manual-btn"
              onClick={() => setManualOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="user-manual-icon">
                <BookOpen size={18} strokeWidth={2} />
              </span>
              <span className="user-manual-text">
                <span className="user-manual-label">User Manual</span>
                <span className="user-manual-sub">PDF Guide</span>
              </span>
            </motion.button>
          )}
        </div>
      </div>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="video-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              className="video-modal"
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="video-modal-header">
                <div className="video-modal-title">
                  <span className="video-modal-dot" />
                  {app.name} — Demo
                </div>
                <button className="video-modal-close" onClick={() => setVideoOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="video-modal-body">
                <iframe
                  src={app.demoVideo}
                  title={`${app.name} Demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-modal-iframe"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* USER MANUAL MODAL */}
      <AnimatePresence>
        {manualOpen && app.manualUrl && (
          <motion.div
            className="manual-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setManualOpen(false)}
          >
            <motion.div
              className="manual-modal"
              initial={{ opacity: 0, scale: 0.93, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 28 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="manual-modal-header">
                <div className="manual-modal-title-wrap">
                  <span className="manual-modal-icon-wrap">
                    <BookOpen size={16} strokeWidth={2} />
                  </span>
                  <div>
                    <div className="manual-modal-title">{app.name} — User Manual</div>
                    <div className="manual-modal-sub">PDF Documentation</div>
                  </div>
                </div>
                <div className="manual-modal-actions">
                  {app.sampleDocsUrl && (
                    <a
                      href={app.sampleDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="manual-open-btn"
                      title="Sample Documents"
                    >
                      <ExternalLink size={15} strokeWidth={2} />
                      Sample Documents
                    </a>
                  )}
                  <button className="manual-modal-close" onClick={() => setManualOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* PDF iframe */}
              <div className="manual-modal-body">
                <iframe
                  src={app.manualUrl.includes('?') ? `${app.manualUrl}&web=1` : `${app.manualUrl}?web=1`}
                  title={`${app.name} User Manual`}
                  className="manual-modal-iframe"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────
   APP ROOT
───────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState<'marketplace' | 'detail'>('marketplace');
  const [selectedApp, setSelectedApp] = useState<AppDetail | null>(null);
  const savedScrollY = React.useRef<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    msalInstance.getAllAccounts().length > 0,
  );

  // Extract Azure AD user name + email from the active MSAL account
  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];
  const azureUser = {
    name: account?.name ?? account?.username ?? 'Unknown User',
    email: account?.username ?? '',
  };

  const navigate = (p: string) => {
    setPage(p as 'marketplace' | 'detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openApp = (app: AppDetail) => {
    savedScrollY.current = window.scrollY;
    setSelectedApp(app);
    setPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToMarket = () => {
    setPage('marketplace');
  };

  const handleLogout = () => {
    msalInstance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  };

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LoginPage onAuthenticated={() => setIsAuthenticated(true)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <>
      <Navbar page={page} onNav={navigate} onLogout={handleLogout} azureUser={azureUser} />
      <AnimatePresence mode="wait">
        {page === 'marketplace' && (
          <motion.div key="marketplace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Marketplace onAppClick={openApp} restoreScrollY={savedScrollY.current} />
          </motion.div>
        )}
        {page === 'detail' && selectedApp && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <AppDetails app={selectedApp} onBack={backToMarket} azureUser={azureUser} />
          </motion.div>
        )}
      </AnimatePresence>
      {page !== 'detail' && <Footer onNav={navigate} />}
    </>
  );
}

