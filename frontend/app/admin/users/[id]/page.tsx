'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    ChevronLeft, Clock, AlertTriangle, Globe, BarChart3,
    ShieldCheck, Plus, Power, RefreshCw, X, AlertCircle, Copy, Check, Search, Calendar, Activity, Zap, Filter
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
        method: '',
        endpoint: '',
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
                errorRate: errorData.error_rate_percent || 0,
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
            method: filters.method,
            endpoint: filters.endpoint,
            start: filters.startDate,
            end: filters.endDate
        });

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/logs/?${queryParams.toString()}`;

        try {
            const res = await authorizedFetch(url);
            const data = await res.json();
            if (data.success) {
                setLogs(data.logs || []);
                setMetadata({ 
                    total_logs: data.total_logs || 0, 
                    page: data.page || 1, 
                    total_pages: data.total_pages || 1 
                });
            }
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoading(false); 
        }
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
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/api-keys/${confirmAction.keyId}/${endpoint}`;
        try {
            const res = await authorizedFetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' } });
            if (res.ok) { setConfirmAction(null); fetchUserKeys(); }
        } catch (err) { console.error(err); }
    };

    const copyToClipboard = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const avgResponse = logs.length > 0
        ? Math.round(logs.reduce((acc: any, log: any) => acc + (log.response_time_ms || 0), 0) / logs.length)
        : 0;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 font-medium hover:text-gray-900 transition">
                <ChevronLeft size={20} /> Back to Users
            </button>

            <div className="mb-8 text-left text-gray-900">
                <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black tracking-tight">User Activity Logs</h2>
                    <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Admin View</span>
                </div>
                <p className="text-gray-500 font-mono text-sm mt-2 bg-gray-100 w-fit px-3 py-1 rounded-full border border-gray-200">User ID: {params.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-left">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-2xl text-green-600"><Activity size={24} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Logs</p>
                        <p className="text-2xl font-black text-gray-900">{metadata.total_logs.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Zap size={24} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Latency</p>
                        <p className="text-2xl font-black text-gray-900">{avgResponse} <span className="text-sm font-normal text-gray-400">ms</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-2xl text-red-600"><AlertTriangle size={24} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Error Rate</p>
                        <p className="text-2xl font-black text-gray-900">{analytics.errorRate}%</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><Globe size={24} /></div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Route</p>
                        <p className="text-lg font-black text-gray-900 truncate">{analytics.topEndpoint}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-50 font-bold flex items-center justify-between text-gray-900">
                    <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-indigo-500" /> API Keys</div>
                    <button onClick={() => setIsCreateModalOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-600 transition">
                        <Plus size={14} /> Issue New Key
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
                            <tr><th className="px-8 py-4">Client</th><th className="px-8 py-4">Key Value</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {userKeys.map((k: any) => (
                                <tr key={k.id} className="text-sm">
                                    <td className="px-8 py-4 font-bold text-gray-900">{k.client_name}</td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 truncate max-w-[150px]">{k.key}</span>
                                            <button onClick={() => copyToClipboard(k.key, k.id)} className="text-gray-400 hover:text-indigo-600 transition">
                                                {copiedId === k.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${k.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{k.is_active ? 'Active' : 'Disabled'}</span>
                                    </td>
                                    <td className="px-8 py-4 text-right flex justify-end gap-2 text-gray-900">
                                        <button onClick={() => setConfirmAction({ type: 'toggle', keyId: k.id, clientName: k.client_name, isActive: k.is_active })} className={`p-2 rounded-lg transition ${k.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}><Power size={16} /></button>
                                        <button onClick={() => setConfirmAction({ type: 'regenerate', keyId: k.id, clientName: k.client_name })} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><RefreshCw size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-6 items-end">
                <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Filter size={12} /> Status Code</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition text-gray-900">
                        <option value="">All Statuses</option>
                        <option value="200">200 OK</option>
                        <option value="400">400 Bad Request</option>
                        <option value="401">401 Unauthorized</option>
                        <option value="404">404 Not Found</option>
                        <option value="500">500 Server Error</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12} /> Start Date</label>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition text-gray-900" />
                </div>

                <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12} /> End Date</label>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition text-gray-900" />
                </div>

                <button onClick={() => setFilters({ status: '', method: '', endpoint: '', startDate: '', endDate: '' })} className="px-6 py-2.5 text-gray-400 hover:text-gray-900 text-xs font-black uppercase tracking-widest transition mb-1">Clear Filters</button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-20">
                <div className="p-6 border-b border-gray-50 font-bold flex items-center justify-between bg-white text-gray-900">
                    <div className="flex items-center gap-2"><Clock size={18} className="text-orange-500" /> Live HTTP Traffic</div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page {metadata.page} / {metadata.total_pages}</span>
                        <div className="flex border rounded-xl overflow-hidden shadow-sm">
                            <button disabled={metadata.page <= 1 || loading} onClick={() => fetchLogs(metadata.page - 1)} className="p-2 bg-white hover:bg-gray-50 disabled:opacity-30 border-r transition"><ChevronLeft size={18} /></button>
                            <button disabled={metadata.page >= metadata.total_pages || loading} onClick={() => fetchLogs(metadata.page + 1)} className="p-2 bg-white hover:bg-gray-50 disabled:opacity-30 transition"><ChevronLeft size={18} className="rotate-180" /></button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
                            <tr><th className="px-8 py-4">Method</th><th className="px-8 py-4">Endpoint</th><th className="px-8 py-4">Status</th><th className="px-8 py-4">Latency</th><th className="px-8 py-4 text-right">Time</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={5} className="py-20 text-center animate-pulse text-gray-400 text-sm">Loading logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-medium">No activity matching filters</td></tr>
                            ) : (
                                logs.map((log: any, i) => (
                                    <tr key={i} className="text-sm hover:bg-gray-50/80 transition-colors">
                                        <td className="px-8 py-4"><span className={`px-2 py-1 rounded-lg text-[10px] font-black ${log.method === 'GET' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{log.method}</span></td>
                                        <td className="px-8 py-4 font-mono text-xs text-gray-600 truncate max-w-[300px]">{log.endpoint}</td>
                                        <td className={`px-8 py-4 font-bold ${log.status_code >= 400 ? 'text-red-500' : 'text-green-600'}`}>{log.status_code}</td>
                                        <td className="px-8 py-4 text-gray-400 text-xs font-mono">{log.response_time_ms ? `${log.response_time_ms}ms` : '-'}</td>
                                        <td className="px-8 py-4 text-right text-gray-400 font-mono text-[11px]">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 text-left">
                        <div className="flex justify-between items-center mb-6 text-gray-900">
                            <h3 className="text-2xl font-black tracking-tight">Issue API Key</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
                        </div>
                        <div className="space-y-5">
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Client Name</label><input className="w-full mt-1 px-4 py-3 bg-gray-50 border rounded-xl outline-none text-gray-900" placeholder="Production App" value={newKeyData.name} onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Daily Limit</label><input type="number" className="w-full mt-1 px-4 py-3 bg-gray-50 border rounded-xl outline-none text-gray-900" value={newKeyData.limit} onChange={(e) => setNewKeyData({ ...newKeyData, limit: parseInt(e.target.value) })} /></div>
                        </div>
                        <button onClick={handleCreateKey} className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition shadow-lg">Generate Key</button>
                    </div>
                </div>
            )}

            {confirmAction && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 text-center">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl p-8 border border-white/20">
                        <div className={`p-4 rounded-3xl mb-6 mx-auto w-fit ${confirmAction.type === 'toggle' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}><AlertCircle size={40} /></div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Are you sure?</h3>
                        <p className="text-gray-500 font-medium px-4">{confirmAction.type === 'toggle' ? `You are about to ${confirmAction.isActive ? 'disable' : 'enable'} the API key for "${confirmAction.clientName}".` : `Regenerating will permanently delete the current key for "${confirmAction.clientName}".`}</p>
                        <div className="flex flex-col gap-3 mt-8">
                            <button onClick={executeConfirmedAction} className={`w-full py-4 rounded-2xl font-black text-white shadow-lg ${confirmAction.type === 'toggle' ? 'bg-gray-900' : 'bg-red-600'}`}>{confirmAction.type === 'toggle' ? 'Confirm Change' : 'Yes, Regenerate'}</button>
                            <button onClick={() => setConfirmAction(null)} className="w-full py-4 text-gray-400 font-bold hover:text-gray-600">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}