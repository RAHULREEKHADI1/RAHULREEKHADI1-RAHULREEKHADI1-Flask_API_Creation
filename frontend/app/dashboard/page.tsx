'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Shield, Plus, RefreshCw, Power, Copy, CheckCircle, Loader2, LogOut, AlertTriangle, X, Eye, BarChart3, ArrowRight } from 'lucide-react';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const [viewingDetails, setViewingDetails] = useState<ApiKey | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: 'toggle' | 'regenerate';
    id: number | null;
    active?: boolean;
    clientName?: string;
    newKey?: string;
  }>({ show: false, type: 'toggle', id: null });

  const fetchKeys = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/client/api/keys`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

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
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const handleCreate = async () => {
    if (!newClientName) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/client/api/keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
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
    const token = localStorage.getItem('access_token');
    if (!token || id === null) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/client/api/keys/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
    const token = localStorage.getItem('access_token');
    if (!token || id === null) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/client/api/keys/${id}/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-8">
          <Shield className="text-blue-400" /> API Guard
        </h1>
        <nav className="flex flex-col gap-4 flex-1">
          <div className="bg-blue-600 p-3 rounded-lg flex items-center gap-2 cursor-pointer shadow-md">
            <Key size={20} /> API Keys
          </div>
        </nav>
        <button onClick={handleLogout} className="mt-auto flex items-center gap-2 p-3 text-slate-400 hover:text-red-400 transition-colors border-t border-slate-800 pt-6">
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">API Key Management</h2>
            <p className="text-gray-500">Create and manage access keys for your applications.</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition active:scale-95">
            <Plus size={20} /> Create New Key
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Total Keys</p>
            <p className="text-3xl font-bold text-slate-900">{keys.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Active Keys</p>
            <p className="text-3xl font-bold text-green-600">{keys.filter(k => k.is_active).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Client Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">API Key</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {keys.length > 0 ? (
                keys.map((k) => (
                  <tr 
                    key={k.id} 
                    className="hover:bg-gray-50 transition cursor-pointer group"
                    onClick={() => setViewingDetails(k)} // Open Detail Modal on row click
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{k.client_name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded border border-gray-200 w-fit">
                        {k.is_active ? k.key.substring(0, 10) + '...' : '••••••••••••••••'}
                        <button onClick={(e) => { e.stopPropagation(); copyToClipboard(k.key); }} className="text-gray-400 hover:text-blue-500 transition">
                          {copiedKey === k.key ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${k.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {k.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                      {/* Navigate directly to logs icon */}
                      <button
                        onClick={() => router.push(`/dashboard/logs/${k.key}`)}
                        className="p-2 rounded-lg border border-gray-100 hover:bg-blue-50 text-blue-600 transition"
                        title="View Logs"
                      >
                        <BarChart3 size={18} />
                      </button>
                      <button
                        onClick={() => setConfirmModal({ show: true, type: 'toggle', id: k.id, active: k.is_active, clientName: k.client_name })}
                        className={`p-2 rounded-lg border transition ${k.is_active ? 'hover:bg-red-50 text-red-600 border-red-100' : 'hover:bg-green-50 text-green-600 border-green-100'}`}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        onClick={() => setConfirmModal({ show: true, type: 'regenerate', id: k.id, clientName: k.client_name })}
                        className="p-2 rounded-lg border border-blue-100 hover:bg-blue-50 text-blue-600 transition"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">No keys available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- NEW DETAIL MODAL --- */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-[60]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                 <Eye size={24} />
               </div>
               <button onClick={() => setViewingDetails(null)} className="text-gray-400 hover:text-gray-600">
                 <X size={24} />
               </button>
            </div>
            
            <h3 className="text-xl font-bold mb-1">Key Details</h3>
            <p className="text-gray-500 text-sm mb-6">Client: <span className="font-semibold text-gray-800">{viewingDetails.client_name}</span></p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 font-mono text-xs text-blue-600 break-all">
              {viewingDetails.key}
            </div>

            <button 
              onClick={() => router.push(`/dashboard/logs/${viewingDetails.key}`)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 group"
            >
              See Request Logs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Your existing showCreateModal and confirmModal remain unchanged below */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Create New API Key</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Mobile App"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
              <button onClick={handleCreate} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md">Generate</button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[450px] relative animate-in fade-in zoom-in duration-200">
            {!confirmModal.newKey && (
              <button 
                onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}

            {confirmModal.newKey ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Key Regenerated!</h3>
                <p className="text-gray-500 mb-6 text-sm">Please copy your new key now. You won't be able to see it again.</p>
                <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-lg flex items-center justify-between mb-6">
                  <code className="text-blue-600 font-bold break-all">{confirmModal.newKey}</code>
                  <button onClick={() => copyToClipboard(confirmModal.newKey!)} className="ml-4 p-2 text-gray-500 hover:text-blue-600">
                    {copiedKey === confirmModal.newKey ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
                <button 
                  onClick={() => setConfirmModal({ show: false, type: 'toggle', id: null })}
                  className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'regenerate' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                  {confirmModal.type === 'regenerate' ? <AlertTriangle size={24} /> : <Power size={24} />}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {confirmModal.type === 'regenerate' ? 'Regenerate API Key' : `${confirmModal.active ? 'Disable' : 'Enable'} API Key`}
                </h3>
                <p className="text-gray-500 mb-6 text-sm">
                  {confirmModal.type === 'regenerate' 
                    ? `Are you sure you want to regenerate the key for "${confirmModal.clientName}"? The current key will stop working immediately.`
                    : `Are you sure you want to ${confirmModal.active ? 'disable' : 'enable'} access for "${confirmModal.clientName}"?`
                  }
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmModal({ ...confirmModal, show: false })} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium">
                    Cancel
                  </button>
                  <button 
                    onClick={confirmModal.type === 'regenerate' ? executeRegenerate : executeToggle}
                    className={`flex-1 px-4 py-2 text-white rounded-lg font-medium shadow-md ${confirmModal.type === 'regenerate' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}