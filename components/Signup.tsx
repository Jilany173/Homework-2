
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!form.username.trim()) return setError('Username is required.');
        if (form.password.length < 6) return setError('Password must be at least 6 characters.');
        if (form.password !== form.confirm) return setError('Passwords do not match.');

        setIsLoading(true);
        try {
            // Create auth user
            const { data, error: signupErr } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: { emailRedirectTo: window.location.origin },
            });
            if (signupErr) throw signupErr;

            // Set profile with public_user role
            if (data.user) {
                await supabase.from('profiles').upsert({
                    id: data.user.id,
                    username: form.username,
                    role: 'public_user',
                    status: 'Active',
                });
            }

            // Sign out immediately — we don't want auto-login redirecting to student portal
            await supabase.auth.signOut();

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-emerald-500/20">✅</div>
                    <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Account Created!</h2>
                    <p className="text-slate-400 text-sm font-medium mb-8">
                        Check your email to verify your account, then sign in.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Go to Login →
                    </button>
                    <button
                        onClick={() => navigate('/practice-zone')}
                        className="w-full mt-3 py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/5"
                    >
                        Continue to Practice Zone
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] relative flex flex-col items-center justify-center px-4 py-10"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        >
            {/* Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Logo */}
            <div className="relative z-10 text-center mb-8">
                <p className="text-white font-black text-2xl tracking-tight">HEXA'S <span className="text-blue-400">🎓</span></p>
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Academic Excellence Hub</p>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">Create Free Account</h2>
                <p className="text-slate-500 text-xs font-medium mb-7">Track your IELTS practice scores over time.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Username</label>
                        <input
                            name="username" type="text" required
                            value={form.username} onChange={handleChange}
                            placeholder="Your name"
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Email Address</label>
                        <input
                            name="email" type="email" required
                            value={form.email} onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    {/* Password */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Password</label>
                        <input
                            name="password" type="password" required
                            value={form.password} onChange={handleChange}
                            placeholder="Min. 6 characters"
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    {/* Confirm */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Confirm Password</label>
                        <input
                            name="confirm" type="password" required
                            value={form.confirm} onChange={handleChange}
                            placeholder="Repeat password"
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            <span className="text-red-400 text-sm">⚠</span>
                            <p className="text-red-400 text-xs font-bold">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit" disabled={isLoading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30 mt-2"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account →'}
                    </button>
                </form>

                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    <p className="text-slate-500 text-xs font-medium">Already have an account?</p>
                    <button onClick={() => navigate('/login')} className="text-blue-400 text-xs font-black hover:underline uppercase tracking-wider">Sign In</button>
                </div>
            </div>

            {/* Practice without account */}
            <button
                onClick={() => navigate('/practice-zone')}
                className="relative z-10 mt-5 text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-widest transition-colors"
            >
                ← Practice without an account
            </button>
        </div>
    );
};

export default Signup;
