import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, X, Shield, Clock, ShieldAlert, Search, ChevronDown, ChevronRight } from 'lucide-react';

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
            <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '9px 12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#334155', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selected.length > 0 ? `${selected.length} ${placeholder} selected` : `Filter by ${placeholder}...`}
                </span>
                <ChevronDown size={14} color="#64748b" />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 50, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', maxHeight: '280px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input autoFocus placeholder={`Search ${placeholder.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '7px 8px 7px 30px', color: '#1e293b', fontSize: '13px', outline: 'none' }} />
                            </div>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
                            {filtered.length === 0 ? (
                                <div style={{ padding: '12px', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>No matches found</div>
                            ) : (
                                filtered.map(opt => (
                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', cursor: 'pointer', fontSize: '13px', color: '#334155', borderRadius: '4px' }}>
                                        <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} style={{ width: '14px', height: '14px', accentColor: '#2563eb' }} />
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

    // Filter/Pagination State
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

    useEffect(() => {
        fetchRequests();
    }, []);

    // Effect to reset page to 1 when any filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [globalSearch, statusTab, selectedUsers, selectedApps]);

    const handleAction = async (id: number, status: string) => {
        try {
            await fetch(`/api/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));

            // When approved, notify the user via n8n webhook
            if (status === 'approved') {
                const req = requests.find(r => r.id === id);
                if (req) {
                    fetch('https://n8n.systechusa.com/webhook/marketplace-approve', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userName: req.user_name,
                            userEmail: req.user_email,
                            appName: req.app_name,
                        }),
                    }).catch(err => console.error('Failed to send approval email:', err));
                }
            }
        } catch (e) {
            console.error('Failed to update request:', e);
        }
    };

    // Extract unique options for multiselects
    const uniqueUsers = Array.from(new Set(requests.map(r => r.user_name))).sort() as string[];
    const uniqueApps = Array.from(new Set(requests.map(r => r.app_name))).sort() as string[];

    // Derived filtering
    const filteredRequests = requests.filter(req => {
        const query = globalSearch.toLowerCase();
        const matchesSearch = query ? (
            req.user_name.toLowerCase().includes(query) ||
            req.user_email.toLowerCase().includes(query) ||
            req.app_name.toLowerCase().includes(query)
        ) : true;

        const matchesStatus = statusTab === 'all' || req.status === statusTab;
        const matchesUsers = selectedUsers.length === 0 || selectedUsers.includes(req.user_name);
        const matchesApps = selectedApps.length === 0 || selectedApps.includes(req.app_name);

        return matchesSearch && matchesStatus && matchesUsers && matchesApps;
    });

    const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1;
    const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="admin-page" style={{ paddingTop: '100px', paddingBottom: '60px', paddingLeft: '40px', paddingRight: '40px', maxWidth: '1240px', margin: '0 auto', color: '#1e293b', minHeight: '100vh', background: '#f8fafc' }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '24px', fontSize: '15px', fontWeight: 500, padding: 0 }}>
                <ChevronLeft size={18} /> Back to Marketplace
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={36} color="#2563eb" />
                    <div>
                        <h1 style={{ fontSize: '30px', fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a', letterSpacing: '-0.5px' }}>Access Requests</h1>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Manage user application permissions efficiently.</p>
                    </div>
                </div>
            </div>

            {/* TAB BAR */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
                {['all', 'pending', 'approved', 'revoked'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setStatusTab(tab as typeof statusTab)}
                        style={{
                            padding: '10px 20px',
                            background: 'none',
                            border: 'none',
                            borderBottom: statusTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                            color: statusTab === tab ? '#2563eb' : '#64748b',
                            fontWeight: statusTab === tab ? 600 : 500,
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* CONTROLS BAR: Search & Dropdowns */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', width: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search users or applications..."
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px 10px 36px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#0f172a', outlineColor: '#2563eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    />
                    {globalSearch && (
                        <button onClick={() => setGlobalSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <X size={14} color="#94a3b8" />
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <MultiSelect options={uniqueUsers} selected={selectedUsers} onChange={setSelectedUsers} placeholder="Users" />
                    <MultiSelect options={uniqueApps} selected={selectedApps} onChange={setSelectedApps} placeholder="Apps" />
                </div>
            </div>

            {/* DATATABLE */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: '#64748b' }}>
                    Fetching requests...
                </div>
            ) : filteredRequests.length === 0 ? (
                <div style={{ padding: '60px', background: '#fff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <ShieldAlert size={40} color="#94a3b8" style={{ marginBottom: '16px' }} />
                    <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '18px' }}>No matches found</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Try adjusting your search criteria or select different tabs.</p>
                </div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead style={{ background: '#f8fafc', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontWeight: 600 }}>User Profile</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 600 }}>Application</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 600 }}>Requested On</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRequests.map((req, i) => (
                                    <tr key={req.id} style={{ borderBottom: i === paginatedRequests.length - 1 ? 'none' : '1px solid #f1f5f9', background: '#fff', transition: 'background 0.15s' }} className="admin-tr">
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
                                                    {req.user_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{req.user_name}</div>
                                                    <div style={{ fontSize: '13px', color: '#64748b' }}>{req.user_email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: 500, fontSize: '14px' }}>{req.app_name}</td>
                                        <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px' }}>
                                            {new Date(req.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: req.status === 'pending' ? '#fef3c7' : req.status === 'approved' ? '#dcfce7' : '#fee2e2', color: req.status === 'pending' ? '#d97706' : req.status === 'approved' ? '#16a34a' : '#dc2626' }}>
                                                {req.status === 'pending' && <Clock size={12} />}
                                                {req.status === 'approved' && <Check size={12} />}
                                                {req.status === 'revoked' && <X size={12} />}
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                {req.status !== 'approved' && (
                                                    <button onClick={() => handleAction(req.id, 'approved')} style={{ padding: '8px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, boxShadow: '0 1px 2px rgba(22, 163, 74, 0.2)' }}>
                                                        Approve
                                                    </button>
                                                )}
                                                {req.status === 'approved' && (
                                                    <button onClick={() => handleAction(req.id, 'revoked')} style={{ padding: '8px 14px', background: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, boxShadow: 'none' }}>
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
                    <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                            Showing <span style={{ fontWeight: 600, color: '#0f172a' }}>{((currentPage - 1) * pageSize) + 1}</span> to <span style={{ fontWeight: 600, color: '#0f172a' }}>{Math.min(currentPage * pageSize, filteredRequests.length)}</span> of <span style={{ fontWeight: 600, color: '#0f172a' }}>{filteredRequests.length}</span> results
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#cbd5e1' : '#334155' }}>
                                <ChevronLeft size={16} />
                            </button>
                            <div style={{ padding: '4px 12px', fontSize: '14px', fontWeight: 500, color: '#0f172a', display: 'flex', alignItems: 'center' }}>
                                Page {currentPage} of {totalPages}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#cbd5e1' : '#334155' }}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


