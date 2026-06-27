import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

function Dashboard({ user }) {
    const [tickets, setTickets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
        document.documentElement.classList.add('dark'); // Force dark mode for premium look
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

    const dailyData = [
        { name: 'Mon', tickets: 0 },
        { name: 'Tue', tickets: 0 },
        { name: 'Wed', tickets: 0 },
        { name: 'Thu', tickets: 0 },
        { name: 'Fri', tickets: 0 },
        { name: 'Sat', tickets: 0 },
        { name: 'Sun', tickets: tickets.length }
    ];

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden">
            
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
                <div>
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">P</div>
                        <h1 className="text-xl font-bold text-white tracking-wide">PulseDesk</h1>
                    </div>
                    
                    <div className="px-4 py-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Menu</p>
                        <nav className="space-y-1">
                            <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 bg-indigo-500/20 text-indigo-400 px-4 py-2.5 rounded-xl font-medium transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                Dashboard
                            </button>
                            <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 px-4 py-2.5 rounded-xl font-medium transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full border border-slate-500"></span>
                                Tickets
                            </button>
                            <button onClick={() => setShowCreateForm(true)} className="w-full flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 px-4 py-2.5 rounded-xl font-medium transition-colors text-left">
                                <span className="text-lg leading-none">+</span>
                                New Ticket
                            </button>
                        </nav>
                    </div>

                    <div className="px-4 py-6">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Admin</p>
                        <nav className="space-y-1">
                            <button className="w-full flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 px-4 py-2.5 rounded-xl font-medium transition-colors">
                                <span className="text-sm">👥</span>
                                Users
                            </button>
                            <button className="w-full flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 px-4 py-2.5 rounded-xl font-medium transition-colors">
                                <span className="text-sm">⏱</span>
                                SLA Policies
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4 p-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Alex Admin'}</p>
                            <p className="text-xs text-slate-500 capitalize truncate">{user?.role || 'Admin'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors text-sm font-medium">
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-6xl mx-auto">
                    
                    {/* Header */}
                    <header className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                            <p className="text-slate-400 text-sm">Support operations overview</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="w-10 h-10 rounded-full bg-[#1e293b] border border-slate-700 flex items-center justify-center text-yellow-500 hover:bg-slate-800 transition-colors shadow-sm relative">
                                🔔
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#1e293b] rounded-full"></span>
                            </button>
                        </div>
                    </header>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Open</p>
                            <p className="text-4xl font-bold text-white mb-1">{totalOpen}</p>
                            <p className="text-xs text-slate-500">open + pending</p>
                        </div>
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Open</p>
                            <p className="text-4xl font-bold text-white mb-1">{open}</p>
                            <p className="text-xs text-slate-500">&nbsp;</p>
                        </div>
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pending</p>
                            <p className="text-4xl font-bold text-white mb-1">{pending}</p>
                            <p className="text-xs text-slate-500">&nbsp;</p>
                        </div>
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Resolved</p>
                            <p className="text-4xl font-bold text-white mb-1">{resolved}</p>
                            <p className="text-xs text-slate-500">&nbsp;</p>
                        </div>
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SLA Breach</p>
                            <p className="text-4xl font-bold text-white mb-1">0%</p>
                            <p className="text-xs text-slate-500">of open tickets</p>
                        </div>
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Avg Response</p>
                            <p className="text-4xl font-bold text-white mb-1">—</p>
                            <p className="text-xs text-slate-500">first reply time</p>
                        </div>
                    </div>

                    {/* Middle Section (Charts) */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                        
                        {/* Main Chart */}
                        <div className="xl:col-span-2 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-white mb-1">Tickets — Last 7 Days</h3>
                            <p className="text-xs text-slate-500 mb-8">Daily volume</p>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyData}>
                                        <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                        <RechartsTooltip cursor={{fill: '#334155'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px'}}/>
                                        <Bar dataKey="tickets" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Priority Bars */}
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-center">
                            <h3 className="text-sm font-bold text-white mb-8">By Priority</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                                        <span>Urgent</span>
                                        <span className="text-white">{priorityCounts.urgent}</span>
                                    </div>
                                    <div className="w-full bg-[#0f172a] rounded-full h-2">
                                        <div className="bg-red-500 h-2 rounded-full" style={{width: `${(priorityCounts.urgent / maxPriority) * 100}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                                        <span>High</span>
                                        <span className="text-white">{priorityCounts.high}</span>
                                    </div>
                                    <div className="w-full bg-[#0f172a] rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{width: `${(priorityCounts.high / maxPriority) * 100}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                                        <span>Medium</span>
                                        <span className="text-white">{priorityCounts.medium}</span>
                                    </div>
                                    <div className="w-full bg-[#0f172a] rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(priorityCounts.medium / maxPriority) * 100}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                                        <span>Low</span>
                                        <span className="text-white">{priorityCounts.low}</span>
                                    </div>
                                    <div className="w-full bg-[#0f172a] rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(priorityCounts.low / maxPriority) * 100}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Create Ticket Modal */}
                    {showCreateForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm p-4">
                            <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-2xl w-full max-w-lg">
                                <h3 className="text-2xl font-bold text-white mb-6">Create New Ticket</h3>
                                <form onSubmit={handleCreateTicket}>
                                    <input 
                                        type="text" 
                                        placeholder="Ticket Subject" 
                                        required
                                        value={newTicket.subject}
                                        onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3.5 mb-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all"
                                    />
                                    <textarea 
                                        placeholder="Describe your issue..." 
                                        required
                                        value={newTicket.description}
                                        onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3.5 mb-6 text-white h-32 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 resize-none transition-all"
                                    />
                                    <div className="flex gap-4 justify-end">
                                        <button type="button" onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-white px-4 py-2 transition-colors font-medium">Cancel</button>
                                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all">Submit Ticket</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Recent Tickets Table */}
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]">
                            <h3 className="text-sm font-bold text-white">Recent Tickets</h3>
                            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View all &rarr;</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-800">
                                    {tickets.map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#0f172a] border border-slate-700 flex flex-shrink-0 items-center justify-center text-slate-400 font-bold uppercase shadow-inner">
                                                        {ticket.requester?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-200 font-medium mb-1 group-hover:text-indigo-400 transition-colors">{ticket.subject}</p>
                                                        <p className="text-xs text-slate-500 truncate max-w-md">{ticket.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border 
                                                        ${ticket.priority === 'high' || ticket.priority === 'urgent' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                                          ticket.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                        {ticket.priority}
                                                    </span>
                                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border 
                                                        ${ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                                          ticket.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                                          ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                          'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {tickets.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-12 text-center text-slate-500">No tickets found. You can create a new ticket using the sidebar menu.</td>
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
