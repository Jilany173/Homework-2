
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseSelection: React.FC = () => {
  const navigate = useNavigate();
  const userBatchId = localStorage.getItem('userBatchId') || 'B2';

  // For the demo, we assume:
  // Batch B1 = HICU
  // Batch B2 = IELTS
  const canAccessHICU = userBatchId === 'B1';
  const canAccessIELTS = userBatchId === 'B2';

  const courses = [
    {
      id: 'hicu',
      title: 'CD HICU Premium',
      subtitle: 'Higher Intensive Communication Unit',
      sessions: 36,
      days: 18,
      icon: '💎',
      color: 'blue',
      locked: !canAccessHICU
    },
    {
      id: 'ielts',
      title: 'CD IELTS Premium',
      subtitle: 'International English Language Testing',
      sessions: 30,
      days: 30,
      icon: '🌍',
      color: 'indigo',
      locked: !canAccessIELTS
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 animate-in fade-in zoom-in duration-1000">
      <div className="text-center mb-16 serif-font">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-4">Academic Workspace</p>
        <h1 className="text-3xl md:text-4xl font-medium text-slate-400 mb-2 italic tracking-tight">Assigned Batch: {userBatchId}</h1>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">Portal</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl mb-12">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`group relative flex flex-col items-center text-center p-10 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-2 border-transparent transition-all duration-700 overflow-hidden ${course.locked ? 'opacity-60 grayscale' : ''}`}
          >
            {course.locked && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px]">
                <div className="bg-white px-6 py-2 rounded-full shadow-xl border border-slate-100 flex items-center gap-2">
                   <span className="text-xs font-black uppercase tracking-widest text-slate-400">Restricted Batch</span>
                </div>
              </div>
            )}
            
            <div className={`absolute top-0 right-0 w-40 h-40 bg-${course.color}-500/5 rounded-bl-[6rem] -mr-12 -mt-12 transition-transform group-hover:scale-125 duration-700`}></div>
            
            <div className="w-24 h-24 bg-slate-50 text-slate-800 rounded-[2rem] flex items-center justify-center text-5xl mb-6 shadow-inner relative z-10 border border-slate-100 group-hover:bg-white transition-all">
              {course.icon}
            </div>

            <h3 className="text-3xl font-black text-slate-900 mb-2 relative z-10 leading-tight">{course.title}</h3>
            <p className="text-slate-400 text-sm font-medium mb-1 relative z-10 tracking-wide">{course.subtitle}</p>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-10 relative z-10">
              {course.sessions} Sessions • {course.days} {course.id === 'hicu' ? 'Days' : 'Units'}
            </p>

            <div className="flex flex-col w-full gap-3 relative z-10">
              <button
                disabled={course.locked}
                onClick={() => navigate(`/course/${course.id}/class`)}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl hover:bg-slate-800 disabled:bg-slate-200 transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Class Work</span>
              </button>
              
              <button
                disabled={course.locked}
                onClick={() => navigate(`/course/${course.id}/homework`)}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 disabled:bg-slate-300 transition-all duration-300 shadow-xl shadow-blue-500/10 active:scale-95"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Homework Station</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-5xl">
        <button 
          onClick={() => navigate('/practice-zone')}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-[0.99]"
        >
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-black uppercase tracking-tighter">Enter Practice Zone</h4>
            <p className="text-white/70 text-sm font-medium">Cambridge Practice, Special Tests & Mock Assessments</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-white/20"></div>)}
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full">Explore Now →</span>
          </div>
        </button>
      </div>

      <div className="mt-24 text-center">
        <div className="h-px w-24 bg-slate-200 mx-auto mb-8"></div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] opacity-60">Authorized Student Environment • HEXA'S Group</p>
      </div>
    </div>
  );
};

export default CourseSelection;
