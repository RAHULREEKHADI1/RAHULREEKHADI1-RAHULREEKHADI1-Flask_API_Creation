'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Shield, Key, BarChart3, Loader2, Activity, Zap, ChevronRight, AlertCircle, LogOut, Filter, Calendar, AlertTriangle, Globe, RefreshCcw, X, CheckCircle, Terminal, Copy, Play } from 'lucide-react';
import { authorizedFetch } from '@/utils/api';

interface LogEntry {
    timestamp: string;
    endpoint: string;
    method: string;
    status_code: number;
    response_time_ms: number;
    api_key: string;
}

export default function RequestLogsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [metadata, setMetadata] = useState({ total_logs: 0, total_pages: 1, page: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [apiResponse, setApiResponse] = useState<{ status: number, data: any } | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyKey = () => {
        const apiKey = params.key as string;
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const testApiCall = async () => {
        const apiKey = params.key as string;
        if (!apiKey) return;

        setIsTesting(true);
        try {
            console.log(apiKey);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/data`, {
                method: 'GET',
                headers: {
                    'Authorization': `Api-Key ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log(data);

            setApiResponse({ status: res.status, data });
            fetchLogs(1);
            fetchAnalytics();
            
        } catch (error) {
            console.log(error);

            setApiResponse({ status: 500, data: { msg: "Connection failed to Flask backend" } });
        } finally {
            setIsTesting(false);
        }
    };

    const [analytics, setAnalytics] = useState({
        errorRate: 0,
        topEndpoint: 'N/A'
    });

    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    const fetchAnalytics = useCallback(async () => {
        try {
            const userId = searchParams.get('user_id');
            const query = userId ? `?user_id=${userId}` : '';

            const [errorRes, topRes] = await Promise.all([
                authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/error-rate${query}`),
                authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/top-endpoints${query}`)
            ]);

            const errorData = await errorRes.json();
            const topData = await topRes.json();

            setAnalytics({
                errorRate: errorData.error_rate_percent || 0,
                topEndpoint: topData[0]?.endpoint || 'N/A'
            });
        } catch (err) {
            console.error("Analytics fetch failed");
        }
    }, [searchParams]);

    const fetchLogs = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);
            setError(null);

            const apiKey = params.key;
            const userId = searchParams.get('user_id');

            const queryParams = new URLSearchParams({
                page: pageNumber.toString(),
                limit: '50',
                status_code: statusFilter,
                start: startDate,
                end: endDate
            });

            if (apiKey) queryParams.append('api_key', apiKey.toString());
            if (userId) queryParams.append('user_id', userId);

            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/logs/?${queryParams.toString()}`;
            const res = await authorizedFetch(url);

            if (res.status === 429) {
                setError("Rate limit exceeded. Please reset API usage.");
                return;
            }

            const data = await res.json();

            if (res.ok && data.success) {
                setLogs(data.logs || []);
                setMetadata({
                    total_logs: data.total_logs || 0,
                    total_pages: data.total_pages || 1,
                    page: data.page || 1
                });
            } else {
                setError(data.msg || "Failed to fetch logs.");
            }
        } catch (err) {
            setError("Network error: Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    }, [params.key, searchParams, statusFilter, startDate, endDate]);

    useEffect(() => {
        fetchLogs(1);
        fetchAnalytics();
    }, [fetchLogs, fetchAnalytics]);

    const avgResponse = logs.length > 0
        ? Math.round(logs.reduce((acc, log) => acc + (log.response_time_ms || 0), 0) / logs.length)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 flex">

            <aside className="w-80 bg-slate-950 text-white p-6 flex flex-col border-r border-slate-800 shrink-0 sticky top-0 h-screen">

                <div className="flex items-center gap-3 mb-10 px-2 shrink-0">
                    <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                        <Shield size={22} className="text-white" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">API Guard</h1>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                    <nav className="flex flex-col gap-1.5">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-3 text-slate-400 p-3 rounded-xl text-sm font-medium hover:bg-slate-900 transition-all hover:text-white group"
                        >
                            <Key size={18} className="group-hover:text-indigo-400 transition-colors" />
                            API Management
                        </button>
                        <div className="flex items-center gap-3 bg-indigo-600/10 text-indigo-400 p-3 rounded-xl text-sm font-semibold border border-indigo-500/20 shadow-sm cursor-default">
                            <BarChart3 size={18} />
                            Request Logs
                        </div>
                    </nav>

                    <div className="bg-stone-50 rounded-3xl p-5 border border-stone-200 shadow-xl">
                        <div className="flex items-center justify-between mb-5 px-1">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-stone-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">API Sandbox</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-stone-300" />
                                <div className="w-1 h-1 rounded-full bg-stone-300" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="group relative bg-white p-3.5 rounded-2xl border border-stone-200 transition-all hover:border-amber-500/50 shadow-sm">
                                <p className="text-[9px] font-black text-stone-400 uppercase mb-1.5 flex justify-between items-center">
                                    Active Key
                                    <button onClick={copyKey} className="text-stone-400 hover:text-stone-600">
                                        {copied ? <CheckCircle size={10} className="text-emerald-600" /> : <Copy size={10} />}
                                    </button>
                                </p>
                                <p className="text-[11px] font-mono text-stone-700 truncate tracking-tight">
                                    {params.key || 'no_key_detected'}
                                </p>
                            </div>

                            <div className="bg-stone-100/50 p-3 rounded-xl border border-stone-200/60">
                                <p className="text-[9px] font-black text-stone-400 uppercase mb-1">Route</p>
                                <p className="text-[10px] font-mono text-stone-600">GET /api/data</p>
                            </div>

                            <button
                                onClick={testApiCall}
                                disabled={isTesting}
                                className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all active:scale-95 shadow-lg shadow-stone-200"
                            >
                                {isTesting ? <Loader2 className="animate-spin" size={16} /> : <><Play size={14} fill="currentColor" /> Execute Test</>}
                            </button>

                            {apiResponse && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                        <span className="text-[9px] font-bold text-stone-500 uppercase">Response</span>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${apiResponse.status === 200 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {apiResponse.status}
                                        </span>
                                    </div>
                                    <pre className="p-4 bg-white rounded-2xl text-[10px] font-mono text-stone-600 max-h-40 overflow-y-auto border border-stone-200 custom-scrollbar shadow-inner">
                                        {JSON.stringify(apiResponse.data, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-900 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 w-full p-3 text-slate-500 hover:text-red-400 transition-all hover:bg-red-500/5 rounded-xl"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-12">

                    <div className="flex justify-between items-center mb-10">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold text-sm uppercase tracking-widest"
                        >
                            <ChevronLeft size={16} strokeWidth={3} /> Back to Keys
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full border border-slate-200">
                                Key Context: {params.key?.toString().substring(0, 8) || 'Global'}...
                            </span>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Traffic Inspector</h2>
                        <p className="text-slate-500 mt-2 font-medium">Real-time visualization of HTTP requests and system health.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Ingested Logs', value: metadata.total_logs.toLocaleString(), icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Avg Latency', value: `${avgResponse}ms`, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Error Rate', value: `${Number(analytics.errorRate).toFixed(3)}%`, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                            { label: 'Primary Route', value: analytics.topEndpoint, icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50', truncate: true },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm">
                                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                                    <stat.icon size={20} />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className={`text-xl font-black text-slate-900 ${stat.truncate ? 'truncate' : ''}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm mb-8 flex flex-wrap gap-6 items-end">
                        <div className="flex-1 min-w-45 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <Filter size={12} strokeWidth={3} /> Status Filter
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none transition"
                            >
                                <option value="">All Status Codes</option>
                                <option value="200">200 - OK</option>
                                <option value="400">400 - Bad Request</option>
                                <option value="401">401 - Unauthorized</option>
                                <option value="404">404 - Not Found</option>
                                <option value="500">500 - Server Error</option>
                            </select>
                        </div>

                        <div className="flex-1 min-w-45 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <Calendar size={12} strokeWidth={3} /> Start Range
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none transition"
                            />
                        </div>

                        <div className="flex-1 min-w-45 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <Calendar size={12} strokeWidth={3} /> End Range
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none transition"
                            />
                        </div>

                        <button
                            onClick={() => { setStatusFilter(''); setStartDate(''); setEndDate(''); }}
                            className="px-6 py-3.5 text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>

                    <div className="bg-white rounded-4xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="font-bold text-slate-800 tracking-tight text-lg">Live HTTP Stream</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Page {metadata.page} of {metadata.total_pages}
                                </span>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button
                                        disabled={metadata.page <= 1 || loading}
                                        onClick={() => fetchLogs(metadata.page - 1)}
                                        className="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <ChevronLeft size={18} strokeWidth={3} />
                                    </button>
                                    <button
                                        disabled={metadata.page >= metadata.total_pages || loading}
                                        onClick={() => fetchLogs(metadata.page + 1)}
                                        className="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => fetchLogs(1)}
                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                >
                                    <RefreshCcw size={18} strokeWidth={2.5} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Method</th>
                                        <th className="px-8 py-5">Endpoint</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Latency</th>
                                        <th className="px-8 py-5 text-right">Occurrence</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center">
                                                <Loader2 className="animate-spin text-indigo-600 mx-auto" size={32} />
                                            </td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-32 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Activity size={40} className="text-slate-200" />
                                                    <p className="text-slate-400 font-bold tracking-tight">No traffic detected for the current parameters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log, index) => (
                                            <tr key={index} className="text-sm hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider ${log.method === 'GET' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                        }`}>
                                                        {log.method}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <code className="text-xs font-mono font-bold text-slate-600 bg-slate-100/50 px-2 py-1 rounded">
                                                        {log.endpoint}
                                                    </code>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`font-black text-base ${log.status_code >= 400 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                        {log.status_code}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-slate-400">
                                                        {log.response_time_ms ? `${log.response_time_ms}ms` : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-slate-800 font-bold text-xs italic">
                                                            {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'N/A'}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                                            {log.timestamp ? new Date(log.timestamp).toLocaleDateString() : ''}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}