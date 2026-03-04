
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: (role: 'student' | 'teacher' | 'admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // ১. সুপাবেস অথেন্টিকেশন দিয়ে সাইন ইন
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      if (data.user) {
        // ২. সাইন ইন সফল হলে 'profiles' টেবিল থেকে ওই ইউজারের রোল এবং ডিটেইলস নিয়ে আসা
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, batch_id, username')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw new Error("User profile not found in database. Please contact admin.");
        }

        // ৩. লোকাল স্টোরেজে তথ্য সেভ করা যাতে রিফ্রেশ করলে লগআউট না হয়ে যায়
        localStorage.setItem('userRole', profile.role);
        localStorage.setItem('username', profile.username || email.split('@')[0]);
        if (profile.batch_id) localStorage.setItem('userBatchId', profile.batch_id);
        localStorage.setItem('currentUserId', data.user.id);

        onLogin(profile.role as 'student' | 'teacher' | 'admin');

        // public_user goes to practice zone, not student portal
        if (profile.role === 'public_user') {
          navigate('/practice-zone');
          return;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] px-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center group mb-4">
            <div className="flex items-baseline scale-125 md:scale-150 mb-2">
              <span className="text-white font-black text-3xl tracking-tighter">HEXA'S</span>
              <span className="ml-1 text-red-500 text-sm font-bold">🎓</span>
            </div>
            <span className="text-slate-400 font-black text-[9px] tracking-[0.5em] uppercase opacity-80">Academic Excellence Hub</span>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl border border-slate-700/50">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 text-center leading-none">Portal Login</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@email.com"
                  className="block w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-slate-300 outline-none text-sm font-medium focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-slate-300 outline-none text-sm font-medium focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-[10px] font-black uppercase text-center leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-3 py-5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl active:scale-95 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Enter Portal'}
            </button>
          </form>

          <p className="mt-8 text-center text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            Protected Academic Environment
          </p>
        </div>
      </div>

      {/* ── Practice Without Login banner ── */}
      <div className="relative z-10 mt-8 w-full max-w-md px-4">
        <button
          onClick={() => navigate('/practice-zone')}
          className="w-full group relative overflow-hidden flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-blue-600/20 hover:border-blue-500/40 transition-all duration-300 shadow-lg"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-400/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Icon */}
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3zM3 20h18" />
            </svg>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-xl border-2 border-blue-400/40 animate-ping opacity-50"></span>
          </div>

          {/* Text */}
          <div className="relative text-left flex-1">
            <p className="text-white font-black text-sm uppercase tracking-wider leading-none mb-1">Practice Without Login</p>
            <p className="text-slate-400 text-[10px] font-medium">Free IELTS tests — no account needed</p>
          </div>

          {/* Arrow */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Login;
