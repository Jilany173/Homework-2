
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TabType, WritingTaskType } from '../types';

const DayDetail: React.FC = () => {
  const navigate = useNavigate();
  const { courseType, mode, dayId } = useParams<{ courseType: string; mode: string; dayId: string }>();
  const [activeTab, setActiveTab] = useState<TabType | null>(null);
  const [writingSubTab, setWritingSubTab] = useState<WritingTaskType>('Task 1');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const userRole = localStorage.getItem('userRole');
  const isTeacher = userRole === 'teacher';

  // Attendance & Join Logic
  const [isJoined, setIsJoined] = useState<boolean>(isTeacher); // Teachers are always "joined"
  const [isClassStarted, setIsClassStarted] = useState<boolean>(isTeacher); // Teachers always see materials
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [joinError, setJoinError] = useState<string | null>(null);

  // Real-time Unlock Status from Teacher
  const [unlockedModules, setUnlockedModules] = useState<Record<string, boolean>>({
    Speaking: isTeacher, Listening: isTeacher, Reading: isTeacher, Writing: isTeacher
  });

  const isIELTS = courseType === 'ielts';
  const isClassMode = mode === 'class';
  const labelType = isIELTS ? 'Class' : 'Day';
  
  const userBatchId = localStorage.getItem('userBatchId') || 'B2';
  const currentUserId = localStorage.getItem('currentUserId') || 's_demo';
  const allTabs: TabType[] = ['Speaking', 'Listening', 'Reading', 'Writing'];

  // Filter tabs: Teachers see all, students see only activated
  const availableTabs = (isClassMode && !isTeacher)
    ? allTabs.filter(tab => unlockedModules[tab])
    : allTabs;

  useEffect(() => {
    const checkStatus = () => {
      if (isTeacher) {
        setUnlockedModules({ Speaking: true, Listening: true, Reading: true, Writing: true });
        if (!activeTab) setActiveTab('Speaking');
        return;
      }

      // Student logic
      const attendanceKey = `attendance_${userBatchId}_day_${dayId}_${currentUserId}`;
      setIsJoined(localStorage.getItem(attendanceKey) === 'true');

      const startKey = `class_started_${userBatchId}_day_${dayId}`;
      setIsClassStarted(localStorage.getItem(startKey) === 'true');

      if (isClassMode) {
        const key = `class_unlock_${courseType}_day_${dayId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUnlockedModules(parsed);
          
          const activeOnes = allTabs.filter(t => parsed[t]);
          if (activeOnes.length > 0 && (!activeTab || !parsed[activeTab])) {
            setActiveTab(activeOnes[0]);
          }
        } else {
          setUnlockedModules({ Speaking: false, Listening: false, Reading: false, Writing: false });
        }
      }
    };

    checkStatus();
    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, [courseType, dayId, isClassMode, userBatchId, currentUserId, activeTab, isTeacher]);

  useEffect(() => {
    if (!isClassMode && !activeTab) {
      setActiveTab('Speaking');
    }
  }, [isClassMode, activeTab]);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);

    const secretCodeKey = `secret_code_${userBatchId}_day_${dayId}`;
    const activeSecretCode = localStorage.getItem(secretCodeKey);

    if (activeSecretCode && joinCodeInput === activeSecretCode) {
      const attendanceKey = `attendance_${userBatchId}_day_${dayId}_${currentUserId}`;
      localStorage.setItem(attendanceKey, 'true');
      setIsJoined(true);
      window.dispatchEvent(new Event('storage'));
    } else {
      setJoinError('Invalid verification code. Please ask your instructor.');
    }
  };

  const handleTaskSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      alert('Homework submitted successfully!');
    }, 1500);
  };

  const renderJoinBarrier = () => (
    <div className="flex-1 flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full bg-white p-10 md:p-14 rounded-[3rem] border border-slate-200 shadow-2xl text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-8 shadow-inner border border-blue-100">🔐</div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Class Verification</h2>
        <p className="text-slate-500 font-medium text-sm italic mb-10 leading-relaxed">Confirm your attendance with the 4-digit session code.</p>
        <form onSubmit={handleJoinClass} className="space-y-6">
           <input 
            type="text" maxLength={4} value={joinCodeInput} placeholder="0000"
            onChange={(e) => setJoinCodeInput(e.target.value.replace(/\D/g, ''))}
            className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-200"
           />
           {joinError && <p className="text-[10px] font-bold text-red-500 uppercase mt-3 tracking-widest">{joinError}</p>}
           <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">Join & Confirm</button>
        </form>
      </div>
    </div>
  );

  const renderWaitingScreen = () => (
    <div className="bg-white p-12 md:p-20 rounded-[3rem] border border-slate-200 shadow-xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-4xl mb-8 shadow-inner border border-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>📽️
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Class Starting Soon</h3>
      <p className="max-w-md text-slate-500 font-medium leading-relaxed italic mb-8">You're verified! Please wait for the teacher to reveal the lecture content.</p>
      <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-100">
         <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
         <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Connected • Waiting</span>
      </div>
    </div>
  );

  const renderClassContent = (tab: TabType) => {
    const icons: Record<TabType, string> = { 'Speaking': '🎙️', 'Listening': '🎧', 'Reading': '📖', 'Writing': '✍️' };
    const colors: Record<TabType, string> = { 'Speaking': 'indigo', 'Listening': 'sky', 'Reading': 'emerald', 'Writing': 'slate' };

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-tighter">
            <span className={`flex items-center justify-center w-12 h-12 bg-${colors[tab]}-50 text-${colors[tab]}-600 rounded-xl`}>{icons[tab]}</span>
            {tab} Live Materials
          </h3>
          <div className="aspect-video w-full bg-slate-900 rounded-[2rem] mb-8 flex items-center justify-center relative overflow-hidden group shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
             <div className="flex flex-col items-center gap-4 relative z-10 text-center px-4">
               <button className="w-20 h-20 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               </button>
               <p className="text-white/40 font-bold text-[10px] uppercase tracking-[0.3em]">Lecture Stream • Live Now</p>
               {isTeacher && <p className="text-blue-400 font-black text-[9px] uppercase tracking-widest">Teacher Preview Mode</p>}
             </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 italic">Academic Unit 2024</p>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Download Material</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group">
             <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Official Notes</span>
                <h4 className="text-lg font-black text-slate-900 mb-2">Technique Handbook</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">Expert guidance for the {tab} module.</p>
             </div>
             <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg">Download PDF</button>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group">
             <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Workshop</span>
                <h4 className="text-lg font-black text-slate-900 mb-2">Lexical Set</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">Module-specific vocabulary drills.</p>
             </div>
             <button className="w-full py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Review Vocabulary</button>
          </div>
        </div>
      </div>
    );
  };

  const renderHomeworkContent = (tab: TabType) => {
    switch (tab) {
      case 'Speaking':
        return (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">🎙️ Speaking Drills</h3>
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 font-bold text-slate-800 text-sm">Part 1: Interaction Drill</div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 font-bold text-slate-800 text-sm">Part 2: Strategy Prompt</div>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
               <button 
                onClick={handleTaskSubmit} disabled={isSubmitted || isSubmitting}
                className={`px-10 py-4 rounded-2xl font-bold transition-all shadow-lg ${isSubmitted ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {isSubmitting ? "Uploading..." : isSubmitted ? "✓ Submitted" : "Submit Homework"}
              </button>
            </div>
          </div>
        );
      case 'Listening':
        return (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">🎧 Listening Lab</h3>
            <div className="aspect-video w-full bg-slate-900 rounded-[2rem] flex items-center justify-center">
              <span className="text-white/20 font-black text-xs uppercase tracking-[0.5em]">Session Ready</span>
            </div>
          </div>
        );
      case 'Reading':
        return (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">📖 Reading Passage</h3>
            <div className="p-8 bg-slate-50 rounded-2xl italic text-slate-500 border border-slate-100 leading-relaxed">"Curriculum materials will display here during practice..."</div>
          </div>
        );
      case 'Writing':
        return (
          <div className="bg-white rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {(['Task 1', 'Task 2'] as WritingTaskType[]).map((task) => (
                <button key={task} onClick={() => setWritingSubTab(task)} className={`flex-1 px-6 py-5 text-xs font-black uppercase tracking-widest ${writingSubTab === task ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>{task}</button>
              ))}
            </div>
            <div className="p-8">
              <textarea className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all resize-none" placeholder="Draft your submission..."></textarea>
              <button onClick={handleTaskSubmit} className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Submit Writing</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="flex flex-col gap-1">
          {isTeacher ? (
            <button 
              onClick={() => navigate('/teacher/class-control', { state: { batchId: userBatchId, batchName: isIELTS ? 'IELTS Premium' : 'HICU Premium' } })}
              className="text-sm font-black flex items-center gap-1 hover:underline uppercase tracking-tighter text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              BACK TO SESSION CONTROL
            </button>
          ) : (
            <Link to={`/course/${courseType}/${mode}`} className={`text-sm font-black flex items-center gap-1 hover:underline uppercase tracking-tighter ${isClassMode ? 'text-indigo-600' : 'text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              EXIT MODULE
            </Link>
          )}
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">{labelType} {dayId}</h1>
            <span className={`text-[10px] font-black px-2 py-1 rounded-md border uppercase tracking-tighter ${isClassMode ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
              {isTeacher ? 'FACULTY REVIEW' : isClassMode ? 'Live Session' : 'Assignment'}
            </span>
          </div>
        </div>
      </div>

      {!isJoined && isClassMode ? renderJoinBarrier() : (
        <>
          {isClassMode && !isClassStarted ? renderWaitingScreen() : (
            <>
              {isClassMode && availableTabs.length === 0 ? renderWaitingScreen() : (
                <>
                  <div className="sticky top-[68px] z-40 bg-white/40 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-white/50 shadow-sm overflow-x-auto no-scrollbar">
                    <div className="flex min-w-max md:min-w-0 md:w-full gap-1">
                      {availableTabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 px-6 py-3.5 rounded-xl font-black text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab ? (isTeacher || isClassMode ? 'bg-slate-900 text-white shadow-xl' : 'bg-blue-600 text-white shadow-lg') : 'text-slate-400 hover:text-slate-800 hover:bg-white/80'}`}
                        >
                          {tab.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pb-16 px-2">
                    {activeTab && (isClassMode ? renderClassContent(activeTab) : renderHomeworkContent(activeTab))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DayDetail;
