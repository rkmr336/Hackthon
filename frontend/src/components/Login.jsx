import React, { useState } from 'react';
import api from '../api';

function Login({ setToken, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const endpoint = isLogin ? '/login' : '/register';
            const res = await api.post(endpoint, { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-zinc-950 relative overflow-hidden font-sans">
            
            {/* Background floating glow effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] relative z-10 transform transition-all hover:border-white/20">
                
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mb-6 shadow-[0_0_20px_rgba(52,211,153,0.5)]">
                        <span className="text-3xl font-extrabold text-white">P</span>
                    </div>
                    <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2">PulseDesk</h2>
                    <p className="text-emerald-400/80 font-medium text-sm">Welcome to the future of support</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium backdrop-blur-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Work Email</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-600 transition-all shadow-inner"
                            placeholder="admin@acme.com"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-600 transition-all shadow-inner"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            isLogin ? 'Access Workspace' : 'Create Workspace'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="ml-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
            
            {/* Minimal footer branding */}
            <div className="absolute bottom-6 text-slate-500 text-xs font-medium uppercase tracking-[0.2em] opacity-50">
                PulseDesk • v2.0 Beta
            </div>
        </div>
    );
}

export default Login;
