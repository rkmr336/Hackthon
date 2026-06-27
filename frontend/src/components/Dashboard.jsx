import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard({ user }) {
    const [tickets, setTickets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
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

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">PulseDesk</h1>
                    <div className="flex gap-4 items-center">
                        <span className="text-gray-600">Hi, {user?.name} ({user?.role})</span>
                        <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
                    </div>
                </div>
            </nav>
            
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Tickets</h2>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded px-3 py-1 bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-xs">Subject</th>
                                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-xs">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-xs">Priority</th>
                                <th className="px-6 py-3 font-medium text-gray-500 uppercase text-xs">Assignee</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                                    <td className="px-6 py-4">{ticket.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{ticket.priority}</td>
                                    <td className="px-6 py-4">{ticket.assignee ? ticket.assignee.name : 'Unassigned'}</td>
                                </tr>
                            ))}
                            {tickets.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No tickets found.</td>
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
