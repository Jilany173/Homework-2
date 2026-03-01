
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { StudentProgress } from '../../types';

const ClassControl: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { batchId, batchName } = location.state || { batchId: 'N/A', batchName: 'Standard Group' };

  const [course, setCourse] = useState('ielts');
  const [day, setDay] = useState(1);
  const [secretCode, setSecretCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isClassStarted, setIsClassStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [unlockedModules, setUnlockedModules] = useState<Record<string, boolean>>({
    Speaking: false, Listening: false, Reading: false, Writing: false
  });

  // Real students from Supabase
  const [studentActivity, setStudentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (batchId === 'N/A') navigate('/teacher');
  }, [batchId, navigate]);

  const loadAttendanceAndStudents = async () => {
    setIsLoading(true);
    try {
      // ১. ডাটাবেস থেকে ওই ব্যাচের সব স্টুডেন্ট নিয়ে আসা
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('batch_id', batchId)
        .in('role', ['Student', 'student']);

      if (error) throw error;

      // ২. বর্তমান দিনের অ্যাটেনডেন্স স্ট্যাটাস চেক করা (LocalStorage বা DB থেকে)
      const updatedList = (profiles || []).map(s => {
        const attendanceKey = `attendance_${batchId}_day_${day}_${s.id}`;
        return { 
          ...s, 
          userId: s.id, // For compatibility with UI
          isPresentToday: localStorage.getItem(attendanceKey) === 'true',
          overallPercentage: 0 // This can be calculated later
        };
      });

      setStudentActivity(updatedList);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const key = `class_unlock_${course}_day_${day}`;
    const saved = localStorage.getItem(key);
    if (saved) setUnlockedModules(JSON.parse(saved));
    
    const startKey = `class_started_${batchId}_day_${day}`;
    setIsClassStarted(localStorage.getItem(startKey) === 'true');

    const codeKey = `secret_code_${batchId}_day_${day}`;
    const expiryKey = `secret_code_expiry_${batchId}_day_${day}`;
    
    const savedCode = localStorage.getItem(codeKey);
    const savedExpiry = localStorage.getItem(expiryKey);
    
    if (savedCode && savedExpiry) {
      const remaining = Math.round((parseInt(savedExpiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setSecretCode(savedCode);
        setTimeLeft(remaining);
        setVerificationComplete(false);
      } else {
        localStorage.removeItem(codeKey);
        localStorage.removeItem(expiryKey);
        setVerificationComplete(true);
      }
    } else {
      setVerificationComplete(localStorage.getItem(`verif_done_${batchId}_day_${day}`) === 'true');
    }

    loadAttendanceAndStudents();

    window.addEventListener('storage', loadAttendanceAndStudents);
    return () => window.removeEventListener('storage', loadAttendanceAndStudents);
  }, [course, day, batchId, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setSecretCode('');
            localStorage.removeItem(`secret_code_${batchId}_day_${day}`);
            localStorage.removeItem(`secret_code_expiry_${batchId}_day_${day}`);
            localStorage.setItem(`verif_done_${batchId}_day_${day}`, 'true');
            setVerificationComplete(true);
            window.dispatchEvent(new Event('storage'));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, batchId, day]);

  const generateSecretCode = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = Date.now() + 60000; 
    
    setSecretCode(newCode);
    setTimeLeft(60);
    setVerificationComplete(false);
    localStorage.removeItem(`verif_done_${batchId}_day_${day}`);
    
    localStorage.setItem(`secret_code_${batchId}_day_${day}`, newCode);
    localStorage.setItem(`secret_code_expiry_${batchId}_day_${day}`, expiry.toString());
    
    window.dispatchEvent(new Event('storage'));
  };

  const handleStartClass = () => {
    setErrorMessage(null);
    const activeModulesCount = Object.values(unlockedModules).filter(v => v).length;

    if (activeModulesCount === 0) {
      setErrorMessage("Please enable at least one module before starting the class.");
      return;
    }

    setIsClassStarted(true);
    localStorage.setItem(`class_started_${batchId}_day_${day}`, 'true');
    window.dispatchEvent(new Event('storage'));

    navigate(`/course/${course}/class/day/${day}`);
  };

  const handleStopClass = () => {
    setIsClassStarted(false);
    localStorage.removeItem(`class_started_${batchId}_day_${day}`);
    localStorage.removeItem(`verif_done_${batchId}_day_${day}`);
    setVerificationComplete(false);
    window.dispatchEvent(new Event('storage'));
  };

  const toggleModule = (module: string) => {
    const newState = { ...unlockedModules, [module]: !unlockedModules[module] };
    setUnlockedModules(newState);
    localStorage.setItem(`class_unlock_${course}_day_${day}`, JSON.stringify(newState));
    window.dispatchEvent(new Event('storage'));
  };

  const markManualAttendance = (userId: string) => {
    const attendanceKey = `attendance_${batchId}_day_${day}_${userId}`;
    localStorage.setItem(attendanceKey, 'true');
    loadAttendanceAndStudents();
    window.dispatchEvent(new Event('storage'));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button onClick={() => navigate('/teacher')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 flex items-center gap-2 mb-4">
            ← Back to Batches
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase tracking-tighter">Session Control</h1>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest border border-blue-100">{batchName}</span>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-2 rounded-full uppercase tracking-widest">ID: {batchId}</span>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-3xl border border-slate-200 shadow-sm">
           <select value={course} onChange={(e) => setCourse(e.target.value)} className="bg-transparent px-4 py-2 font-black text-[10px] uppercase outline-none text-slate-600">
             <option value="ielts">IELTS Premium</option>
             <option value="hicu">HICU Premium</option>
           </select>
           <div className="w-px h-6 bg-slate-200"></div>
           <select value={day} onChange={(e) => setDay(parseInt(e.target.value))} className="bg-transparent px-4 py-2 font-black text-[10px] uppercase outline-none text-blue-600">
             {Array.from({length: 18}, (_, i) => <option key={i+1} value={i+1}>Day {i+1}</option>)}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
           <div className={`bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl border border-white/5 overflow-hidden relative group transition-all duration-500 ${verificationComplete ? 'opacity-50' : 'scale-105 ring-4 ring-blue-600/20'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${secretCode ? 'bg-red-500 animate-pulse' : 'bg-blue-400'}`}></span>
                Phase 1: Verification
              </h3>
              
              <div className="flex flex-col items-center text-center py-4">
                 {secretCode ? (
                    <>
                       <div className="text-4xl font-black tracking-[0.3em] text-white mb-2 font-mono">{secretCode}</div>
                       <div className="flex items-center gap-2 mb-6">
                         <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                         <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">Live: {formatTime(timeLeft)}</span>
                       </div>
                    </>
                 ) : verificationComplete ? (
                    <div className="flex flex-col items-center">
                       <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-2xl mb-4">✓</div>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Verification Done</span>
                       <button onClick={generateSecretCode} className="px-6 py-2 border border-slate-700 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:border-blue-600 transition-all">Restart Attendance</button>
                    </div>
                 ) : (
                    <button 
                      onClick={generateSecretCode}
                      className="px-8 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                    >
                      Start Verification
                    </button>
                 )}
              </div>
           </div>

           <div className={`bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative transition-all duration-500 ${!verificationComplete ? 'opacity-40 grayscale pointer-events-none' : 'scale-100'}`}>
              {!verificationComplete && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/5 backdrop-blur-[1px] rounded-[3rem]">
                   <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest">Awaiting Verification</span>
                </div>
              )}
              
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Phase 2: Enable & Start</h3>
              <div className="space-y-3 mb-8">
                 {Object.entries(unlockedModules).map(([name, isUnlocked]) => (
                   <div key={name} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isUnlocked ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-transparent opacity-60'}`}>
                      <span className="text-sm font-bold text-slate-700">{name}</span>
                      <button onClick={() => toggleModule(name)} className={`w-10 h-5 rounded-full relative transition-all ${isUnlocked ? 'bg-blue-600' : 'bg-slate-300'}`}>
                         <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isUnlocked ? 'left-5.5' : 'left-0.5'}`}></div>
                      </button>
                   </div>
                 ))}
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-center">
                   <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-tight w-full">{errorMessage}</p>
                </div>
              )}

              <button 
                onClick={handleStartClass}
                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 bg-slate-900 text-white hover:bg-blue-600`}
              >
                Start Session Materials
              </button>
           </div>
        </div>

        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Live Attendance</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Confirmed: {studentActivity.filter(s => s.isPresentToday).length} / {studentActivity.length}
                </p>
              </div>
              <button onClick={loadAttendanceAndStudents} className="px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all">Refresh List</button>
           </div>

           {isLoading ? (
             <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Database...</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="border-b border-slate-100">
                      <tr>
                         <th className="pb-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Profile</th>
                         <th className="pb-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                         <th className="pb-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {studentActivity.length > 0 ? (
                        studentActivity.map((student) => (
                          <tr key={student.userId} className="group hover:bg-slate-50/50 transition-all">
                             <td className="py-6">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${student.isPresentToday ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                     👤
                                   </div>
                                   <div>
                                      <p className="font-bold text-slate-900 text-sm leading-none">{student.username || 'No Name'}</p>
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">UID: {student.userId.substring(0,8)}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="py-6">
                                {student.isPresentToday ? (
                                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">Confirmed</span>
                                ) : (
                                   <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest italic">Not Joined</span>
                                )}
                             </td>
                             <td className="py-6 text-right">
                                {!student.isPresentToday && (
                                   <button 
                                    onClick={() => markManualAttendance(student.userId)}
                                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                   >
                                    Mark Manual
                                   </button>
                                )}
                             </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-20 text-center text-slate-400 italic font-medium">No students enrolled in this batch yet.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ClassControl;
