'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Clock, Activity, Zap, ChevronRight, AlertCircle, LogOut, Filter, Calendar, AlertTriangle, Globe } from 'lucide-react';
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
                setError("Rate limit exceeded (429). Please reset your API usage in the database.");
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
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium"
                >
                    <ChevronLeft size={20} /> Back to Keys
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition shadow-sm font-semibold text-sm"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="mb-8">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight text-left">Request Logs</h2>
                <p className="text-gray-500 font-mono text-sm mt-2 bg-gray-100 w-fit px-3 py-1 rounded-full border border-gray-200">
                    Key: {params.key?.toString() || 'Global View'}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-pulse">
                    <AlertCircle size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

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

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-6 items-end">
                <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Filter size={12} /> Status Code
                    </label>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition"
                    >
                        <option value="">All Statuses</option>
                        <option value="200">200 OK</option>
                        <option value="400">400 Bad Request</option>
                        <option value="401">401 Unauthorized</option>
                        <option value="404">404 Not Found</option>
                        <option value="500">500 Server Error</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Calendar size={12} /> Start Date
                    </label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                </div>

                <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Calendar size={12} /> End Date
                    </label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                </div>

                <button 
                    onClick={() => { setStatusFilter(''); setStartDate(''); setEndDate(''); }}
                    className="px-6 py-2.5 text-gray-400 hover:text-gray-900 text-xs font-black uppercase tracking-widest transition mb-1"
                >
                    Clear Filters
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 font-bold flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2 text-gray-800">
                        <Clock size={18} className="text-orange-500" /> Live HTTP Traffic
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Page {metadata.page} / {metadata.total_pages}
                        </span>
                        <div className="flex border rounded-xl overflow-hidden shadow-sm">
                            <button
                                disabled={metadata.page <= 1 || loading}
                                onClick={() => fetchLogs(metadata.page - 1)}
                                className="p-2 bg-white hover:bg-gray-50 disabled:opacity-30 border-r transition"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                disabled={metadata.page >= metadata.total_pages || loading}
                                onClick={() => fetchLogs(metadata.page + 1)}
                                className="p-2 bg-white hover:bg-gray-50 disabled:opacity-30 transition"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
                            <tr>
                                <th className="px-8 py-4">Method</th>
                                <th className="px-8 py-4">Endpoint</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Latency</th>
                                <th className="px-8 py-4 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-gray-400 font-medium">
                                        No traffic detected for this API key.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, index) => (
                                    <tr key={index} className="text-sm hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-8 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                                                log.method === 'GET' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                                {log.method}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 font-mono text-xs text-gray-600">
                                            {log.endpoint}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`font-bold ${log.status_code >= 400 ? 'text-red-500' : 'text-green-600'}`}>
                                                {log.status_code}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-gray-400">
                                            {log.response_time_ms ? `${log.response_time_ms}ms` : '-'}
                                        </td>
                                        <td className="px-8 py-4 text-right text-gray-400 font-mono text-[11px]">
                                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}