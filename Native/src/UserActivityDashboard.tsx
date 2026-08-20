import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, ChevronDown, Activity,
    Users, Calendar, TrendingUp, Search, X, RefreshCw, Clock
} from 'lucide-react';

interface ActivityLog {
    id: number;
    user_id: string;
    name: string;
    email: string;
    opened_at: string;
    active_seconds: number;
}

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

// Format active_seconds into a readable duration string
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
                style={{
                    width: '100%', padding: '9px 12px',
                    background: '#fff', border: '1px solid #cbd5e1',
                    borderRadius: '8px', color: '#334155',
                    textAlign: 'left', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '13px', cursor: 'pointer',
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selected.length > 0 ? `${selected.length} ${placeholder} selected` : `Filter by ${placeholder}...`}
                </span>
                <ChevronDown size={14} color="#64748b" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            marginTop: '6px', background: '#fff',
                            border: '1px solid #e2e8f0', borderRadius: '8px',
                            zIndex: 50, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            maxHeight: '280px', display: 'flex', flexDirection: 'column',
                        }}
                    >
                        {/* Search inside dropdown */}
                        <div style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    autoFocus
                                    placeholder={`Search ${placeholder.toLowerCase()}...`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: '100%', background: '#f8fafc',
                                        border: '1px solid #e2e8f0', borderRadius: '4px',
                                        padding: '7px 8px 7px 30px',
                                        color: '#1e293b', fontSize: '13px', outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
                            {filtered.length === 0 ? (
                                <div style={{ padding: '12px', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
                                    No matches found
                                </div>
                            ) : (
                                filtered.map((opt) => (
                                    <label
                                        key={opt}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '8px 10px', cursor: 'pointer',
                                            fontSize: '13px', color: '#334155', borderRadius: '4px',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(opt)}
                                            onChange={() => toggle(opt)}
                                            style={{ width: '14px', height: '14px', accentColor: '#2563eb' }}
                                        />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {opt}
                                        </span>
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
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: '12px', padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'flex-start', gap: '16px',
        }}
    >
        <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: `${color}18`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
            {React.cloneElement(icon as React.ReactElement, { size: 22, color })}
        </div>
        <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{sub}</div>}
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

    // Date filters (trigger backend fetch on Apply)
    const [fromDate, setFromDate] = useState(defaultFrom);
    const [toDate, setToDate] = useState(defaultTo);

    // User multiselect (client-side filter)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    /* ── Fetch ── */
    const fetchLogs = (from: string, to: string) => {
        setLoading(true);
        const params = new URLSearchParams({ fromDate: from, toDate: to });
        fetch(`/api/users/activity?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => setLogs(Array.isArray(data) ? data : []))
            .catch(() => setLogs([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLogs(defaultFrom, defaultTo);
    }, []);

    // Reset page when user filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUsers]);

    const handleApply = () => {
        setSelectedUsers([]);
        setCurrentPage(1);
        fetchLogs(fromDate, toDate);
    };

    const handleReset = () => {
        const { from, to } = getCurrentWeekRange();
        setFromDate(from);
        setToDate(to);
        setSelectedUsers([]);
        setCurrentPage(1);
        fetchLogs(from, to);
    };

    /* ── Unique user options for multiselect (name || email) ── */
    const uniqueUserOptions = Array.from(
        new Set(logs.map((l) => l.name || l.email))
    ).sort();

    /* ── Client-side user filter ── */
    const filteredLogs = selectedUsers.length > 0
        ? logs.filter((l) => selectedUsers.includes(l.name || l.email))
        : logs;

    /* ── Stats (based on filtered data) ── */
    const totalSessions    = filteredLogs.length;
    const uniqueUsersCount = new Set(filteredLogs.map((l) => l.user_id)).size;

    const todayStr    = new Date().toISOString().split('T')[0];
    const todaySessions = filteredLogs.filter((l) => l.opened_at.startsWith(todayStr)).length;

    const userCountMap: Record<string, { name: string; count: number }> = {};
    filteredLogs.forEach((l) => {
        if (!userCountMap[l.user_id])
            userCountMap[l.user_id] = { name: l.name || l.email, count: 0 };
        userCountMap[l.user_id].count++;
    });
    const mostActive = Object.values(userCountMap).sort((a, b) => b.count - a.count)[0];

    // Avg session duration — only count sessions where active_seconds > 0
    const sessionsWithTime = filteredLogs.filter((l) => l.active_seconds > 0);
    const avgSeconds = sessionsWithTime.length > 0
        ? Math.floor(sessionsWithTime.reduce((sum, l) => sum + l.active_seconds, 0) / sessionsWithTime.length)
        : 0;

    /* ── Pagination ── */
    const totalPages    = Math.ceil(totalSessions / pageSize) || 1;
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{
            paddingTop: '100px', paddingBottom: '60px',
            paddingLeft: '40px', paddingRight: '40px',
            maxWidth: '1240px', margin: '0 auto',
            color: '#1e293b', minHeight: '100vh', background: '#f8fafc',
        }}>
            {/* Back */}
            <button
                onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '24px', fontSize: '15px', fontWeight: 500, padding: 0 }}
            >
                <ChevronLeft size={18} /> Back to Marketplace
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <Activity size={36} color="#2563eb" />
                <div>
                    <h1 style={{ fontSize: '30px', fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a', letterSpacing: '-0.5px' }}>
                        User Activity
                    </h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                        Track when users open and use the app — session by session.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '28px' }}>
                <StatCard icon={<Activity />}    label="Total Sessions"      value={totalSessions}            color="#2563eb" />
                <StatCard icon={<Users />}        label="Unique Users"        value={uniqueUsersCount}         color="#7c3aed" />
                <StatCard icon={<Calendar />}     label="Today's Sessions"    value={todaySessions}            color="#16a34a" sub={formatDate(todayStr)} />
                <StatCard
                    icon={<TrendingUp />}
                    label="Most Active User"
                    value={mostActive ? mostActive.count : '—'}
                    sub={mostActive ? mostActive.name : 'No data'}
                    color="#ea580c"
                />
                <StatCard
                    icon={<Clock />}
                    label="Avg Session Duration"
                    value={formatDuration(avgSeconds)}
                    sub={sessionsWithTime.length > 0 ? `across ${sessionsWithTime.length} tracked sessions` : 'No tracked sessions yet'}
                    color="#0891b2"
                />
            </div>

            {/* Filters */}
            <div style={{
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
                padding: '20px 24px', marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end',
            }}>
                {/* User Multiselect */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Filter by User
                    </label>
                    <MultiSelect
                        options={uniqueUserOptions}
                        selected={selectedUsers}
                        onChange={setSelectedUsers}
                        placeholder="Users"
                    />
                </div>

                {/* From Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        From Date
                    </label>
                    <input
                        type="date"
                        value={fromDate}
                        max={toDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
                    />
                </div>

                {/* To Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        To Date
                    </label>
                    <input
                        type="date"
                        value={toDate}
                        min={fromDate}
                        onChange={(e) => setToDate(e.target.value)}
                        style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
                    />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <button
                        onClick={handleApply}
                        style={{ padding: '9px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(37,99,235,0.2)' }}
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleReset}
                        style={{ padding: '9px 14px', background: '#fff', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 500, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <RefreshCw size={14} /> Reset
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: '#64748b', fontSize: '14px' }}>
                    Fetching activity logs...
                </div>
            ) : filteredLogs.length === 0 ? (
                <div style={{ padding: '60px', background: '#fff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <Activity size={40} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                    <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '18px' }}>No activity found</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Try adjusting the date range or user filter.</p>
                </div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                            <thead style={{ background: '#f8fafc', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '14px 24px', fontWeight: 600, width: '48px' }}>#</th>
                                    <th style={{ padding: '14px 24px', fontWeight: 600 }}>User</th>
                                    <th style={{ padding: '14px 24px', fontWeight: 600 }}>Email</th>
                                    <th style={{ padding: '14px 24px', fontWeight: 600 }}>Opened At</th>
                                    <th style={{ padding: '14px 24px', fontWeight: 600 }}>Active Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedLogs.map((log, i) => (
                                    <tr
                                        key={log.id}
                                        style={{ borderBottom: i === paginatedLogs.length - 1 ? 'none' : '1px solid #f1f5f9', transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                                    >
                                        {/* Row number */}
                                        <td style={{ padding: '14px 24px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
                                            {(currentPage - 1) * pageSize + i + 1}
                                        </td>

                                        {/* User */}
                                        <td style={{ padding: '14px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '34px', height: '34px', borderRadius: '50%',
                                                    background: '#eff6ff', color: '#2563eb',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: '13px', flexShrink: 0,
                                                }}>
                                                    {(log.name || log.email).charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                                                    {log.name || '—'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td style={{ padding: '14px 24px', color: '#64748b', fontSize: '13px' }}>
                                            {log.email}
                                        </td>

                                        {/* Opened At */}
                                        <td style={{ padding: '14px 24px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '4px 10px', borderRadius: '999px',
                                                fontSize: '12px', fontWeight: 500,
                                                background: '#f1f5f9', color: '#475569',
                                            }}>
                                                <Calendar size={11} />
                                                {formatDateTime(log.opened_at)}
                                            </span>
                                        </td>

                                        {/* Active Duration */}
                                        <td style={{ padding: '14px 24px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '4px 10px', borderRadius: '999px',
                                                fontSize: '12px', fontWeight: 500,
                                                background: log.active_seconds > 0 ? '#ecfdf5' : '#f8fafc',
                                                color: log.active_seconds > 0 ? '#059669' : '#94a3b8',
                                            }}>
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
                    <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                            Showing{' '}
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{(currentPage - 1) * pageSize + 1}</span>
                            {' '}to{' '}
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{Math.min(currentPage * pageSize, totalSessions)}</span>
                            {' '}of{' '}
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{totalSessions}</span> sessions
                        </span>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                style={{ padding: '6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#cbd5e1' : '#334155' }}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div style={{ padding: '4px 12px', fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>
                                Page {currentPage} of {totalPages}
                            </div>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{ padding: '6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#cbd5e1' : '#334155' }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

