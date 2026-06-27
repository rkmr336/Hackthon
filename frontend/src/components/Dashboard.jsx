import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../api';

function Dashboard({ user }) {
    const [tickets, setTickets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
        document.documentElement.classList.add('dark'); 
    }, [statusFilter]);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/tickets', { params: { status: statusFilter } });
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tickets', newTicket);
            setShowCreateForm(false);
            setNewTicket({ subject: '', description: '' });
            fetchTickets();
        } catch (err) {
            console.error(err);
        }
    };

    // Metrics
    const totalOpen = tickets.filter(t => t.status === 'open' || t.status === 'pending').length;
    const open = tickets.filter(t => t.status === 'open').length;
    const pending = tickets.filter(t => t.status === 'pending').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;

    const priorityCounts = {
        urgent: tickets.filter(t => t.priority === 'urgent').length,
        high: tickets.filter(t => t.priority === 'high').length,
        medium: tickets.filter(t => t.priority === 'medium').length,
        low: tickets.filter(t => t.priority === 'low').length,
    };
    const maxPriority = Math.max(1, ...Object.values(priorityCounts));

    // Daily volume for smooth Area Chart
    const dailyData = [
        { name: 'Mon', tickets: 2 },
        { name: 'Tue', tickets: 5 },
        { name: 'Wed', tickets: 3 },
        { name: 'Thu', tickets: 7 },
        { name: 'Fri', tickets: 4 },
        { name: 'Sat', tickets: 1 },
        { name: 'Sun', tickets: tickets.length || 5 } 
    ];

    return (
        <div className="flex h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-zinc-950 text-slate-300 font-sans overflow-hidden">
            
            {/* Glassmorphism Sidebar */}
            <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between hidden md:flex shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-10">
                <div>
                    <div className="p-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                            P
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">PulseDesk</h1>
                    </div>
                    
                    <div className="px-4 py-4">
                        <p className="text-[10px] font-bold text-slate-500/70 uppercase tracking-widest mb-4 px-2">Main Menu</p>
                        <nav className="space-y-2">
                            <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 bg-white/10 text-emerald-300 px-4 py-3 rounded-2xl font-medium transition-all shadow-inner border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                Dashboard
                            </button>
                            <button onClick={() => {
                                document.getElementById('tickets-section')?.scrollIntoView({ behavior: 'smooth' });
                            }} className="w-full flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-2xl font-medium transition-all">
                                <span className="w-2 h-2 rounded-full border-2 border-slate-600"></span>
                                {user?.role === 'customer' ? 'My Tickets' : 'All Tickets'}
                            </button>
                            {user?.role === 'customer' && (
                                <button onClick={() => setShowCreateForm(true)} className="w-full flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-2xl font-medium transition-all text-left">
                                    <span className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-lg leading-none border border-white/10">+</span>
                                    Create Ticket
                                </button>
                            )}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="flex items-center gap-3 mb-4 p-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Alex Admin'}</p>
                            <p className="text-xs text-emerald-400/80 capitalize truncate">{user?.role || 'Admin'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-sm font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Background glow effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="p-8 max-w-7xl mx-auto relative z-10">
                    
                    {/* Header */}
                    <header className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                                {user?.role === 'customer' ? 'My Support' : 'Overview'}
                            </h2>
                            <p className="text-emerald-400/70 text-sm font-medium">
                                {user?.role === 'customer' ? `Welcome, ${user?.name || 'Customer'} 👋` : 'Real-time support operations'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => alert('No new notifications!')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-yellow-500/80 hover:bg-white/10 hover:text-yellow-400 transition-all shadow-lg backdrop-blur-md relative group cursor-pointer">
                                <span className="text-xl group-hover:animate-bounce">🔔</span>
                                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-[#0a0a0a] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                            </button>
                        </div>
                    </header>

                    {/* Admin-only Analytics */}
                    {user?.role !== 'customer' && (
                        <>
                            {/* Glass Metrics Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
                                <div className="bg-white/5 backdrop-blur-lg p-5 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl relative overflow-hidden group transition-all hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Open</p>
                                    <p className="text-5xl font-extrabold text-white mb-1 drop-shadow-md">{totalOpen}</p>
                                    <p className="text-xs text-slate-500 font-medium">Active queue</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg p-5 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl relative overflow-hidden group transition-all hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Open</p>
                                    <p className="text-5xl font-extrabold text-white mb-1 drop-shadow-md">{open}</p>
                                    <p className="text-xs text-slate-500 font-medium">Unassigned</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg p-5 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl relative overflow-hidden group transition-all hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pending</p>
                                    <p className="text-5xl font-extrabold text-white mb-1 drop-shadow-md">{pending}</p>
                                    <p className="text-xs text-slate-500 font-medium">Waiting on user</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg p-5 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl relative overflow-hidden group transition-all hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Resolved</p>
                                    <p className="text-5xl font-extrabold text-emerald-400 mb-1 drop-shadow-md">{resolved}</p>
                                    <p className="text-xs text-slate-500 font-medium">Successfully closed</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg p-5 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl relative overflow-hidden group transition-all hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">SLA Breach</p>
                                    <p className="text-5xl font-extrabold text-red-400 mb-1 drop-shadow-md">0%</p>
                                    <p className="text-xs text-slate-500 font-medium">Perfect score</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg p-5 rounded-3xl border border-white/10 hover:border-white/20 shadow-xl relative overflow-hidden group transition-all hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-purple-600"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Reply</p>
                                    <p className="text-5xl font-extrabold text-white mb-1 drop-shadow-md">5m</p>
                                    <p className="text-xs text-slate-500 font-medium">Lightning fast</p>
                                </div>
                            </div>

                            {/* Middle Section (Charts) */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
                                
                                {/* Smooth Area Chart instead of blocky Bar Chart */}
                                <div className="xl:col-span-2 bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full"></div>
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-tight">Ticket Volume</h3>
                                            <p className="text-xs text-slate-400">Last 7 days performance</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">+12% Growth</div>
                                    </div>
                                    <div className="h-56 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                                <RechartsTooltip cursor={{stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '5 5'}} contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderColor: '#ffffff20', color: '#f8fafc', borderRadius: '12px'}}/>
                                                <Area type="monotone" dataKey="tickets" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTickets)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Priority Glowing Bars */}
                                <div className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-center">
                                    <h3 className="text-lg font-bold text-white mb-8 tracking-tight">Ticket Priority</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                                                <span className="text-rose-400 tracking-wider uppercase">Urgent</span>
                                                <span className="text-white bg-rose-500/20 px-2 py-0.5 rounded text-[10px] border border-rose-500/30">{priorityCounts.urgent}</span>
                                            </div>
                                            <div className="w-full bg-black/40 rounded-full h-2 shadow-inner border border-white/5">
                                                <div className="bg-rose-500 h-2 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]" style={{width: `${(priorityCounts.urgent / maxPriority) * 100}%`}}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                                                <span className="text-orange-400 tracking-wider uppercase">High</span>
                                                <span className="text-white bg-orange-500/20 px-2 py-0.5 rounded text-[10px] border border-orange-500/30">{priorityCounts.high}</span>
                                            </div>
                                            <div className="w-full bg-black/40 rounded-full h-2 shadow-inner border border-white/5">
                                                <div className="bg-orange-500 h-2 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" style={{width: `${(priorityCounts.high / maxPriority) * 100}%`}}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                                                <span className="text-yellow-400 tracking-wider uppercase">Medium</span>
                                                <span className="text-white bg-yellow-500/20 px-2 py-0.5 rounded text-[10px] border border-yellow-500/30">{priorityCounts.medium}</span>
                                            </div>
                                            <div className="w-full bg-black/40 rounded-full h-2 shadow-inner border border-white/5">
                                                <div className="bg-yellow-400 h-2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" style={{width: `${(priorityCounts.medium / maxPriority) * 100}%`}}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                                                <span className="text-emerald-400 tracking-wider uppercase">Low</span>
                                                <span className="text-white bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30">{priorityCounts.low}</span>
                                            </div>
                                            <div className="w-full bg-black/40 rounded-full h-2 shadow-inner border border-white/5">
                                                <div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" style={{width: `${(priorityCounts.low / maxPriority) * 100}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Create Ticket Modal */}
                    {showCreateForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                            <div className="bg-[#0f172a] p-8 rounded-3xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] w-full max-w-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full"></div>
                                <h3 className="text-2xl font-bold text-white mb-2">New Request</h3>
                                <p className="text-slate-400 text-sm mb-6">Describe your issue in detail below.</p>
                                <form onSubmit={handleCreateTicket}>
                                    <input 
                                        type="text" 
                                        placeholder="Enter subject" 
                                        required
                                        value={newTicket.subject}
                                        onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 mb-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 transition-all shadow-inner"
                                    />
                                    <textarea 
                                        placeholder="Detailed description..." 
                                        required
                                        value={newTicket.description}
                                        onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 mb-6 text-white h-32 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-500 resize-none transition-all shadow-inner"
                                    />
                                    <div className="flex gap-4 justify-end">
                                        <button type="button" onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-white px-4 py-2 transition-colors font-medium">Cancel</button>
                                        <button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105">Submit Ticket</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Futuristic Ticket Table */}
                    <div id="tickets-section" className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl overflow-hidden relative">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                            <h3 className="text-sm font-bold text-white tracking-widest uppercase">{user?.role === 'customer' ? 'My Tickets' : 'Active Tickets'}</h3>
                            <div className="flex gap-4 items-center">
                                <select 
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="pending">Pending</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-white/5">
                                    {(user?.role === 'customer' ? tickets.filter(t => t.requester?.email === user.email) : tickets).map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-white/10 transition-all cursor-pointer group" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex flex-shrink-0 items-center justify-center text-slate-300 font-bold text-lg shadow-inner group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-all">
                                                        {ticket.requester?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-200 font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors">{ticket.subject}</p>
                                                        <p className="text-xs text-slate-500 truncate max-w-md">{ticket.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-4">
                                                    <span className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-lg border backdrop-blur-md shadow-sm
                                                        ${ticket.priority === 'high' || ticket.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 
                                                          ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-[0_0_10px_rgba(250,204,21,0.1)]' : 
                                                          'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'}`}>
                                                        {ticket.priority}
                                                    </span>
                                                    <span className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-lg border backdrop-blur-md shadow-sm
                                                        ${ticket.status === 'open' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 
                                                          ticket.status === 'pending' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.1)]' : 
                                                          ticket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                                                          'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {tickets.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-16 text-center">
                                                <div className="inline-block p-4 rounded-full bg-white/5 mb-4 text-3xl">📬</div>
                                                <p className="text-slate-400 font-medium">No active tickets.</p>
                                                <p className="text-sm text-slate-500 mt-1">New requests will appear here.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Dashboard;
