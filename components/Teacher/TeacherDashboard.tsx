
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Batch } from '../../types';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showBestStudentModal, setShowBestStudentModal] = useState(false);
  const [assignedBatches, setAssignedBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentTeacherId = localStorage.getItem('currentUserId');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // টিচারের ব্যাচগুলো নিয়ে আসা
      const { data: bData } = await supabase
        .from('batches')
        .select('*')
        .eq('teacher_id', currentTeacherId);
      
      setAssignedBatches(bData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentTeacherId) fetchData();
  }, [currentTeacherId]);

  const handleOpenAwardModal = async (batchId: string) => {
    setShowBestStudentModal(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('batch_id', batchId);
    setStudents(data || []);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Faculty Dashboard</h1>
          <p className="text-slate-500 font-medium italic">Showing batches assigned to you in Supabase.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Teacher Account</p>
              <p className="text-sm font-bold text-blue-600 uppercase">Authenticated</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">👨‍🏫</div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : assignedBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {assignedBatches.map((batch) => (
            <div key={batch.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${batch.type === 'HICU' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {batch.type}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">ID: {batch.id}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{batch.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Course Session Active</p>
              </div>

              <div className="flex gap-3">
                  <button 
                    onClick={() => handleOpenAwardModal(batch.id)}
                    className="flex-1 py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-100 hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🏆 Best Student</span>
                  </button>
                  <button 
                    onClick={() => navigate('/teacher/class-control', { state: { batchId: batch.id, batchName: batch.name } })}
                    className="flex-[1.5] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all"
                  >
                    Conduct Class
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-200 text-center shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🗓️</div>
           <h3 className="text-xl font-black text-slate-900 uppercase">No Batches Assigned</h3>
           <p className="text-slate-500 font-medium mt-2 italic">Contact Admin to assign you to a batch in the database.</p>
        </div>
      )}

      {showBestStudentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowBestStudentModal(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
             <div className="p-10 border-b border-slate-100 bg-amber-50/50 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-amber-200">🏆</div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Best Student Award</h2>
                <p className="text-slate-500 font-medium mt-2 italic">Select from your actual enrolled students.</p>
             </div>
             
             <div className="p-10 space-y-4 max-h-[400px] overflow-y-auto">
                {students.length > 0 ? (
                  students.map((student) => (
                    <button 
                      key={student.id}
                      onClick={() => {
                        alert(`${student.username} has been awarded!`);
                        setShowBestStudentModal(false);
                      }}
                      className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-white hover:border-amber-400 border border-slate-100 rounded-[2rem] transition-all group"
                    >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl group-hover:scale-110 transition-transform">👤</div>
                          <div>
                              <p className="font-black text-slate-900">{student.username}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID: {student.id.substring(0,6)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-amber-600 uppercase tracking-widest">Select</p>
                        </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-400 italic">No students found in this batch.</p>
                )}
             </div>
             
             <div className="p-8 border-t border-slate-100 flex justify-center">
                <button onClick={() => setShowBestStudentModal(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Close</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
