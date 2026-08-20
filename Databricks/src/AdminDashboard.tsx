import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, X, Shield, Clock, ShieldAlert, Search, ChevronDown, ChevronRight } from 'lucide-react';

/* ── Databricks color tokens ── */
const DB = {
  navy:    '#1B3139',
  navy900: '#0B2026',
  lava:    '#EB1600',
  lava700: '#C41200',
  lavaLt:  '#FFF0EF',
  lavaLt2: 'rgba(235,22,0,0.1)',
  oat:     '#F9F7F4',
  slate:   '#5A6F77',
  line:    '#DCE0E2',
  white:   '#FFFFFF',
};

interface RequestEntry {
    id: number;
    user_name: string;
    user_email: string;
    app_id: string;
    app_name: string;
    status: string;
    created_at: string;
}

/* ─────────────────────────────────────
   CUSTOM SEARCHABLE MULTISELECT
───────────────────────────────────── */
const MultiSelect = ({ options, selected, onChange, placeholder }: { options: string[], selected: string[], onChange: (s: string[]) => void, placeholder: string }) => {
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

    const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

    const toggle = (opt: string) => {
        if (selected.includes(opt)) onChange(selected.filter(x => x !== opt));
        else onChange([...selected, opt]);
    };

    return (
        <div ref={ref} style={{ position: 'relative', width: '220px' }}>
            <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '9px 12px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '6px', color: DB.navy, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selected.length > 0 ? `${selected.length} ${placeholder} selected` : `Filter by ${placeholder}...`}
                </span>
                <ChevronDown size={14} color={DB.slate} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '8px', zIndex: 50, boxShadow: '0 10px 25px -5px rgba(27,49,57,0.12)', maxHeight: '280px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '8px', borderBottom: `1px solid ${DB.line}` }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: DB.slate }} />
                                <input autoFocus placeholder={`Search ${placeholder.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', background: DB.oat, border: `1px solid ${DB.line}`, borderRadius: '4px', padding: '7px 8px 7px 30px', color: DB.navy, fontSize: '13px', outline: 'none' }} />
                            </div>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
                            {filtered.length === 0 ? (
                                <div style={{ padding: '12px', color: DB.slate, fontSize: '13px', textAlign: 'center' }}>No matches found</div>
                            ) : (
                                filtered.map(opt => (
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
   MAIN COMPONENT
───────────────────────────────────── */
export default function AdminDashboard({ onBack }: { onBack: () => void }) {
    const [requests, setRequests] = useState<RequestEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const [globalSearch, setGlobalSearch] = useState('');
    const [statusTab, setStatusTab] = useState<'all' | 'pending' | 'approved' | 'revoked'>('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedApps, setSelectedApps] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchRequests = () => {
        setLoading(true);
        fetch('/api/requests')
            .then((res) => res.json())
            .then((data) => setRequests(data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchRequests(); }, []);
    useEffect(() => { setCurrentPage(1); }, [globalSearch, statusTab, selectedUsers, selectedApps]);

    const handleAction = async (id: number, status: string) => {
        try {
            await fetch(`/api/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            if (status === 'approved') {
                const req = requests.find(r => r.id === id);
                if (req) {
                    fetch('https://n8n.systechusa.com/webhook/databricks-marketplace-approve', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userName: req.user_name, userEmail: req.user_email, appName: req.app_name }),
                    }).catch(err => console.error('Failed to send approval email:', err));
                }
            }
        } catch (e) {
            console.error('Failed to update request:', e);
        }
    };

    const uniqueUsers = Array.from(new Set(requests.map(r => r.user_name))).sort() as string[];
    const uniqueApps  = Array.from(new Set(requests.map(r => r.app_name))).sort() as string[];

    const filteredRequests = requests.filter(req => {
        const query = globalSearch.toLowerCase();
        const matchesSearch = query ? (
            req.user_name.toLowerCase().includes(query) ||
            req.user_email.toLowerCase().includes(query) ||
            req.app_name.toLowerCase().includes(query)
        ) : true;
        const matchesStatus = statusTab === 'all' || req.status === statusTab;
        const matchesUsers  = selectedUsers.length === 0 || selectedUsers.includes(req.user_name);
        const matchesApps   = selectedApps.length === 0  || selectedApps.includes(req.app_name);
        return matchesSearch && matchesStatus && matchesUsers && matchesApps;
    });

    const totalPages       = Math.ceil(filteredRequests.length / pageSize) || 1;
    const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const tabCounts: Record<string, number> = {
        all:      requests.length,
        pending:  requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        revoked:  requests.filter(r => r.status === 'revoked').length,
    };

    return (
        <div style={{ minHeight: '100vh', background: DB.oat, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

            {/* ── Hero Banner ── */}
            <div style={{
                background: `linear-gradient(135deg, ${DB.navy900} 0%, ${DB.navy} 60%, #143D4A 100%)`,
                paddingTop: '100px', paddingBottom: '40px',
                paddingLeft: '40px', paddingRight: '40px',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />
                {/* Lava orb */}
                <div style={{
                    position: 'absolute', right: '-80px', top: '-80px',
                    width: '360px', height: '360px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(235,22,0,0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
                    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '999px', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', marginBottom: '28px', fontSize: '13px', fontWeight: 500, padding: '6px 14px 6px 10px' }}>
                        <ChevronLeft size={16} /> Back to Marketplace
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: DB.lavaLt2, border: '1px solid rgba(235,22,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={28} color={DB.lava} />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: DB.lava }}>Admin · Access Management</p>
                            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.03em' }}>Access Requests</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 40px 60px' }}>

                {/* TAB BAR */}
                <div style={{ display: 'flex', gap: '4px', borderBottom: `2px solid ${DB.line}`, marginBottom: '24px' }}>
                    {(['all', 'pending', 'approved', 'revoked'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setStatusTab(tab)}
                            style={{
                                padding: '10px 18px',
                                background: 'none', border: 'none',
                                borderBottom: statusTab === tab ? `2px solid ${DB.lava}` : '2px solid transparent',
                                marginBottom: '-2px',
                                color: statusTab === tab ? DB.lava : DB.slate,
                                fontWeight: statusTab === tab ? 700 : 500,
                                textTransform: 'capitalize', cursor: 'pointer',
                                fontSize: '13px', transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '7px',
                            }}
                        >
                            {tab}
                            <span style={{
                                padding: '1px 7px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                                background: statusTab === tab ? DB.lavaLt2 : 'rgba(90,111,119,0.1)',
                                color: statusTab === tab ? DB.lava : DB.slate,
                            }}>
                                {tabCounts[tab]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* CONTROLS BAR */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: DB.slate }} />
                        <input
                            type="text"
                            placeholder="Search users or applications..."
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px 10px 36px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '8px', fontSize: '13px', color: DB.navy, outlineColor: DB.lava, boxShadow: '0 1px 2px rgba(27,49,57,0.06)', boxSizing: 'border-box' }}
                        />
                        {globalSearch && (
                            <button onClick={() => setGlobalSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                <X size={14} color={DB.slate} />
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <MultiSelect options={uniqueUsers} selected={selectedUsers} onChange={setSelectedUsers} placeholder="Users" />
                        <MultiSelect options={uniqueApps}  selected={selectedApps}  onChange={setSelectedApps}  placeholder="Apps"  />
                    </div>
                </div>

                {/* DATATABLE */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: DB.slate }}>
                        Fetching requests…
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div style={{ padding: '60px', background: DB.white, borderRadius: '12px', textAlign: 'center', border: `1px solid ${DB.line}` }}>
                        <ShieldAlert size={40} color={DB.line} style={{ marginBottom: '16px' }} />
                        <h3 style={{ margin: '0 0 8px 0', color: DB.navy, fontSize: '18px' }}>No matches found</h3>
                        <p style={{ margin: 0, color: DB.slate, fontSize: '14px' }}>Try adjusting your search criteria or select a different tab.</p>
                    </div>
                ) : (
                    <div style={{ background: DB.white, borderRadius: '12px', border: `1px solid ${DB.line}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(27,49,57,0.07)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                                <thead style={{ background: DB.oat, fontSize: '11px', color: DB.slate, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${DB.line}` }}>
                                    <tr>
                                        <th style={{ padding: '14px 24px', fontWeight: 700 }}>User Profile</th>
                                        <th style={{ padding: '14px 24px', fontWeight: 700 }}>Application</th>
                                        <th style={{ padding: '14px 24px', fontWeight: 700 }}>Requested On</th>
                                        <th style={{ padding: '14px 24px', fontWeight: 700 }}>Status</th>
                                        <th style={{ padding: '14px 24px', fontWeight: 700, textAlign: 'right' }}>Management</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRequests.map((req, i) => (
                                        <tr
                                            key={req.id}
                                            style={{ borderBottom: i === paginatedRequests.length - 1 ? 'none' : `1px solid ${DB.oat}`, background: DB.white, transition: 'background 0.15s' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = DB.oat)}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = DB.white)}
                                        >
                                            <td style={{ padding: '14px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: DB.lavaLt2, color: DB.lava, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                                                        {req.user_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: DB.navy, fontSize: '14px' }}>{req.user_name}</div>
                                                        <div style={{ fontSize: '12px', color: DB.slate }}>{req.user_email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 24px', color: DB.navy, fontWeight: 500, fontSize: '14px' }}>{req.app_name}</td>
                                            <td style={{ padding: '14px 24px', color: DB.slate, fontSize: '13px' }}>
                                                {new Date(req.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '14px 24px' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                                                    background: req.status === 'pending'  ? '#FFF8E1' : req.status === 'approved' ? '#E8F5E9' : '#FFEBEE',
                                                    color:      req.status === 'pending'  ? '#B45309' : req.status === 'approved' ? '#2E7D32'  : '#C62828',
                                                }}>
                                                    {req.status === 'pending'  && <Clock size={12} />}
                                                    {req.status === 'approved' && <Check size={12} />}
                                                    {req.status === 'revoked'  && <X     size={12} />}
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    {req.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleAction(req.id, 'approved')}
                                                            style={{ padding: '7px 16px', background: DB.lava, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em' }}
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {req.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleAction(req.id, 'revoked')}
                                                            style={{ padding: '7px 16px', background: DB.white, color: '#C62828', border: '1px solid #FFCDD2', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                                                        >
                                                            Revoke
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div style={{ padding: '14px 24px', background: DB.oat, borderTop: `1px solid ${DB.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: DB.slate }}>
                                Showing{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{((currentPage - 1) * pageSize) + 1}</span>
                                {' '}to{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{Math.min(currentPage * pageSize, filteredRequests.length)}</span>
                                {' '}of{' '}
                                <span style={{ fontWeight: 600, color: DB.navy }}>{filteredRequests.length}</span> results
                            </span>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{ padding: '6px 8px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? DB.line : DB.navy, display: 'flex', alignItems: 'center' }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div style={{ padding: '4px 14px', fontSize: '13px', fontWeight: 600, color: DB.navy, background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '6px' }}>
                                    {currentPage} / {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    style={{ padding: '6px 8px', background: DB.white, border: `1px solid ${DB.line}`, borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? DB.line : DB.navy, display: 'flex', alignItems: 'center' }}
                                >
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

