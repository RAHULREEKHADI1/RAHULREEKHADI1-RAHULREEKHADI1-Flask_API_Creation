'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Shield, Plus, RefreshCw, Power, Copy, CheckCircle, Loader2, LogOut, AlertTriangle, X, Search, SlidersHorizontal, BarChart3 } from 'lucide-react';
import { authorizedFetch } from '@/utils/api';

interface ApiKey {
  id: number;
  client_name: string;
  key: string;
  is_active: boolean;
}

export default function ApiDashboard() {
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: 'toggle' | 'regenerate';
    id: number | null;
    active?: boolean;
    clientName?: string;
    newKey?: string;
  }>({ show: false, type: 'toggle', id: null });

  const fetchKeys = useCallback(async () => {
    try {
      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/client/api/keys`);
      if (res.ok) {
        const data = await res.json();
        setKeys(Array.isArray(data) ? data : []);
      } else {
        setKeys([]);
      }
    } catch (err) {
      console.error(err);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  // STRICT REAL-TIME FILTERING
  const processedKeys = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return keys;

    return keys
      .filter(k => k.client_name.toLowerCase().includes(query))
      .sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1));
  }, [keys, searchQuery]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleCreate = async () => {
    if (!newClientName) return;
    try {
      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/client/api/keys`, {
        method: 'POST',
        body: JSON.stringify({ name: newClientName })
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewClientName('');
        await fetchKeys();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const executeToggle = async () => {
    const { id } = confirmModal;
    if (id === null) return;
    try {
      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/client/api/keys/${id}/toggle`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setConfirmModal({ ...confirmModal, show: false });
        await fetchKeys();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const executeRegenerate = async () => {
    const { id } = confirmModal;
    if (id === null) return;
    try {
      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/client/api/keys/${id}/regenerate`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.new_api_key) {
        setConfirmModal({ ...confirmModal, newKey: data.new_api_key });
        await fetchKeys();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900">
      <aside className="w-72 bg-slate-950 text-white p-8 flex flex-col border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">API Guard</h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3 bg-indigo-600/10 text-indigo-400 p-3.5 rounded-xl font-semibold transition-all border border-indigo-500/20 shadow-sm cursor-default">
            <Key size={18} /> API Management
          </div>
          <div className="flex items-center gap-3 text-slate-600 p-3.5 rounded-xl font-medium transition-all cursor-not-allowed opacity-50 select-none">
            <BarChart3 size={18} /> Request Logs
          </div>
        </nav>

        <button 
          onClick={handleLogout} 
          className="group flex items-center gap-3 p-4 text-slate-500 hover:text-red-400 transition-all border-t border-slate-900 mt-8 hover:bg-red-500/5 rounded-xl"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-12">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">API Credentials</h2>
              <p className="text-slate-500 mt-2 font-medium">Manage and secure access keys for your integration ecosystem.</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2.5 font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={20} strokeWidth={3} /> Create Key
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search clients..."
                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-slate-600 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <X size={16} strokeWidth={3} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-500 font-bold text-sm shadow-sm">
              <SlidersHorizontal size={16} />
              <span>{processedKeys.length} <span className="text-slate-400 font-medium lowercase">Total</span></span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Key</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedKeys.length > 0 ? (
                  processedKeys.map((k) => (
                    <tr key={k.id} className={`group transition-colors ${!k.is_active ? 'bg-slate-50/30' : 'hover:bg-slate-50/30'}`}>
                      <td className="px-8 py-6">
                        <span className={`font-bold transition-colors ${k.is_active ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                          {k.client_name}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <code className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-opacity ${k.is_active ? 'bg-slate-50 text-slate-500 border-slate-200/60' : 'bg-slate-100 text-slate-300 border-slate-200 opacity-50'}`}>
                            {k.is_active ? k.key.substring(0, 12) + '...' : '••••••••••••••••'}
                          </code>
                          <button onClick={() => copyToClipboard(k.key)} className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors">
                            {copiedKey === k.key ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${k.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-200/50 text-slate-400 border border-slate-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${k.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-400'}`} />
                          {k.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => router.push(`/dashboard/logs/${k.key}`)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Logs"
                          >
                            <BarChart3 size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'toggle', id: k.id, active: k.is_active, clientName: k.client_name })}
                            className={`p-2.5 rounded-xl transition-all ${k.is_active ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                          >
                            <Power size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'regenerate', id: k.id, clientName: k.client_name })}
                            className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                          >
                            <RefreshCw size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-24 text-center">
                        <div className="bg-slate-50 p-4 rounded-3xl w-fit mx-auto mb-4 text-slate-200">
                          <Search size={32} />
                        </div>
                        <p className="text-slate-900 font-bold">No results found matching "{searchQuery}"</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals remain same as previous version */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Generate Key</h3>
            <p className="text-slate-500 font-medium mb-8">Provision a new credential for your application.</p>
            <div className="space-y-4 mb-8 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Client Identity</label>
              <input
                type="text"
                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold"
                placeholder="e.g. Production Web"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleCreate} className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg transition-all">Generate</button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            {confirmModal.newKey ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Key Regenerated</h3>
                <p className="text-slate-500 font-medium mb-8 px-8 text-center">Please copy your new key. It will not be shown again.</p>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between mb-8 overflow-hidden">
                  <code className="text-indigo-400 font-bold break-all text-left text-sm font-mono">{confirmModal.newKey}</code>
                  <button onClick={() => copyToClipboard(confirmModal.newKey!)} className="ml-4 p-3 bg-white/5 rounded-xl text-indigo-400">
                    {copiedKey === confirmModal.newKey ? <CheckCircle size={20} className="text-emerald-500" /> : <Copy size={20} />}
                  </button>
                </div>
                <button onClick={() => setConfirmModal({ show: false, type: 'toggle', id: null })} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl">Done</button>
              </div>
            ) : (
              <div className="py-2 text-left">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${confirmModal.type === 'regenerate' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {confirmModal.type === 'regenerate' ? <AlertTriangle size={32} /> : <Power size={32} />}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{confirmModal.type === 'regenerate' ? 'Regenerate API Key' : `${confirmModal.active ? 'Disable' : 'Enable'} Access`}</h3>
                <p className="text-slate-500 font-medium mb-10">Confirm security action for <span className="text-slate-950 font-bold italic">"{confirmModal.clientName}"</span>?</p>
                <div className="flex gap-4">
                  <button onClick={() => setConfirmModal({ show: false, type: 'toggle', id: null })} className="flex-1 px-4 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 transition-all">Cancel</button>
                  <button onClick={confirmModal.type === 'regenerate' ? executeRegenerate : executeToggle} className={`flex-1 px-4 py-4 text-white rounded-2xl font-bold shadow-lg transition-all ${confirmModal.type === 'regenerate' ? 'bg-amber-600' : 'bg-indigo-600'}`}>Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}