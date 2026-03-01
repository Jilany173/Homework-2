
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { User, UserRole, Batch } from '../../types';

type ManagementTab = 'Admin' | 'Teacher' | 'Student';

interface ImportStudent {
  name: string;
  email: string;
  autoPassword?: string;
}

const UserManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ManagementTab>('Admin');
  const [users, setUsers] = useState<any[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<1 | 2>(1);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [importPreview, setImportPreview] = useState<ImportStudent[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ১. সুপাবেস থেকে ডাটা ফেচ করা
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // ইউজার প্রোফাইল ফেচ করা
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (pError) throw pError;
      setUsers(profiles || []);

      // ব্যাচ লিস্ট ফেচ করা (ইমপোর্ট করার সময় দরকার হবে)
      const { data: batchList, error: bError } = await supabase
        .from('batches')
        .select('*');

      if (bError) throw bError;
      setBatches(batchList || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRoleColor = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('admin')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (r.includes('moderator')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (r.includes('teacher')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  // ট্যাব অনুযায়ী ইউজার ফিল্টার করা
  const filteredUsers = users.filter(user => {
    const role = user.role.toLowerCase();
    if (activeTab === 'Admin') {
      return role.includes('admin') || role.includes('moderator');
    }
    if (activeTab === 'Teacher') {
      return role.includes('teacher');
    }
    return role.includes('student');
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1);
      const parsed: ImportStudent[] = lines
        .filter(line => line.trim())
        .map(line => {
          const [name, email] = line.split(',');
          return {
            name: name?.trim() || 'Unknown Student',
            email: email?.trim() || 'no-email@example.com',
            autoPassword: Math.floor(100000 + Math.random() * 900000).toString()
          };
        });
      
      setImportPreview(parsed);
      setImportStep(2);
    };
    reader.readAsText(file);
  };

  const finalizeImport = async () => {
    alert("Bulk creation requires Supabase Auth Admin API. For now, please use the 'Invite User' feature in Supabase Dashboard.");
    setIsImportModalOpen(false);
    resetImport();
  };

  const resetImport = () => {
    setImportStep(1);
    setSelectedBatch('');
    setImportPreview([]);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">User Management</h1>
          <p className="text-slate-500 font-medium">Real-time control of your Supabase database users.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            title="Refresh Data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {activeTab === 'Student' && (
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              Import CSV
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm mb-8 w-fit">
        {(['Admin', 'Teacher', 'Student'] as ManagementTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              activeTab === tab 
              ? 'bg-slate-900 text-white shadow-lg' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Supabase...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                {activeTab === 'Student' && (
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                )}
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg border border-slate-200">
                            {user.role.toLowerCase().includes('admin') ? '🛡️' : user.role.toLowerCase().includes('teacher') ? '👨‍🏫' : '👤'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm leading-none">{user.username || 'No Name'}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {user.id.substring(0, 8)}...</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                          {user.role}
                       </span>
                    </td>
                    {activeTab === 'Student' && (
                      <td className="px-8 py-6">
                         <span className="text-xs font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                           {user.batch_id || 'PENDING'}
                         </span>
                      </td>
                    )}
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">{user.status}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">
                         {new Date(user.created_at).toLocaleDateString()}
                       </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'Student' ? 5 : 4} className="py-24 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <span className="text-4xl mb-4">🔍</span>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">No {activeTab}s Found</p>
                      <p className="text-[10px] font-medium mt-1 italic">Make sure users exist in the 'profiles' table.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => { setIsImportModalOpen(false); resetImport(); }}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
             <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Bulk Import Students</h2>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Step {importStep} of 2</p>
                </div>
                <button onClick={() => { setIsImportModalOpen(false); resetImport(); }} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>

             <div className="p-10">
               {importStep === 1 ? (
                 <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Target Batch Assignment</label>
                      <select 
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="">Select a batch...</option>
                        {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.type})</option>)}
                      </select>
                    </div>

                    <div 
                      onClick={() => selectedBatch && fileInputRef.current?.click()}
                      className={`h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer ${selectedBatch ? 'border-slate-200 hover:border-blue-500 hover:bg-blue-50' : 'border-slate-100 bg-slate-50 opacity-40 grayscale cursor-not-allowed'}`}
                    >
                       <span className="text-4xl mb-4">📥</span>
                       <p className="text-xs font-black uppercase tracking-widest text-slate-900">Upload Excel / CSV File</p>
                       <p className="text-[10px] font-medium text-slate-400 mt-1">Columns required: Name, Email</p>
                       <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden" 
                        accept=".csv,.xlsx,.xls"
                       />
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Previewing {importPreview.length} New Accounts</h3>
                       <button onClick={() => setImportStep(1)} className="text-[10px] font-bold text-blue-600 hover:underline">Change File</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto rounded-2xl border border-slate-100">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                          <tr>
                            <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                            <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {importPreview.map((s, idx) => (
                            <tr key={idx}>
                              <td className="px-5 py-3 text-xs font-bold text-slate-900">{s.name}</td>
                              <td className="px-5 py-3 text-xs text-slate-500">{s.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={resetImport} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200">Discard</button>
                      <button onClick={finalizeImport} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-200">Send Invites</button>
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 flex items-center gap-3 px-6 py-4 bg-slate-100 rounded-2xl border border-slate-200/50">
         <span className="text-sm">ℹ️</span>
         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
           Connected to project <span className="text-blue-600 font-black tracking-widest">admixgvilswxopjjwqdc</span>. Showing total <span className="text-slate-900">{users.length}</span> active profiles.
         </p>
      </div>
    </div>
  );
};

export default UserManager;
