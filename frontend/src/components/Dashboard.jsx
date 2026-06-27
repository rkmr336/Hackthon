import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

function Dashboard({ user }) {
    const [tickets, setTickets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

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

    // Calculate chart data
    const statusData = [
        { name: 'Open', value: tickets.filter(t => t.status === 'open').length },
        { name: 'Pending', value: tickets.filter(t => t.status === 'pending').length },
        { name: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length },
        { name: 'Closed', value: tickets.filter(t => t.status === 'closed').length },
    ].filter(d => d.value > 0);

    const priorityData = [
        { name: 'High', count: tickets.filter(t => t.priority === 'high').length },
        { name: 'Medium', count: tickets.filter(t => t.priority === 'medium').length },
        { name: 'Low', count: tickets.filter(t => t.priority === 'low').length },
    ];

    const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6b7280'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">PulseDesk</h1>
                    <div className="flex gap-6 items-center">
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="text-xl focus:outline-none"
                            title="Toggle Dark Mode"
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <span className="text-gray-600 dark:text-gray-300">Hi, {user?.name}</span>
                        <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-600">Logout</button>
                    </div>
                </div>
            </nav>
            
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Analytics Section */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Tickets by Status</h3>
                        <div className="h-64">
                            {statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No data available</div>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Tickets by Priority</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priorityData}>
                                    <XAxis dataKey="name" stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
                                    <YAxis stroke={isDarkMode ? '#9ca3af' : '#4b5563'} />
                                    <RechartsTooltip cursor={{fill: isDarkMode ? '#374151' : '#f3f4f6'}} contentStyle={{backgroundColor: isDarkMode ? '#1f2937' : '#fff', borderColor: isDarkMode ? '#374151' : '#e5e7eb', color: isDarkMode ? '#fff' : '#000'}}/>
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Tickets Table */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recent Tickets</h2>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border dark:border-gray-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">Subject</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">Priority</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">Assignee</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                                    <td className="px-6 py-5 text-gray-800 dark:text-gray-200 font-medium">{ticket.subject}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                                            ${ticket.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                              ticket.status === 'closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 
                                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-gray-600 dark:text-gray-400 capitalize">{ticket.priority}</td>
                                    <td className="px-6 py-5 text-gray-600 dark:text-gray-400">{ticket.assignee ? ticket.assignee.name : 'Unassigned'}</td>
                                </tr>
                            ))}
                            {tickets.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No tickets found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
