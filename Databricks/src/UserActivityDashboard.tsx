import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, ChevronDown, Activity,
    Users, Calendar, TrendingUp, Search, X, RefreshCw, Clock
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

interface ActivityLog {
    id: number;
    user_id: string;
    name: string;
    email: string;
    opened_at: string;
    active_seconds: number;
    /* Guests share one Azure AD login — these carry the real person's details */
    is_guest?: boolean;
    guest_name?: string | null;
    guest_email?: string | null;
}

/** Who this session really belongs to — the guest, when it is a guest session */
const identityLabel = (l: ActivityLog) =>
    (l.is_guest && l.guest_name) ? `${l.guest_name} (Guest)` : (l.name || l.email);

/** Stable key for counting unique people, guests included */
const identityKey = (l: ActivityLog) =>
    (l.is_guest && l.guest_email) ? l.guest_email : l.user_id;

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    return {
        from: monday.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0],
    };
};

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

const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    if (s === 0) return `${m} min`;
    return `${m} min ${s}s`;
};

/* ─────────────────────────────────────
   MULTISELECT
───────────────────────────────────── */
const MultiSelect = ({
    options, selected, onChange, placeholder,
}: {
    options: string[];
    selected: string[];
    onChange: (s: string[]) => void;
    placeholder: string;
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));
    const toggle = (opt: string) => {
        if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
        else onChange([...selected, opt]);
    };

    return (
        <div ref={ref} style={{ position: 'relative', minWidth: '240px' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{ width: '100%', padding: '9px 12px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '8px', color: DB.navy, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selected.length > 0 ? `${selected.length} ${placeholder} selected` : `Filter by ${placeholder}...`}
                </span>
                <ChevronDown size={14} color={DB.slate} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                        style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '8px', zIndex: 50, boxShadow: '0 10px 25px -5px rgba(27,49,57,0.12)', maxHeight: '280px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ padding: '8px', borderBottom: `1px solid ${DB.line}` }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: DB.slate }} />
                                <input
                                    autoFocus placeholder={`Search ${placeholder.toLowerCase()}...`}
                                    value={search} onChange={(e) => setSearch(e.target.value)}
                                    style={{ width: '100%', background: DB.oat, border: `1px solid ${DB.line}`, borderRadius: '4px', padding: '7px 8px 7px 30px', color: DB.navy, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
                            {filtered.length === 0 ? (
                                <div style={{ padding: '12px', color: DB.slate, fontSize: '13px', textAlign: 'center' }}>No matches found</div>
                            ) : (
                                filtered.map((opt) => (
                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', cursor: 'pointer', fontSize: '13px', color: DB.navy, borderRadius: '4px' }}>
                                        <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} style={{ width: '14px', height: '14px', accentColor: DB.lava }} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
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
export default function UserActivityDashboard({ onBack }: { onBack: () => void }) {
    const { from: defaultFrom, to: defaultTo } = getCurrentWeekRange();

    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState(defaultFrom);
    const [toDate, setToDate] = useState(defaultTo);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchLogs = (from: string, to: string) => {
        setLoading(true);
        const params = new URLSearchParams({ fromDate: from, toDate: to });
        fetch(`/api/users/activity?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => setLogs(Array.isArray(data) ? data : []))
            .catch(() => setLogs([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchLogs(defaultFrom, defaultTo); }, []);
    useEffect(() => { setCurrentPage(1); }, [selectedUsers]);

    const handleApply = () => { setSelectedUsers([]); setCurrentPage(1); fetchLogs(fromDate, toDate); };
    const handleReset = () => {
        const { from, to } = getCurrentWeekRange();
        setFromDate(from); setToDate(to); setSelectedUsers([]); setCurrentPage(1); fetchLogs(from, to);
    };

    const uniqueUserOptions = (Array.from(new Set(logs.map(identityLabel))) as string[]).sort();
    const filteredLogs = selectedUsers.length > 0 ? logs.filter((l) => selectedUsers.includes(identityLabel(l))) : logs;

    const totalSessions    = filteredLogs.length;
    const uniqueUsersCount = new Set(filteredLogs.map(identityKey)).size;
    const todayStr         = new Date().toISOString().split('T')[0];
    const todaySessions    = filteredLogs.filter((l) => l.opened_at.startsWith(todayStr)).length;

    const userCountMap: Record<string, { name: string; count: number }> = {};
    filteredLogs.forEach((l) => {
        const key = identityKey(l);
        if (!userCountMap[key]) userCountMap[key] = { name: identityLabel(l), count: 0 };
        userCountMap[key].count++;
    });
    const mostActive = Object.values(userCountMap).sort((a, b) => b.count - a.count)[0];

    const sessionsWithTime = filteredLogs.filter((l) => l.active_seconds > 0);
    const avgSeconds = sessionsWithTime.length > 0
        ? Math.floor(sessionsWithTime.reduce((sum, l) => sum + l.active_seconds, 0) / sessionsWithTime.length)
        : 0;

    const totalPages    = Math.ceil(totalSessions / pageSize) || 1;
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1520px', margin: '0 auto' }}>
                    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '999px', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', marginBottom: '28px', fontSize: '13px', fontWeight: 500, padding: '6px 14px 6px 10px' }}>
                        <ChevronLeft size={16} /> Back to Marketplace
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(235,22,0,0.12)', border: '1px solid rgba(235,22,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={28} color={DB.lava} />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: DB.lava }}>Admin · Analytics</p>
                            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.03em' }}>User Activity</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '32px 40px 60px' }}>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
                    <StatCard icon={<Activity />}    label="Total Sessions"       value={totalSessions}    color={DB.lava}   />
                    <StatCard icon={<Users />}        label="Unique Users"         value={uniqueUsersCount} color={DB.navy}   />
                    <StatCard icon={<Calendar />}     label="Today's Sessions"     value={todaySessions}    color={DB.teal}   sub={formatDate(todayStr)} />
                    <StatCard icon={<TrendingUp />}   label="Most Active User"     value={mostActive ? mostActive.count : '—'} color={DB.orange} sub={mostActive ? mostActive.name : 'No data'} />
                    <StatCard icon={<Clock />}        label="Avg Session Duration" value={formatDuration(avgSeconds)} color={DB.blue} sub={sessionsWithTime.length > 0 ? `${sessionsWithTime.length} tracked sessions` : 'No tracked sessions yet'} />
                </div>

                {/* Filters */}
                <div style={{ background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(27,49,57,0.07)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Filter by User</label>
                        <MultiSelect options={uniqueUserOptions} selected={selectedUsers} onChange={setSelectedUsers} placeholder="Users" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>From Date</label>
                        <input type="date" value={fromDate} max={toDate} onChange={(e) => setFromDate(e.target.value)}
                            style={{ padding: '9px 12px', background: DB.oat, border: `1px solid ${DB.line}`, borderRadius: '8px', fontSize: '13px', color: DB.navy, outline: 'none', cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em' }}>To Date</label>
                        <input type="date" value={toDate} min={fromDate} onChange={(e) => setToDate(e.target.value)}
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
                        Fetching activity logs…
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div style={{ padding: '60px', background: DB.white, borderRadius: '12px', textAlign: 'center', border: `1px solid ${DB.line}` }}>
                        <Activity size={40} color={DB.line} style={{ marginBottom: '16px' }} />
                        <h3 style={{ margin: '0 0 8px 0', color: DB.navy, fontSize: '18px' }}>No activity found</h3>
                        <p style={{ margin: 0, color: DB.slate, fontSize: '14px' }}>Try adjusting the date range or user filter.</p>
                    </div>
                ) : (
                    <div style={{ background: DB.white, borderRadius: '12px', border: `1px solid ${DB.line}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(27,49,57,0.07)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1180px', tableLayout: 'fixed' }}>
                                <thead style={{ background: DB.oat, fontSize: '11px', color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${DB.line}` }}>
                                    <tr>
                                        <th style={{ padding: '14px 16px', fontWeight: 700, width: '52px' }}>#</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 700, width: '17%' }}>User</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 700, width: '19%' }}>Email</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 700, width: '14%' }}>Guest Name</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 700, width: '19%' }}>Guest Email</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 700, width: '17%' }}>Opened At</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 700, width: '14%' }}>Active Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLogs.map((log, i) => (
                                        <tr
                                            key={log.id}
                                            style={{ borderBottom: i === paginatedLogs.length - 1 ? 'none' : `1px solid ${DB.oat}`, transition: 'background 0.15s', background: DB.white }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = DB.oat)}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = DB.white)}
                                        >
                                            <td style={{ padding: '14px 16px', color: DB.slate, fontSize: '13px', fontWeight: 500 }}>
                                                {(currentPage - 1) * pageSize + i + 1}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: DB.lavaLt, color: DB.lava, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                                                        {(log.name || log.email).charAt(0).toUpperCase()}
                                                    </div>
                                                    <span title={log.name || undefined} style={{ fontWeight: 600, color: DB.navy, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{log.name || '—'}</span>
                                                    {log.is_guest && (
                                                        <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,140,66,0.14)', color: DB.orange, flexShrink: 0 }}>
                                                            Guest
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: DB.slate, fontSize: '13px', overflowWrap: 'anywhere' }}>{log.email}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: log.guest_name ? 600 : 400, color: log.guest_name ? DB.navy : DB.line, overflowWrap: 'anywhere' }}>
                                                {log.guest_name || '—'}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: log.guest_email ? DB.slate : DB.line, overflowWrap: 'anywhere' }}>
                                                {log.guest_email || '—'}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, background: DB.oat, color: DB.slate, whiteSpace: 'nowrap' }}>
                                                    <Calendar size={11} />
                                                    {formatDateTime(log.opened_at)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, background: log.active_seconds > 0 ? 'rgba(0,169,114,0.1)' : DB.oat, color: log.active_seconds > 0 ? DB.teal : DB.slate, whiteSpace: 'nowrap' }}>
                                                    <Clock size={11} />
                                                    {formatDuration(log.active_seconds)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: '14px 16px', background: DB.oat, borderTop: `1px solid ${DB.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: DB.slate }}>
                                Showing{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{(currentPage - 1) * pageSize + 1}</span>
                                {' '}to{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{Math.min(currentPage * pageSize, totalSessions)}</span>
                                {' '}of{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{totalSessions}</span> sessions
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

