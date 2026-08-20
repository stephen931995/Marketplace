import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, UserPlus, Users, Building2,
    Calendar, Mail, Search, X, RefreshCw,
} from 'lucide-react';

/* ── Databricks color tokens ── */
const DB = {
    navy:    '#1B3139',
    navy900: '#0B2026',
    lava:    '#EB1600',
    lava700: '#C41200',
    lavaLt:  'rgba(235,22,0,0.10)',
    oat:     '#F9F7F4',
    slate:   '#5A6F77',
    line:    '#DCE0E2',
    white:   '#FFFFFF',
    teal:    '#00A972',
    orange:  '#FF8C42',
    blue:    '#2272B4',
};

interface GuestRequest {
    id: number;
    name: string;
    work_email: string;
    company_name: string;
    created_at: string;
}

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

/* ─────────────────────────────────────
   STAT CARD
───────────────────────────────────── */
const StatCard = ({
    icon, label, value, sub, color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
    color: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
            background: DB.white, border: `1px solid ${DB.line}`,
            borderRadius: '12px', padding: '20px 22px',
            boxShadow: '0 1px 4px rgba(27,49,57,0.07)',
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            borderTop: `3px solid ${color}`,
        }}
    >
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {React.cloneElement(icon as React.ReactElement, { size: 20, color })}
        </div>
        <div>
            <div style={{ fontSize: '12px', color: DB.slate, marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: DB.navy, lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: '11px', color: DB.slate, marginTop: '4px' }}>{sub}</div>}
        </div>
    </motion.div>
);

