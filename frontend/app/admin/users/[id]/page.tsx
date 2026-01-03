'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft, Clock, AlertTriangle, Globe, ShieldCheck, 
    Plus, Power, RefreshCw, X, AlertCircle, Copy, Check, 
    Calendar, Activity, Zap, Filter
} from 'lucide-react';
import { authorizedFetch } from '@/utils/api';

export default function AdminUserLogsPage() {
    const params = useParams();
    const router = useRouter();
    
    const [logs, setLogs] = useState([]);
    const [userKeys, setUserKeys] = useState([]);
    const [metadata, setMetadata] = useState({ total_logs: 0, page: 1, total_pages: 1 });
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({ totalRequests: 0, errorRate: 0, topEndpoint: 'N/A' });
    
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newKeyData, setNewKeyData] = useState({ name: '', limit: 1000 });
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [confirmAction, setConfirmAction] = useState<{
        type: 'toggle' | 'regenerate';
        keyId: number;
        clientName: string;
        isActive?: boolean;
    } | null>(null);

    const fetchUserKeys = useCallback(async () => {
        try {
            const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${params.id}/keys`);
            const data = await res.json();
            if (data.success) setUserKeys(data.keys);
        } catch (err) { console.error(err); }
    }, [params.id]);

    const fetchAnalytics = useCallback(async () => {
        const query = `?user_id=${params.id}`;
        try {
            const [totalRes, errorRes, topRes] = await Promise.all([
                authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/total-requests${query}`),
                authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/error-rate${query}`),
                authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/top-endpoints${query}`)
            ]);
            const totalData = await totalRes.json();
            const errorData = await errorRes.json();
            const topData = await topRes.json();
            setAnalytics({
                totalRequests: totalData.total_requests || 0,
                errorRate: parseFloat(errorData.error_rate_percent || 0),
                topEndpoint: topData[0]?.endpoint || 'N/A'
            });
        } catch (err) { console.error(err); }
    }, [params.id]);

    const fetchLogs = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        const queryParams = new URLSearchParams({
            user_id: params.id as string,
            page: pageNumber.toString(),
            limit: '50',
            status_code: filters.status,
            start: filters.startDate,
            end: filters.endDate
        });

        try {
            const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logs/?${queryParams.toString()}`);
            const data = await res.json();
            if (data.success) {
                setLogs(data.logs || []);
                setMetadata({ 
                    total_logs: data.total_logs || 0, 
                    page: data.page || 1, 
                    total_pages: data.total_pages || 1 
                });
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    }, [params.id, filters]);

    useEffect(() => {
        fetchLogs(1);
        fetchAnalytics();
        fetchUserKeys();
    }, [fetchLogs, fetchAnalytics, fetchUserKeys]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateKey = async () => {
        if (!newKeyData.name) return;
        const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/api-keys`, {
            method: 'POST',
            body: JSON.stringify({ client_name: newKeyData.name, daily_limit: newKeyData.limit, user_id: params.id })
        });
        if (res.ok) {
            setIsCreateModalOpen(false);
            setNewKeyData({ name: '', limit: 1000 });
            fetchUserKeys();
        }
    };

    const executeConfirmedAction = async () => {
        if (!confirmAction) return;
        const endpoint = confirmAction.type === 'toggle' ? 'toggle' : 'regenerate';
        try {
            const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/api-keys/${confirmAction.keyId}/${endpoint}`, { 
                method: 'PUT' 
            });
            if (res.ok) { setConfirmAction(null); fetchUserKeys(); }
        } catch (err) { console.error(err); }
    };

    const avgResponse = useMemo(() => {
        if (logs.length === 0) return 0;
        return Math.round(logs.reduce((acc, log: any) => acc + (log.response_time_ms || 0), 0) / logs.length);
    }, [logs]);

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans antialiased text-gray-900">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 font-bold hover:text-indigo-600 transition group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Users
            </button>

            <div className="mb-10 text-left">
                <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black tracking-tight text-gray-900">User Activity Logs</h2>
                    <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">Admin Access</span>
                </div>
                <p className="text-gray-500 font-mono text-xs mt-3 bg-white w-fit px-4 py-1.5 rounded-full border border-gray-200 shadow-sm font-bold">UID: {params.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><Activity size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Entries</p>
                        <p className="text-2xl font-black">{metadata.total_logs.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Zap size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Latency</p>
                        <p className="text-2xl font-black">{avgResponse}<span className="text-xs font-bold text-gray-400 ml-1">ms</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-rose-50 p-4 rounded-2xl text-rose-600"><AlertTriangle size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Error Rate</p>
                        <p className="text-2xl font-black">{analytics.errorRate.toFixed(3)}<span className="text-xs font-bold text-gray-400 ml-1">%</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="bg-amber-50 p-4 rounded-2xl text-amber-600"><Globe size={24} /></div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Route</p>
                        <p className="text-lg font-black truncate">{analytics.topEndpoint}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-10">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-lg"><ShieldCheck size={22} className="text-indigo-600" /> Authorized API Keys</div>
                    <button onClick={() => setIsCreateModalOpen(true)} className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-indigo-600 transition shadow-lg shadow-gray-200">
                        <Plus size={16} /> Issue Key
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                        <tr><th className="px-8 py-5">Client</th><th className="px-8 py-5">Secret Key</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Management</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                        {userKeys.map((k: any) => (
                            <tr key={k.id} className="text-sm hover:bg-gray-50/30 transition-colors">
                                <td className="px-8 py-5 font-bold">{k.client_name}</td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <code className="font-mono text-[11px] text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">{k.key.substring(0, 16)}...</code>
                                        <button onClick={() => { navigator.clipboard.writeText(k.key); setCopiedId(k.id); setTimeout(() => setCopiedId(null), 2000); }} className="text-gray-300 hover:text-indigo-600 transition">
                                            {copiedId === k.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${k.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>{k.is_active ? 'Active' : 'Disabled'}</span>
                                </td>
                                <td className="px-8 py-5 text-right flex justify-end gap-3">
                                    <button onClick={() => setConfirmAction({ type: 'toggle', keyId: k.id, clientName: k.client_name, isActive: k.is_active })} className={`p-2 rounded-xl transition ${k.is_active ? 'text-gray-400 hover:text-rose-600 hover:bg-rose-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}><Power size={18} /></button>
                                    <button onClick={() => setConfirmAction({ type: 'regenerate', keyId: k.id, clientName: k.client_name })} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"><RefreshCw size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-10 flex flex-wrap gap-8 items-end">
                <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Filter size={12} /> Response Status</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 transition outline-none">
                        <option value="">All Responses</option>
                        <option value="200">200 OK</option>
                        <option value="400">400 Error</option>
                        <option value="401">401 Auth</option>
                        <option value="500">500 Critical</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={12} /> From Date</label>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold transition outline-none" />
                </div>
                <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={12} /> To Date</label>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold transition outline-none" />
                </div>
                <button onClick={() => setFilters({ status: '', startDate: '', endDate: '' })} className="px-8 py-3.5 text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-widest transition">Reset Filters</button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-24">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-lg"><Clock size={22} className="text-orange-500" /> Network Traffic Logs</div>
                    <div className="flex items-center gap-5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {metadata.page} of {metadata.total_pages}</span>
                        <div className="flex border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                            <button disabled={metadata.page <= 1 || loading} onClick={() => fetchLogs(metadata.page - 1)} className="p-3 hover:bg-gray-50 disabled:opacity-20 transition border-r border-gray-100"><ChevronLeft size={20} /></button>
                            <button disabled={metadata.page >= metadata.total_pages || loading} onClick={() => fetchLogs(metadata.page + 1)} className="p-3 hover:bg-gray-50 disabled:opacity-20 transition"><ChevronLeft size={20} className="rotate-180" /></button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                            <tr><th className="px-8 py-5">Method</th><th className="px-8 py-5">Route</th><th className="px-8 py-5">Status</th><th className="px-8 py-5">Latency</th><th className="px-8 py-5 text-right">Timestamp</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {loading ? (
                                <tr><td colSpan={5} className="py-24 text-center animate-pulse text-gray-400 font-bold">Scanning database...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="py-24 text-center text-gray-400 font-bold">No logs found matching criteria</td></tr>
                            ) : (
                                logs.map((log: any, i) => (
                                    <tr key={i} className="text-sm hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${log.method === 'GET' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{log.method}</span></td>
                                        <td className="px-8 py-5 font-mono text-xs text-gray-500 max-w-xs truncate">{log.endpoint}</td>
                                        <td className={`px-8 py-5 font-black ${log.status_code >= 400 ? 'text-rose-500' : 'text-emerald-600'}`}>{log.status_code}</td>
                                        <td className="px-8 py-5 text-gray-400 text-xs font-mono font-bold">{log.response_time_ms ? `${log.response_time_ms}ms` : '-'}</td>
                                        <td className="px-8 py-5 text-right text-gray-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black tracking-tight">Issue New Key</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-300 hover:text-gray-900 transition"><X size={24} /></button>
                        </div>
                        <div className="space-y-6">
                            <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Client Tag</label><input className="w-full mt-2 px-5 py-4 bg-gray-50 border-gray-100 border rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 font-bold" placeholder="e.g. Analytics Engine" value={newKeyData.name} onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })} /></div>
                            <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Daily Cap</label><input type="number" className="w-full mt-2 px-5 py-4 bg-gray-50 border-gray-100 border rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 font-bold" value={newKeyData.limit} onChange={(e) => setNewKeyData({ ...newKeyData, limit: parseInt(e.target.value) })} /></div>
                        </div>
                        <button onClick={handleCreateKey} className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-[0.98]">Generate Secure Key</button>
                    </div>
                </div>
            )}

            {confirmAction && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xl z-[110] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-200">
                        <div className={`p-5 rounded-3xl mb-6 mx-auto w-fit ${confirmAction.type === 'toggle' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-600'}`}><AlertCircle size={44} /></div>
                        <h3 className="text-2xl font-black mb-3">Confirm Action</h3>
                        <p className="text-gray-500 font-bold px-2 text-sm leading-relaxed">{confirmAction.type === 'toggle' ? `Disable/Enable access for "${confirmAction.clientName}"?` : `Regenerating will revoke current access for "${confirmAction.clientName}" immediately.`}</p>
                        <div className="flex flex-col gap-3 mt-10">
                            <button onClick={executeConfirmedAction} className={`w-full py-5 rounded-2xl font-black text-white shadow-xl ${confirmAction.type === 'toggle' ? 'bg-gray-900' : 'bg-rose-600 shadow-rose-100'}`}>Authorize Change</button>
                            <button onClick={() => setConfirmAction(null)} className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}