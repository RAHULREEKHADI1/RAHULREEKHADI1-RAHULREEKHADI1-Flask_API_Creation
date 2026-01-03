'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Activity, ChevronRight, LogOut, Search, X, BarChart2 } from 'lucide-react';
import { authorizedFetch } from '@/utils/api';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const fetchUsers = useCallback(async () => {
        try {
            const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (err) {
            console.error("Admin user fetch failed:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const processedUsers = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return users;

        return users.filter((u: any) => 
            u.name.toLowerCase().includes(query) || 
            u.email.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    const filteredStats = useMemo(() => {
        return {
            count: processedUsers.length,
            totalRequests: processedUsers.reduce((acc: number, u: any) => acc + (u.total_requests || 0), 0)
        };
    }, [processedUsers]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">System Admin</h2>
                    <p className="text-gray-500 font-medium">Manage users and global API traffic</p>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-gray-600 hover:text-red-600 transition shadow-sm font-bold"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><Users size={24} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filtered Users</p>
                        <p className="text-2xl font-black text-gray-900">{filteredStats.count}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><Activity size={24} /></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filtered Hits</p>
                        <p className="text-2xl font-black text-gray-900">
                            {filteredStats.totalRequests.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex items-center gap-4 text-white">
                    <div className="bg-white/10 p-3 rounded-2xl text-indigo-400"><BarChart2 size={24} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total System Users</p>
                        <p className="text-2xl font-black">{users.length}</p>
                    </div>
                </div>
            </div>

            <div className="relative mb-6 group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search name or email..."
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-gray-600 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
                        <tr>
                            <th className="px-8 py-4">User Identity</th>
                            <th className="px-8 py-4 text-center">Requests</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {processedUsers.length > 0 ? (
                            processedUsers.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col text-left">
                                            <span className="font-bold text-gray-900">{user.name}</span>
                                            <span className="text-xs text-gray-400 font-mono">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        <span className="font-mono font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {user.total_requests || 0}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button 
                                            onClick={() => router.push(`/admin/users/${user.id}`)}
                                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all active:scale-95"
                                        >
                                            Inspect <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="bg-gray-100 p-4 rounded-full text-gray-300">
                                            <Search size={32} />
                                        </div>
                                        <p className="text-gray-900 font-bold">No results found</p>
                                        <p className="text-gray-400 text-sm">No user matches the criteria "{searchQuery}"</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}