/* ─────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────── */
export default function GuestRequestsDashboard({ onBack }: { onBack: () => void }) {
    const [requests, setRequests] = useState<GuestRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchRequests = (from?: string, to?: string) => {
        setLoading(true);
        const params = new URLSearchParams();
        if (from) params.set('fromDate', from);
        if (to)   params.set('toDate', to);
        const qs = params.toString();
        fetch(`/api/guest-requests${qs ? `?${qs}` : ''}`)
            .then((r) => r.json())
            .then((data) => setRequests(Array.isArray(data) ? data : []))
            .catch(() => setRequests([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchRequests(); }, []);
    useEffect(() => { setCurrentPage(1); }, [search]);

    const handleApply = () => { setCurrentPage(1); fetchRequests(fromDate, toDate); };
    const handleReset = () => {
        setFromDate(''); setToDate(''); setSearch(''); setCurrentPage(1); fetchRequests();
    };

    /* Client-side search across name / email / company */
    const filtered = search.trim()
        ? requests.filter((r) => {
            const s = search.toLowerCase();
            return (
                r.name?.toLowerCase().includes(s) ||
                r.work_email?.toLowerCase().includes(s) ||
                r.company_name?.toLowerCase().includes(s)
            );
        })
        : requests;

    const totalRequests   = filtered.length;
    const uniqueCompanies = new Set(filtered.map((r) => (r.company_name || '').toLowerCase())).size;
    const todayStr        = new Date().toISOString().split('T')[0];
    const todayRequests   = filtered.filter((r) => r.created_at.startsWith(todayStr)).length;

    const totalPages     = Math.ceil(totalRequests / pageSize) || 1;
    const paginated      = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ minHeight: '100vh', background: DB.oat, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

            {/* ── Hero Banner ── */}
            <div style={{
                background: `linear-gradient(135deg, ${DB.navy900} 0%, ${DB.navy} 60%, #143D4A 100%)`,
                paddingTop: '100px', paddingBottom: '40px',
                paddingLeft: '40px', paddingRight: '40px',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(235,22,0,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
                    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '999px', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', marginBottom: '28px', fontSize: '13px', fontWeight: 500, padding: '6px 14px 6px 10px' }}>
                        <ChevronLeft size={16} /> Back to Marketplace
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(235,22,0,0.12)', border: '1px solid rgba(235,22,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserPlus size={28} color={DB.lava} />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: DB.lava }}>Admin · Guest Access</p>
                            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.03em' }}>Guest Requests</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 40px 60px' }}>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                    <StatCard icon={<UserPlus />}  label="Total Requests"    value={totalRequests}   color={DB.lava}   />
                    <StatCard icon={<Building2 />} label="Unique Companies"  value={uniqueCompanies} color={DB.navy}   />
                    <StatCard icon={<Calendar />}  label="Today's Requests"  value={todayRequests}   color={DB.teal}   sub={formatDate(todayStr)} />
                </div>

                {/* Filters */}
                <div style={{ background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(27,49,57,0.07)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '220px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Search</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: DB.slate }} />
                            <input
                                placeholder="Name, email or company…"
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                style={{ width: '100%', padding: '9px 12px 9px 34px', background: DB.oat, border: `1px solid ${DB.line}`, borderRadius: '8px', fontSize: '13px', color: DB.navy, outline: 'none', boxSizing: 'border-box' }}
                            />
                            {search && (
                                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: DB.slate, display: 'flex' }}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>From Date</label>
                        <input type="date" value={fromDate} max={toDate || undefined} onChange={(e) => setFromDate(e.target.value)}
                            style={{ padding: '9px 12px', background: DB.oat, border: `1px solid ${DB.line}`, borderRadius: '8px', fontSize: '13px', color: DB.navy, outline: 'none', cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>To Date</label>
                        <input type="date" value={toDate} min={fromDate || undefined} onChange={(e) => setToDate(e.target.value)}
                            style={{ padding: '9px 12px', background: DB.oat, border: `1px solid ${DB.line}`, borderRadius: '8px', fontSize: '13px', color: DB.navy, outline: 'none', cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                        <button onClick={handleApply}
                            style={{ padding: '9px 22px', background: DB.lava, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                            Apply
                        </button>
                        <button onClick={handleReset}
                            style={{ padding: '9px 14px', background: DB.white, color: DB.slate, border: `1px solid ${DB.line}`, borderRadius: '8px', fontWeight: 500, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <RefreshCw size={14} /> Reset
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: DB.slate, fontSize: '14px' }}>
                        Fetching guest requests…
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '60px', background: DB.white, borderRadius: '12px', textAlign: 'center', border: `1px solid ${DB.line}` }}>
                        <UserPlus size={40} color={DB.line} style={{ marginBottom: '16px' }} />
                        <h3 style={{ margin: '0 0 8px 0', color: DB.navy, fontSize: '18px' }}>No guest requests found</h3>
                        <p style={{ margin: 0, color: DB.slate, fontSize: '14px' }}>Try adjusting the date range or search term.</p>
                    </div>
                ) : (
                    <div style={{ background: DB.white, borderRadius: '12px', border: `1px solid ${DB.line}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(27,49,57,0.07)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '720px' }}>
                                <thead style={{ background: DB.oat, fontSize: '11px', color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${DB.line}` }}>
                                    <tr>
                                        <th style={{ padding: '14px 24px', fontWeight: 700, width: '48px' }}>#</th>
                                        <th style={{ padding: '14px 24px', fontWeight: 700 }}>Name</th>
                                        <th style={{ padding: '14px 24px', fontWeight: 700 }}>Work Email</th>
                                        <th style={{ padding: '14px 24px', fontWeight: 700 }}>Company</th>
                                        <th style={{ padding: '14px 24px', fontWeight: 700 }}>Requested At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map((r, i) => (
                                        <tr
                                            key={r.id}
                                            style={{ borderBottom: i === paginated.length - 1 ? 'none' : `1px solid ${DB.oat}`, transition: 'background 0.15s', background: DB.white }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = DB.oat)}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = DB.white)}
                                        >
                                            <td style={{ padding: '14px 24px', color: DB.slate, fontSize: '13px', fontWeight: 500 }}>
                                                {(currentPage - 1) * pageSize + i + 1}
                                            </td>
                                            <td style={{ padding: '14px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: DB.lavaLt, color: DB.lava, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                                                        {(r.name || r.work_email).charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: DB.navy, fontSize: '14px' }}>{r.name || '—'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 24px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: DB.slate, fontSize: '13px' }}>
                                                    <Mail size={12} /> {r.work_email}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 24px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: 'rgba(34,114,180,0.10)', color: DB.blue }}>
                                                    <Building2 size={11} /> {r.company_name}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 24px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, background: DB.oat, color: DB.slate }}>
                                                    <Calendar size={11} />
                                                    {formatDateTime(r.created_at)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: '14px 24px', background: DB.oat, borderTop: `1px solid ${DB.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: DB.slate }}>
                                Showing{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{(currentPage - 1) * pageSize + 1}</span>
                                {' '}to{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{Math.min(currentPage * pageSize, totalRequests)}</span>
                                {' '}of{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{totalRequests}</span> requests
                            </span>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                                    style={{ padding: '6px 8px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? DB.line : DB.navy, display: 'flex', alignItems: 'center' }}>
                                    <ChevronLeft size={16} />
                                </button>
                                <div style={{ padding: '4px 14px', fontSize: '13px', fontWeight: 600, color: DB.navy, background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '6px' }}>
                                    {currentPage} / {totalPages}
                                </div>
                                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                                    style={{ padding: '6px 8px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? DB.line : DB.navy, display: 'flex', alignItems: 'center' }}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

