
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PracticeZoneProps {
  isAuthenticated?: boolean;
}

const freeTests = [
  { id: 'cam18_listening', title: 'Cambridge IELTS 18', skill: 'listening', type: 'Academic', parts: 4, label: 'Listening 1' },
  { id: 'cam18_listening_test2', title: 'Cambridge IELTS 18', skill: 'listening', type: 'Academic', parts: 4, label: 'Listening 2' },
  { id: 'cam18_reading', title: 'Cambridge IELTS 18', skill: 'reading', type: 'Academic', passages: 3, label: 'Reading' },
  { id: 'cam18_writing', title: 'Cambridge IELTS 18', skill: 'writing', type: 'Academic', parts: 2, label: 'Writing' },
];

const premiumTests = [
  { title: 'VIP Full Mock Exam', description: 'Complete timed IELTS under exam conditions', icon: '🏆', price: '৳500' },
  { title: 'Speaking Interview Pro', description: 'AI-evaluated speaking with detailed band scores', icon: '🎙️', price: '৳700' },
  { title: 'Writing Correction', description: 'Expert feedback on Task 1 & Task 2', icon: '✍️', price: '৳300' },
];

const PracticeZone: React.FC<PracticeZoneProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'free' | 'packages' | 'premium'>('free');
  const [publicUser, setPublicUser] = useState<{ username: string; email: string } | null>(null);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, role')
          .eq('id', session.user.id)
          .single();
        if (profile?.role === 'public_user') {
          setPublicUser({
            username: profile.username || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
          });
        }
      } else {
        setPublicUser(null);
      }
    };

    const fetchPackages = async () => {
      const { data, error } = await supabase.from('test_packages').select('*').order('created_at', { ascending: false });
      if (data && !error) setPackages(data);
    };

    checkSession();
    fetchPackages();

    // Listen for auth changes (sign in / sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setPublicUser(null);
      } else {
        checkSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPublicUser(null);
  };

  const isLoggedIn = isAuthenticated || !!publicUser;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">

      {/* ── Hero Header ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.1),transparent_60%)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-5xl mx-auto px-6 py-6 md:py-8">

          {/* Logo + content row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Hexa's Zindabazar" className="h-20 object-contain brightness-0 invert flex-shrink-0" />
              <div className="w-px h-8 bg-white/15 flex-shrink-0"></div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tighter">
                  IELTS Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Zone</span>
                </h1>
                <p className="text-slate-400 text-xs font-medium hidden md:block">Free practice — no account needed</p>
              </div>
            </div>

            {/* Auth Actions */}
            {!isLoggedIn ? (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-900/40"
                >
                  Create Account →
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* User avatar + name */}
                <div className="flex items-center gap-2.5 bg-white/8 border border-white/10 px-3 py-2 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                    {(publicUser?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-xs font-black leading-none">{publicUser?.username || 'User'}</p>
                    <p className="text-slate-400 text-[10px] font-medium mt-0.5 leading-none">Practice Account</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl w-fit mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('free')}
            className={`px-7 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'free' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Free Tests
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-7 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'packages' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Package Tests
          </button>
          <button
            onClick={() => setActiveTab('premium')}
            className={`px-7 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'premium' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Premium
          </button>
        </div>

        {/* ── Free Tab ── */}
        {activeTab === 'free' && (
          <div className="animate-in slide-in-from-right-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {freeTests.map((test, idx) => (
                <div key={`${test.id}-${idx}`} className="bg-white rounded-3xl border border-slate-200 p-7 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border group-hover:scale-110 transition-transform ${test.skill === 'reading' ? 'bg-emerald-50 border-emerald-100' : test.skill === 'writing' ? 'bg-purple-50 border-purple-100' : 'bg-blue-50 border-blue-100'}`}>
                      {test.skill === 'reading' ? '📖' : test.skill === 'writing' ? '✍️' : '🎧'}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg uppercase tracking-wider">Free</span>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${test.skill === 'reading' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : test.skill === 'writing' ? 'text-purple-700 bg-purple-50 border border-purple-100' : 'text-blue-700 bg-blue-50 border border-blue-100'}`}>{test.label}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">{test.title}</h3>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">{test.type}</span>
                    <span className="text-[9px] text-slate-400 font-bold">
                      {test.skill === 'reading' ? `${(test as any).passages} Passages · 40 Questions` : test.skill === 'writing' ? `${(test as any).parts} Tasks · 60 Minutes` : `${(test as any).parts} Parts · 40 Questions`}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/practice-zone/${test.skill}/${encodeURIComponent(test.id)}`)}
                    className={`w-full py-3.5 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${test.skill === 'reading' ? 'bg-emerald-700 group-hover:bg-emerald-600' : test.skill === 'writing' ? 'bg-purple-700 group-hover:bg-purple-600' : 'bg-slate-900 group-hover:bg-blue-600'}`}
                  >
                    Start Practice →
                  </button>
                </div>
              ))}

              {/* Coming soon */}
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-7 flex flex-col items-center justify-center gap-3 min-h-[220px]">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-lg border border-slate-100">⏳</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">More Coming<br />Soon</p>
              </div>
            </div>

            {/* Score tracking CTA */}
            {!isLoggedIn && (
              <div className="mt-8 bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-5 border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border border-blue-500/20">📊</div>
                  <div>
                    <p className="text-white font-black text-sm mb-0.5">Track Your Scores Over Time</p>
                    <p className="text-slate-400 text-xs font-medium">Create a free account — takes 30 seconds</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30 whitespace-nowrap"
                >
                  Create Free Account →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Packages Tab ── */}
        {activeTab === 'packages' && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            {packages.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">📦</div>
                <h3 className="text-xl font-black text-slate-800">No Packages Yet</h3>
                <p className="text-sm font-medium text-slate-500 text-center max-w-sm">Test packages combine multiple skills into a single exam-like experience. They will appear here once created.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(
                  packages.reduce((acc: Record<string, any[]>, pkg) => {
                    if (!acc[pkg.name]) acc[pkg.name] = [];
                    acc[pkg.name].push(pkg);
                    return acc;
                  }, {})
                ).map(([groupName, groupPkgs]) => (
                  <div key={groupName} className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-blue-900 tracking-tight">{groupName}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {(groupPkgs as any[]).map(pkg => (
                        <div
                          key={pkg.id}
                          onClick={() => alert('Package execution engine coming soon!')}
                          className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                        >
                          <div className="px-6 py-5 border-b border-slate-100 bg-white">
                            <h3 className="text-lg font-bold text-slate-900 text-center">{pkg.test_number || 'Test'}</h3>
                          </div>

                          <div className="p-6 flex-1 bg-white">
                            <ul className="space-y-3.5">
                              {pkg.listening_id && (
                                <li className="text-[15px] font-medium text-slate-700 hover:text-blue-600 transition-colors">Listening</li>
                              )}
                              {pkg.reading_id && (
                                <li className="text-[15px] font-medium text-slate-700 hover:text-blue-600 transition-colors">Reading</li>
                              )}
                              {pkg.writing_id && (
                                <li className="text-[15px] font-medium text-slate-700 hover:text-blue-600 transition-colors">Writing</li>
                              )}
                              {pkg.speaking_id && (
                                <li className="text-[15px] font-medium text-slate-700 hover:text-blue-600 transition-colors">Speaking</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Premium Tab ── */}
        {activeTab === 'premium' && (
          <div className="animate-in slide-in-from-left-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {premiumTests.map((test) => (
                <div key={test.title} className="bg-white rounded-3xl border border-slate-200 p-7 relative overflow-hidden">
                  {/* Lock overlay */}
                  <div className="absolute inset-0 bg-white/75 backdrop-blur-[3px] flex flex-col items-center justify-center rounded-3xl z-10">
                    <div className="flex flex-col items-center gap-3 text-center px-6">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                        🔒
                      </div>
                      <p className="text-sm font-black text-slate-900">Coming Soon</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Account + payment required</p>
                      <span className="px-4 py-1.5 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md">{test.price}</span>
                    </div>
                  </div>
                  {/* Card bg */}
                  <div className="text-2xl mb-4">{test.icon}</div>
                  <h3 className="font-black text-slate-900 mb-2">{test.title}</h3>
                  <p className="text-xs text-slate-500">{test.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-5 border border-slate-800">
              <div>
                <p className="text-white font-black text-sm mb-1">Get Early Access When Premium Launches</p>
                <p className="text-slate-400 text-xs font-medium">Create a free account to be notified first.</p>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="px-7 py-3 bg-white text-slate-900 hover:bg-blue-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-xl"
              >
                Notify Me →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Hexa's Academic Excellence Hub • Practice Zone is free for everyone
        </p>
      </div>
    </div>
  );
};

export default PracticeZone;
