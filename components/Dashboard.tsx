
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

interface Progress {
  s: boolean; // Speaking
  l: boolean; // Listening
  r: boolean; // Reading
  w: boolean; // Writing
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { courseType, mode } = useParams<{ courseType: string; mode: string }>();
  
  const isIELTS = courseType === 'ielts';
  const isClassMode = mode === 'class';
  
  const userBatchId = localStorage.getItem('userBatchId') || 'B2';
  const currentUserId = localStorage.getItem('currentUserId') || 's_demo';
  
  // Attendance & Verification State
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Simulation: Day 1, 2, and 3 are unlocked for this batch.
  const [unlockedDays] = useState<number[]>([1, 2, 3]);

  // Mock progress data
  const [completionData] = useState<Record<number, Progress>>({
    1: { s: true, l: true, r: true, w: true },   
    2: { s: true, l: true, r: false, w: false }, 
    3: { s: false, l: false, r: false, w: false }
  });

  const totalItems = isIELTS ? 30 : 18;
  const labelType = isIELTS ? 'Class' : 'Day';
  const courseTitle = isIELTS ? 'CD IELTS - Premium' : 'CD HICU - Premium';
  const modeTitle = isClassMode ? 'Class Work' : 'Homework Station';

  useEffect(() => {
    // Check if student has already joined today's session (Day 3 for demo)
    const currentDay = 3;
    const attendanceKey = `attendance_${userBatchId}_day_${currentDay}_${currentUserId}`;
    if (localStorage.getItem(attendanceKey) === 'true') {
      setIsJoined(true);
    }

    // Listener for real-time code updates or attendance marking
    const handleStorage = () => {
      if (localStorage.getItem(attendanceKey) === 'true') {
        setIsJoined(true);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [userBatchId, currentUserId]);

  const handleVerifyJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const currentDay = 3; // Demo session day
    const secretCodeKey = `secret_code_${userBatchId}_day_${currentDay}`;
    const activeCode = localStorage.getItem(secretCodeKey);

    if (activeCode && joinCode === activeCode) {
      const attendanceKey = `attendance_${userBatchId}_day_${currentDay}_${currentUserId}`;
      localStorage.setItem(attendanceKey, 'true');
      setIsJoined(true);
      window.dispatchEvent(new Event('storage'));
    } else {
      setError('Invalid code or session expired. Ask your teacher.');
    }
  };

  const days = Array.from({ length: totalItems }, (_, i) => ({
    id: i + 1,
  }));

  const isUnlocked = (id: number) => unlockedDays.includes(id);

  const getDayProgress = (id: number): Progress => {
    return completionData[id] || { s: false, l: false, r: false, w: false };
  };

  const isFullyCompleted = (id: number) => {
    const p = getDayProgress(id);
    return p.s && p.l && p.r && p.w;
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-6 md:py-12 px-4 animate-in fade-in duration-700">
      {/* Top Navigation */}
      <div className="w-full max-w-6xl mb-12 flex justify-start">
         <Link to="/" className="group flex items-center gap-2 text-slate-400 font-black hover:text-blue-600 transition-all text-[10px] uppercase tracking-[0.2em]">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            Switch Mode
         </Link>
      </div>

      {/* Header */}
      <div className="mb-10 text-center serif-font">
        <h1 className="text-xl md:text-2xl font-medium mb-2 tracking-tight text-slate-400 italic">{courseTitle}</h1>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
          {modeTitle}
        </h2>
        <div className="flex flex-col gap-1 items-center">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">Batch ID: {userBatchId} • Zindabazar Branch</p>
        </div>
      </div>

      {/* Join Class Section - Only for Class Mode if not joined */}
      {isClassMode && !isJoined && (
        <div className="w-full max-w-xl mb-12 animate-in zoom-in duration-500">
          <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-1.5 rounded-full border border-blue-500/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Active Live Session</span>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Verify to Start Class</h3>
              <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed px-4">Enter the 4-digit secret code shared by your teacher during the lecture to mark attendance and unlock materials.</p>

              <form onSubmit={handleVerifyJoin} className="space-y-4 max-w-xs mx-auto">
                <input 
                  type="text" 
                  maxLength={4}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="CODE"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black tracking-[0.5em] text-white outline-none focus:bg-white/10 focus:border-blue-500 transition-all placeholder:text-slate-700"
                />
                {error && <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">{error}</p>}
                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  Verify & Enter Class
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className={`relative w-full max-w-6xl ${isClassMode && !isJoined ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
        {isClassMode && !isJoined && (
          <div className="absolute inset-0 z-10 backdrop-blur-[2px] cursor-not-allowed"></div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 md:gap-6">
          {days.map((day) => {
            const unlocked = isUnlocked(day.id);
            const completed = unlocked && isFullyCompleted(day.id);
            const progress = getDayProgress(day.id);

            return (
              <button
                key={day.id}
                disabled={!unlocked || (isClassMode && !isJoined)}
                onClick={() => navigate(`/course/${courseType}/${mode}/day/${day.id}`)}
                className={`group relative flex flex-col items-center justify-between gap-6 pt-8 pb-5 px-5 rounded-[2rem] transition-all duration-500 border-2 ${
                  unlocked 
                  ? `bg-white border-transparent text-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(30,41,59,0.08)] ${isClassMode ? 'hover:border-indigo-400' : 'hover:border-blue-400'} hover:-translate-y-1 active:scale-95 cursor-pointer` 
                  : "bg-slate-200/40 text-slate-400 border-transparent cursor-not-allowed grayscale"
                }`}
              >
                {unlocked && (
                  <div className={`absolute -top-3 -right-3 p-2 rounded-full shadow-xl border-4 border-slate-50 animate-in zoom-in duration-500 ${
                    completed ? 'bg-emerald-500 text-white' : isClassMode ? 'bg-slate-100 text-slate-400' : 'bg-amber-500 text-white'
                  }`}>
                    {completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 flex items-center justify-center font-black text-[8px]">{isClassMode ? '👁️' : '!'}</div>
                    )}
                  </div>
                )}

                {!unlocked && (
                  <div className="absolute top-4 right-4 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${
                    isClassMode ? 'text-indigo-400 group-hover:text-indigo-600' : 'text-slate-400 group-hover:text-blue-500'
                  }`}>
                    {labelType}
                  </span>
                  <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">{day.id}</span>
                </div>
                
                <div className="w-full pt-4 border-t border-slate-50">
                  {isClassMode ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-full text-center">Resources</span>
                    </div>
                  ) : (
                    <div className="flex justify-between gap-1">
                      {[
                        { label: 'S', done: progress.s },
                        { label: 'L', done: progress.l },
                        { label: 'R', done: progress.r },
                        { label: 'W', done: progress.w }
                      ].map((task) => (
                        <div 
                          key={task.label}
                          className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                            task.done 
                            ? `bg-blue-600 text-white shadow-lg shadow-blue-900/10` 
                            : 'bg-slate-50 text-slate-300 border border-slate-100'
                          }`}
                        >
                          {task.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend Card */}
      <div className="mt-24 w-full max-w-4xl relative">
        <div className={`absolute inset-0 blur-[80px] rounded-full ${isClassMode ? 'bg-indigo-600/5' : 'bg-blue-600/5'}`}></div>
        <div className="relative bg-white border border-slate-200/60 rounded-[3rem] p-10 md:p-14 shadow-sm overflow-hidden transition-colors">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-left w-full lg:w-1/2">
              <h4 className="text-slate-900 font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-xs">
                <span className={`w-1 h-8 rounded-full ${isClassMode ? 'bg-indigo-600' : 'bg-blue-600'}`}></span>
                {isClassMode ? 'Class Material Index' : 'Module Legend'}
              </h4>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                {isClassMode ? (
                  ['Video Lecture', 'Class PDF', 'Worksheet', 'Vocab List'].map((mod) => (
                    <div key={mod} className="flex items-center gap-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                      <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center text-[14px] border border-indigo-100 shadow-sm">
                        {mod.includes('Video') ? '🎬' : mod.includes('PDF') ? '📄' : '📝'}
                      </span> 
                      {mod}
                    </div>
                  ))
                ) : (
                  ['Speaking', 'Listening', 'Reading', 'Writing'].map((mod) => (
                    <div key={mod} className="flex items-center gap-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                      <span className="w-8 h-8 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center text-[11px] border border-slate-100 shadow-sm">{mod[0]}</span> 
                      {mod}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`flex-1 w-full p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group ${isClassMode ? 'bg-slate-900' : 'bg-slate-900'}`}>
               <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-transform group-hover:scale-150 ${isClassMode ? 'bg-indigo-500/10' : 'bg-blue-500/10'}`}></div>
               <div className="relative z-10">
                 <h5 className="text-white font-black text-sm uppercase tracking-widest mb-4">Portal Notice</h5>
                 <p className="text-sm font-medium leading-relaxed text-slate-400 italic">
                  {isClassMode 
                    ? "Verify session code to access recorded lectures. Attendance is recorded automatically upon verification."
                    : "Homework must be submitted by 11:59 PM on the day it is unlocked for grading inclusion."}
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
