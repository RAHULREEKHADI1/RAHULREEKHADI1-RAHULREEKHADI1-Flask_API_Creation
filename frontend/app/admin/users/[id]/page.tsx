'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ChevronLeft, Clock, Activity, Zap, AlertTriangle, 
    Globe, BarChart3 
} from 'lucide-react';
import { authorizedFetch } from '@/utils/api';

export default function AdminUserLogsPage() {
    const params = useParams();
    const router = useRouter();
    const [logs, setLogs] = useState([]);
    const [metadata, setMetadata] = useState({ total_logs: 0, page: 1, total_pages: 1 });
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        totalRequests: 0,
        errorRate: 0,
        topEndpoint: 'N/A'
    });

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
        } catch (err) {
            console.error("Analytics fetch error:", err);
        }
    }, [params.id]);

    const fetchLogs = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/logs/?user_id=${params.id}&page=${pageNumber}`;
        
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
            console.error("Fetch logs error:", err);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => { 
        fetchLogs(1); 
        fetchAnalytics();
    }, [fetchLogs, fetchAnalytics]);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-gray-500 mb-6 font-medium hover:text-gray-900 transition"
            >
                <ChevronLeft size={20} /> Back to Users
            </button>

            <div className="mb-8 text-left">
                <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">User Activity Logs</h2>
                    <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Admin View</span>
                </div>
                <p className="text-gray-500 font-mono text-sm mt-2 bg-gray-100 w-fit px-3 py-1 rounded-full border border-gray-200">
                    Inspecting User ID: {params.id}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 text-left">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><BarChart3 size={24} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lifetime Requests</p>
                        <p className="text-2xl font-black text-gray-900">{analytics.totalRequests.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 text-left">
                    <div className="bg-red-50 p-3 rounded-2xl text-red-600"><AlertTriangle size={24} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Error Rate</p>
                        <p className="text-2xl font-black text-gray-900">{analytics.errorRate}%</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 text-left">
                    <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><Globe size={24} /></div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Most Active Route</p>
                        <p className="text-lg font-black text-gray-900 truncate">{analytics.topEndpoint}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 font-bold flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2 text-gray-800">
                        <Clock size={18} className="text-orange-500" /> Historical Traffic
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">
                            Page {metadata.page} of {metadata.total_pages}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                disabled={metadata.page <= 1 || loading}
                                onClick={() => fetchLogs(metadata.page - 1)}
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 transition"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button 
                                disabled={metadata.page >= metadata.total_pages || loading}
                                onClick={() => fetchLogs(metadata.page + 1)}
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 transition"
                            >
                                <ChevronLeft size={18} className="rotate-180" />
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
                                <th className="px-8 py-4 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={4} className="p-10 text-center animate-pulse text-gray-400 font-medium">Loading logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-medium">No activity logs found for this user.</td></tr>
                            ) : (
                                logs.map((log: any, i) => (
                                    <tr key={i} className="text-sm hover:bg-gray-50/80 transition-colors">
                                        <td className="px-8 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black ${log.method === 'GET' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                                {log.method}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 font-mono text-xs text-gray-600">{log.endpoint}</td>
                                        <td className={`px-8 py-4 font-bold ${log.status_code >= 400 ? 'text-red-500' : 'text-green-600'}`}>
                                            {log.status_code}
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