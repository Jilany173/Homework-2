
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    pendingReviews: '—',
    totalContent: '—',
    activeStudents: '—',
    avgPerformance: '—',
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        // Active Students count
        const { count: studentCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .in('role', ['Student', 'student']);

        // Total unlocked content (batch_unlocked_days rows)
        const { count: contentCount } = await supabase
          .from('batch_unlocked_days')
          .select('*', { count: 'exact', head: true });

        // Pending Reviews — homework_progress where at least one task done but not all
        const { data: progressRows } = await supabase
          .from('homework_progress')
          .select('speaking, listening, reading, writing');

        let pending = 0;
        if (progressRows) {
          pending = progressRows.filter((r: any) =>
            (r.speaking || r.listening || r.reading || r.writing) &&
            !(r.speaking && r.listening && r.reading && r.writing)
          ).length;
        }

        setStats({
          pendingReviews: String(pending),
          totalContent: contentCount != null ? `${contentCount} Days` : '—',
          activeStudents: studentCount != null ? String(studentCount) : '—',
          avgPerformance: '—', // Requires scoring system
        });
      } catch (err) {
        console.error('AdminDashboard stats error:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Pending Reviews', value: stats.pendingReviews, color: 'bg-amber-500', icon: '🕒' },
    { label: 'Total Content', value: stats.totalContent, color: 'bg-blue-500', icon: '📂' },
    { label: 'Active Students', value: stats.activeStudents, color: 'bg-indigo-500', icon: '👥' },
    { label: 'Avg Performance', value: stats.avgPerformance, color: 'bg-emerald-500', icon: '📈' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-medium">Monitoring academic performance across all modules.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 flex items-center gap-5 hover:shadow-xl hover:border-blue-100 transition-all group">
            <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl ${stat.color} shadow-lg shadow-slate-100 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              {statsLoading ? (
                <div className="w-12 h-6 bg-slate-100 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              )}
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
            <div className="flex flex-col items-center justify-center py-12 opacity-30">
              <span className="text-3xl mb-3">📭</span>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">No recent activity</p>
            </div>
          </div>
          <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
            View All Logs
          </button>
        </div>

        {/* Notice Board Card */}
        <div className="bg-[#1e293b] p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 bg-blue-600/20 px-4 py-1.5 rounded-full border border-blue-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Staff Notice Board</span>
            </div>
            <div className="flex flex-col items-center justify-center py-12 opacity-30">
              <span className="text-3xl mb-3">📋</span>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">No notices posted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
