import React, { useState } from 'react';
import api from '../api';

function Login({ setToken, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setUser(response.data.user);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">PulseDesk</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
