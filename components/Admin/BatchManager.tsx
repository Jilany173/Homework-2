
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Batch, User } from '../../types';

interface CreateBatchForm {
  name: string;
  type: 'HICU' | 'IELTS';
  startDate: string;
  endDate: string;
  teacherId: string;
  maxStudents: number;
}

const INITIAL_FORM: CreateBatchForm = {
  name: '',
  type: 'HICU',
  startDate: '',
  endDate: '',
  teacherId: '',
  maxStudents: 30,
};

const BATCH_TYPES: { value: 'HICU' | 'IELTS'; label: string; color: string; badge: string }[] = [
  {
    value: 'HICU',
    label: 'CD HICU',
    color: 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200',
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    value: 'IELTS',
    label: 'CD IELTS Premium',
    color: 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200',
    badge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
];

const getBadge = (type: string) =>
  type === 'HICU'
    ? 'bg-blue-50 text-blue-600 border-blue-100'
    : 'bg-indigo-50 text-indigo-600 border-indigo-100';

const getLabel = (type: string) =>
  type === 'HICU' ? 'CD HICU' : 'CD IELTS Premium';

const BatchManager: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateBatchForm>(INITIAL_FORM);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Student list modal
  const [isListOpen, setIsListOpen] = useState(false);
  const [activeBatchList, setActiveBatchList] = useState<Batch | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: bData } = await supabase.from('batches').select('*').order('created_at', { ascending: false });
      const { data: tData } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['Teacher', 'teacher']);
      setBatches(bData || []);
      setTeachers(tData as any || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Open student list
  const handleOpenList = async (batch: Batch) => {
    setActiveBatchList(batch);
    setIsListOpen(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('batch_id', batch.id);
    setEnrolledStudents(data || []);
  };

  // Open create modal (fresh)
  const openCreate = () => {
    setForm(INITIAL_FORM);
    setCreateError(null);
    setCreateSuccess(null);
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
    setForm(INITIAL_FORM);
    setCreateError(null);
    setCreateSuccess(null);
  };

  // Create batch
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!form.name.trim()) { setCreateError('Batch name is required.'); return; }
    if (!form.startDate) { setCreateError('Start date is required.'); return; }
    if (!form.endDate) { setCreateError('End date is required.'); return; }
    if (form.endDate <= form.startDate) { setCreateError('End date must be after start date.'); return; }

    setCreateLoading(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        maxStudents: form.maxStudents,
        currentStudents: 0,
        status: 'Active',
      };
      if (form.teacherId) payload.teacherId = form.teacherId;

      const { error } = await supabase.from('batches').insert(payload);
      if (error) throw error;

      setCreateSuccess(`✅ Batch "${form.name}" created successfully!`);
      await fetchData();
      setTimeout(() => closeCreate(), 2500);
    } catch (error: any) {
      setCreateError(error.message || 'Failed to create batch.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Batch Control Center</h1>
          <p className="text-slate-500 font-medium">Manage faculty assignments and student enrollment limits.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          Create New Batch
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.length > 0 ? (
                  batches.map((batch) => {
                    const teacher = teachers.find(t => t.id === batch.teacherId);
                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Name */}
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm">{batch.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {typeof batch.id === 'string' ? batch.id.substring(0, 8) : batch.id}...</span>
                          </div>
                        </td>
                        {/* Type */}
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getBadge(batch.type)}`}>
                            {getLabel(batch.type)}
                          </span>
                        </td>
                        {/* Duration */}
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">
                              {batch.startDate ? new Date(batch.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </span>
                            <span className="text-[9px] font-medium text-slate-400 mt-0.5">
                              → {batch.endDate ? new Date(batch.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </span>
                          </div>
                        </td>
                        {/* Teacher */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px]">👨‍🏫</div>
                            <span className="text-sm font-bold text-slate-700">{teacher?.username || 'Unassigned'}</span>
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${batch.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{batch.status}</span>
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleOpenList(batch)}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                            >
                              Students
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <span className="text-4xl mb-4">📦</span>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">No Batches Found</p>
                        <p className="text-[10px] font-medium mt-1 italic">Click "Create New Batch" to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== CREATE BATCH MODAL ==================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={closeCreate}></div>
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-between sticky top-0 z-10 bg-white">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">📦</span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Create New Batch</h2>
                </div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Saves directly to Supabase</p>
              </div>
              <button onClick={closeCreate} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleCreateBatch} className="p-8 space-y-6">

              {/* Batch Type */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Batch Program Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {BATCH_TYPES.map(bt => (
                    <button
                      key={bt.value}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, type: bt.value }))}
                      className={`py-4 px-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all font-black text-sm ${form.type === bt.value
                          ? bt.color
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                      <span className="text-xl">{bt.value === 'HICU' ? '🎓' : '📚'}</span>
                      <span className="text-[10px] uppercase tracking-widest">{bt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Batch Name */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Batch Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder={form.type === 'HICU' ? 'e.g. HICU Batch 12' : 'e.g. IELTS Premium June 2026'}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Start & End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                    min={form.startDate || undefined}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Max Students */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Max Students <span className="text-blue-500 normal-case font-bold">({form.maxStudents})</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={form.maxStudents}
                  onChange={e => setForm(p => ({ ...p, maxStudents: Number(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  <span>5</span><span>50</span><span>100</span>
                </div>
              </div>

              {/* Teacher Dropdown */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Assign Teacher</label>
                {teachers.length === 0 ? (
                  <div className="w-full px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-700">
                    ⚠️ No teachers found. Add teachers in User Management first.
                  </div>
                ) : (
                  <select
                    value={form.teacherId}
                    onChange={e => setForm(p => ({ ...p, teacherId: e.target.value }))}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option value="">— Select a teacher (optional) —</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        👨‍🏫 {(t as any).username || t.id}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Preview card */}
              {form.name && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Preview</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-900 text-sm">{form.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {form.startDate ? new Date(form.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '?'} → {form.endDate ? new Date(form.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '?'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getBadge(form.type)}`}>
                      {getLabel(form.type)}
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {createError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <span className="text-lg">⚠️</span>
                  <p className="text-xs font-bold text-red-700">{createError}</p>
                </div>
              )}
              {createSuccess && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-lg">✅</span>
                  <p className="text-xs font-bold text-emerald-700">{createSuccess}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreate}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Creating...</>
                  ) : (
                    <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>Create Batch</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== STUDENT LIST MODAL ==================== */}
      {isListOpen && activeBatchList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsListOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{activeBatchList.name}</h2>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Enrolled Students ({enrolledStudents.length})</p>
              </div>
              <button onClick={() => setIsListOpen(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 max-h-[500px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100">
                  <tr>
                    <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                    <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {enrolledStudents.length > 0 ? (
                    enrolledStudents.map(s => (
                      <tr key={s.id}>
                        <td className="py-4 font-bold text-slate-900 text-sm">{s.username}</td>
                        <td className="py-4 text-xs font-black text-slate-400">{s.id.substring(0, 8)}</td>
                        <td className="py-4 text-right text-[10px] font-black text-slate-400 uppercase">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-20 text-center italic text-slate-400 font-medium">No students enrolled in this batch.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManager;
