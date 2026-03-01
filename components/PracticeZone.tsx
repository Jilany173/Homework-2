
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeZone: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'cambridge' | 'special'>('cambridge');

  const cambridgeTests = [
    { title: 'Cambridge IELTS 18', type: 'Academic', tests: 4, icon: '📚' },
    { title: 'Cambridge IELTS 17', type: 'Academic', tests: 4, icon: '📖' },
    { title: 'Listening Mastery 01', type: 'Drill', tests: 10, icon: '🎧' },
  ];

  const specialTests = [
    { title: 'VIP Mock Exam (Standard)', price: '৳500', status: 'Purchasable', icon: '🏆' },
    { title: 'Writing Correction Service', price: '৳300', status: 'Locked', icon: '✍️' },
    { title: 'Speaking Interview Pro', price: '৳700', status: 'Premium', icon: '🎙️' },
  ];

  return (
    <div className="flex-1 py-10 animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button onClick={() => navigate('/')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 flex items-center gap-2 mb-4">
            ← Back to Selection
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Practice Zone</h1>
          <p className="text-slate-500 font-medium mt-2 italic">Sharpen your skills beyond the daily curriculum.</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <button 
            onClick={() => setActiveCategory('cambridge')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'cambridge' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Cambridge Library
           </button>
           <button 
            onClick={() => setActiveCategory('special')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'special' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Special Tests
           </button>
        </div>
      </div>

      {activeCategory === 'cambridge' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
           {cambridgeTests.map((test, idx) => (
             <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all group cursor-pointer">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                   {test.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{test.title}</h3>
                <div className="flex items-center gap-2 mb-8">
                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">{test.type}</span>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{test.tests} Complete Tests</span>
                </div>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-blue-600 transition-all">Start Practice</button>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-left-4 duration-500">
           {specialTests.map((test, idx) => (
             <div key={idx} className="bg-white p-8 rounded-[3rem] border-2 border-amber-100 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 p-6">
                   <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-100">
                      Premium Content
                   </span>
                </div>
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                   {test.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{test.title}</h3>
                <p className="text-2xl font-black text-amber-600 mb-8">{test.price}</p>
                <button className="w-full py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl shadow-amber-100">Unlock Test</button>
             </div>
           ))}
        </div>
      )}

      <div className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
         <div>
            <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Need a Full Mock Test?</h4>
            <p className="text-slate-400 text-sm italic font-medium">Physical mock tests happen every Friday at Zindabazar Branch.</p>
         </div>
         <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Book Seat Now</button>
      </div>
    </div>
  );
};

export default PracticeZone;
