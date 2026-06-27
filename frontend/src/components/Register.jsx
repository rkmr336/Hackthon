import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Register({ setToken, setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/register', { 
                name, 
                email, 
                password, 
                organization_name: orgName 
            });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setUser(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">PulseDesk</h2>
                    <p className="text-white/80">Create your workspace</p>
                </div>
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/40 transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-1">Organization Name</label>
                        <input 
                            type="text" 
                            value={orgName}
                            onChange={e => setOrgName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/40 transition-all"
                            placeholder="Acme Corp"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-1">Work Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/40 transition-all"
                            placeholder="john@acme.com"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/40 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all mt-4 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Creating workspace...' : 'Sign up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/70 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white font-bold hover:underline">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
