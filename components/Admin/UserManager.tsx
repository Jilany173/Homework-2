
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { UserRole, Batch } from '../../types';

type ManagementTab = 'Admin' | 'Teacher' | 'Student' | 'Public';

interface ImportStudent {
  name: string;
  email: string;
  autoPassword?: string;
}

interface AddUserForm {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  batch_id?: string;
}

interface EditUserForm {
  id: string;
  username: string;
  role: UserRole;
  status: string;
}

const INITIAL_ADD_FORM: AddUserForm = {
  username: '',
  email: '',
  password: '',
  role: 'Admin',
  batch_id: '',
};

const INITIAL_EDIT_FORM: EditUserForm = {
  id: '',
  username: '',
  role: 'Student',
  status: 'Active',
};

const UserManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ManagementTab>('Admin');
  const [users, setUsers] = useState<any[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Import modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<1 | 2>(1);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [importPreview, setImportPreview] = useState<ImportStudent[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add User Modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState<AddUserForm>(INITIAL_ADD_FORM);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);

  // Edit User Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditUserForm>(INITIAL_EDIT_FORM);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Remove confirm
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (pError) throw pError;
      setUsers(profiles || []);

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

  useEffect(() => { fetchData(); }, []);

  const getRoleColor = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('admin')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (r.includes('moderator')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (r.includes('teacher')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const filteredUsers = users.filter(user => {
    const role = (user.role || '').toLowerCase();
    if (activeTab === 'Admin') return role.includes('admin') || role.includes('moderator');
    if (activeTab === 'Teacher') return role.includes('teacher');
    if (activeTab === 'Public') return role.includes('public_user') || role.includes('public');
    return role.includes('student');
  });

  // ── CSV Import ──────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1);
      const parsed: ImportStudent[] = lines
        .filter(l => l.trim())
        .map(l => {
          const [name, email] = l.split(',');
          return {
            name: name?.trim() || 'Unknown Student',
            email: email?.trim() || 'no-email@example.com',
            autoPassword: Math.floor(100000 + Math.random() * 900000).toString(),
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

  const resetImport = () => { setImportStep(1); setSelectedBatch(''); setImportPreview([]); };

  // ── Add User ─────────────────────────────────────────────────────────
  const openAddUserModal = () => {
    setAddUserForm(INITIAL_ADD_FORM);
    setAddUserError(null);
    setAddUserSuccess(null);
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setAddUserForm(INITIAL_ADD_FORM);
    setAddUserError(null);
    setAddUserSuccess(null);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);
    setAddUserSuccess(null);
    if (!addUserForm.username.trim() || !addUserForm.email.trim() || !addUserForm.password.trim()) {
      setAddUserError('Name, email and password are required.');
      return;
    }
    if (addUserForm.password.length < 6) {
      setAddUserError('Password must be at least 6 characters.');
      return;
    }

    const selectedRole = addUserForm.role;
    const selectedUsername = addUserForm.username.trim();
    const selectedEmail = addUserForm.email.trim();
    const selectedBatchId = addUserForm.batch_id;

    setAddUserLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: selectedEmail,
        password: addUserForm.password,
        options: { data: { username: selectedUsername, role: selectedRole } },
      });
      if (authError) throw authError;
      if (authData.user) {
        const userId = authData.user.id;
        const profilePayload: any = {
          id: userId,
          username: selectedUsername,
          role: selectedRole,
          status: 'Active',
          email: selectedEmail,
        };
        if (selectedRole === 'Student' && selectedBatchId) {
          profilePayload.batch_id = selectedBatchId;
        }
        await supabase.from('profiles').upsert(profilePayload);
        // Force-override any trigger default
        await supabase
          .from('profiles')
          .update({ role: selectedRole, username: selectedUsername, status: 'Active' })
          .eq('id', userId);

        setAddUserSuccess(`✅ "${selectedUsername}" added successfully!`);
        await fetchData();
        setTimeout(() => closeAddUserModal(), 3000);
      }
    } catch (error: any) {
      setAddUserError(error.message || 'Failed to create user. Please try again.');
    } finally {
      setAddUserLoading(false);
    }
  };

  // ── Edit User ────────────────────────────────────────────────────────
  const openEditModal = (user: any) => {
    setEditForm({
      id: user.id,
      username: user.username || '',
      role: user.role as UserRole,
      status: user.status || 'Active',
    });
    setEditError(null);
    setEditSuccess(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm(INITIAL_EDIT_FORM);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);
    if (!editForm.username.trim()) {
      setEditError('Username is required.');
      return;
    }
    setEditLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username.trim(),
          role: editForm.role,
          status: editForm.status,
        })
        .eq('id', editForm.id);
      if (error) throw error;
      setEditSuccess(`✅ "${editForm.username}" updated successfully!`);
      await fetchData();
      setTimeout(() => closeEditModal(), 2000);
    } catch (error: any) {
      setEditError(error.message || 'Failed to update user.');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Remove User ──────────────────────────────────────────────────────
  const handleRemoveUser = async (userId: string) => {
    setRemoveLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      await fetchData();
    } catch (error: any) {
      alert('Failed to remove user: ' + error.message);
    } finally {
      setRemoveLoading(false);
      setRemovingUserId(null);
    }
  };

  // ── Role options ─────────────────────────────────────────────────────
  const roleOptions: { value: UserRole; label: string; emoji: string }[] = [
    { value: 'Admin', label: 'Admin', emoji: '🛡️' },
    { value: 'Moderator', label: 'Moderator', emoji: '🔰' },
    { value: 'Teacher', label: 'Teacher', emoji: '👨‍🏫' },
    { value: 'Student', label: 'Student', emoji: '👤' },
  ];

  const statusOptions = ['Active', 'Expired', 'Pending'];

  // ── colSpan helper ───────────────────────────────────────────────────
  const colSpan = activeTab === 'Student' ? 6 : activeTab === 'Teacher' ? 6 : activeTab === 'Public' ? 5 : 5;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header ── */}
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

          {/* Add User — Admin tab only */}
          {activeTab === 'Admin' && (
            <button
              onClick={openAddUserModal}
              className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          )}

          {(activeTab === 'Student' || activeTab === 'Teacher') && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Import CSV
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm mb-8 w-fit">
        {(['Admin', 'Teacher', 'Student', 'Public'] as ManagementTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab
                ? tab === 'Public' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
          >
            {tab === 'Public' ? 'Public Users' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
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
                {activeTab === 'Teacher' && (
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                )}
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Registered</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* User Profile */}
                    <td className="px-8 py-5">
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
                    {/* Role */}
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    {/* Batch (Student) */}
                    {activeTab === 'Student' && (
                      <td className="px-8 py-5">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                          {user.batch_id || 'PENDING'}
                        </span>
                      </td>
                    )}
                    {/* Subject (Teacher) */}
                    {activeTab === 'Teacher' && (
                      <td className="px-8 py-5">
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                          {user.subject || '—'}
                        </span>
                      </td>
                    )}
                    {/* Status */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">{user.status}</span>
                      </div>
                    </td>
                    {/* Registered */}
                    <td className="px-8 py-5 text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(user)}
                          title="Edit User"
                          className="w-8 h-8 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z" />
                          </svg>
                        </button>
                        {/* Remove */}
                        {removingUserId === user.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleRemoveUser(user.id)}
                              disabled={removeLoading}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-60 transition-all"
                            >
                              {removeLoading ? '...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setRemovingUserId(null)}
                              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRemovingUserId(user.id)}
                            title="Remove User"
                            className="w-8 h-8 bg-red-50 border border-red-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={colSpan} className="py-24 text-center">
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

      {/* ==================== ADD USER MODAL ==================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={closeAddUserModal}></div>
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-emerald-50/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">
                    {addUserForm.role === 'Teacher' ? '👨‍🏫' : addUserForm.role === 'Student' ? '👤' : '🛡️'}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Add New User</h2>
                </div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Creates Auth Account + Profile</p>
              </div>
              <button onClick={closeAddUserModal} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Body */}
            <form onSubmit={handleAddUser} className="p-8 space-y-5">
              {/* Role */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAddUserForm(prev => ({ ...prev, role: opt.value }))}
                      className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${addUserForm.role === opt.value ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`}
                    >
                      <span className="text-lg">{opt.emoji}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Username */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name / Username</label>
                <input type="text" value={addUserForm.username} onChange={e => setAddUserForm(p => ({ ...p, username: e.target.value }))} placeholder="e.g. Rahim Uddin" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
              {/* Email */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input type="email" value={addUserForm.email} onChange={e => setAddUserForm(p => ({ ...p, email: e.target.value }))} placeholder="e.g. rahim@example.com" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
              {/* Password */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password (Min. 6 characters)</label>
                <input type="password" value={addUserForm.password} onChange={e => setAddUserForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 characters" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
              {/* Batch (Student only) */}
              {addUserForm.role === 'Student' && (
                <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Assign Batch (Optional)</label>
                  <select value={addUserForm.batch_id} onChange={e => setAddUserForm(p => ({ ...p, batch_id: e.target.value }))} className="w-full px-5 py-3.5 bg-white border border-blue-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 transition-all">
                    <option value="">No batch (assign later)</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.type})</option>)}
                  </select>
                </div>
              )}
              {/* Feedback */}
              {addUserError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <p className="text-xs font-bold text-red-700">{addUserError}</p>
                </div>
              )}
              {addUserSuccess && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-emerald-500 text-lg">✅</span>
                  <p className="text-xs font-bold text-emerald-700">{addUserSuccess}</p>
                </div>
              )}
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeAddUserModal} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={addUserLoading} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {addUserLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Creating...</>
                  ) : (
                    <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>Create User</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT USER MODAL ==================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={closeEditModal}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">✏️</span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Edit User</h2>
                </div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Update profile in Supabase</p>
              </div>
              <button onClick={closeEditModal} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Body */}
            <form onSubmit={handleEditUser} className="p-8 space-y-5">
              {/* Role */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, role: opt.value }))}
                      className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${editForm.role === opt.value ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`}
                    >
                      <span className="text-lg">{opt.emoji}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Username */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name / Username</label>
                <input type="text" value={editForm.username} onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
              {/* Status */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                <div className="flex gap-2">
                  {statusOptions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, status: s }))}
                      className={`flex-1 py-3 rounded-2xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${editForm.status === s ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`}
                    >
                      {s === 'Active' ? '🟢' : s === 'Expired' ? '🔴' : '🟡'} {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Feedback */}
              {editError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <p className="text-xs font-bold text-red-700">{editError}</p>
                </div>
              )}
              {editSuccess && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-emerald-500 text-lg">✅</span>
                  <p className="text-xs font-bold text-emerald-700">{editSuccess}</p>
                </div>
              )}
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeEditModal} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={editLoading} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {editLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</>
                  ) : (
                    <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== IMPORT MODAL ==================== */}
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
                    <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-500 transition-all">
                      <option value="">Select a batch...</option>
                      {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.type})</option>)}
                    </select>
                  </div>
                  <div onClick={() => selectedBatch && fileInputRef.current?.click()} className={`h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer ${selectedBatch ? 'border-slate-200 hover:border-blue-500 hover:bg-blue-50' : 'border-slate-100 bg-slate-50 opacity-40 grayscale cursor-not-allowed'}`}>
                    <span className="text-4xl mb-4">📥</span>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-900">Upload Excel / CSV File</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">Columns required: Name, Email</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv,.xlsx,.xls" />
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
                    <button onClick={finalizeImport} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-xl">Send Invites</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer info */}
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
