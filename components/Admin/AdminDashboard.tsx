
import React from 'react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Pending Reviews', value: '12', color: 'bg-amber-500', icon: '🕒' },
    { label: 'Total Content', value: '144 Tasks', color: 'bg-blue-500', icon: '📂' },
    { label: 'Active Students', value: '86', color: 'bg-indigo-500', icon: '👥' },
    { label: 'Avg Performance', value: '7.5', color: 'bg-emerald-500', icon: '📈' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-medium">Monitoring academic performance across all modules.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 flex items-center gap-5 hover:shadow-xl hover:border-blue-100 transition-all group">
            <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl ${stat.color} shadow-lg shadow-slate-100 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Recent Activity Card */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Live Feed
            </h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">Real-time</span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500 font-black">
                    {String.fromCharCode(64 + i)}{String.fromCharCode(83 + i)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">New Submission</p>
                    <p className="text-[11px] text-slate-500 font-medium">Student {i} uploaded Day {10 + i} Task</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-blue-600 uppercase group-hover:underline">Review</p>
                   <p className="text-[9px] text-slate-400 font-medium mt-1">{i * 5}m ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
            View All Logs
          </button>
        </div>

        {/* Message Board Card */}
        <div className="bg-[#1e293b] p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-3 bg-blue-600/20 px-4 py-1.5 rounded-full border border-blue-500/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Staff Notice Board</span>
              </div>
              <h3 className="text-3xl font-black mb-4 leading-tight">Priority Check: <br/><span className="text-blue-400">Week 3 Reading Passages</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium italic">
                "Attention all coordinators: Please finalize the mock test prompts for the IELTS Academic stream by Friday. Students in the Evening HICU batch require extra speaking intervention."
              </p>
            </div>
            
            <div className="pt-10 border-t border-slate-700/50 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" className="w-full h-full object-cover rounded-2xl" alt="Staff" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Rahat Hasan</p>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Senior Coordinator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
