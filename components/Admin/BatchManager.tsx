
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Batch, User, StudentProgress } from '../../types';

const BatchManager: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [activeBatchList, setActiveBatchList] = useState<Batch | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);

  // ডাটা ফেচ করা
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: bData } = await supabase.from('batches').select('*');
      const { data: tData } = await supabase.from('profiles').select('*').in('role', ['Teacher', 'teacher']);
      
      setBatches(bData || []);
      setTeachers(tData as any || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenList = async (batch: Batch) => {
    setActiveBatchList(batch);
    setIsListOpen(true);
    
    // রিয়েল স্টুডেন্ট ফেচ করা
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('batch_id', batch.id);
    
    setEnrolledStudents(data || []);
  };

  const handleOpenEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setIsModalOpen(true);
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Functionality to create/update batches via UI will be added in the next update. Please use Table Editor for now.");
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Batch Control Center</h1>
          <p className="text-slate-500 font-medium">Manage faculty assignments and student enrollment limits.</p>
        </div>
        <button 
          onClick={() => { setEditingBatch(null); setIsModalOpen(true); }}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4"/></svg>
          Create New Batch
        </button>
      </div>

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
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.length > 0 ? (
                  batches.map((batch) => {
                    const teacher = teachers.find(t => t.id === batch.teacherId);
                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-sm">{batch.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {batch.id}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${batch.type === 'HICU' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                            {batch.type}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px]">👨‍🏫</div>
                            <span className="text-sm font-bold text-slate-700">{teacher?.username || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleOpenList(batch)}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                            >
                              Students
                            </button>
                            <button 
                              onClick={() => handleOpenEdit(batch)}
                              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 italic font-medium">No batches found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student List Modal */}
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
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
                        enrolledStudents.map((student) => (
                           <tr key={student.id}>
                              <td className="py-4 font-bold text-slate-900 text-sm">{student.username}</td>
                              <td className="py-4 text-xs font-black text-slate-400">{student.id.substring(0, 8)}</td>
                              <td className="py-4 text-right text-[10px] font-black text-slate-400 uppercase">
                                 {new Date(student.created_at).toLocaleDateString()}
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

      {/* Edit Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 p-10 text-center">
             <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Batch Settings</h2>
             <p className="text-slate-500 mb-8 italic">Please use the Supabase 'batches' table editor to create or modify batch information. UI controls are coming in the next release.</p>
             <button onClick={() => setIsModalOpen(false)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManager;
