import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function TicketDetail({ user }) {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [replyBody, setReplyBody] = useState('');
    const [isInternal, setIsInternal] = useState(false);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const res = await api.get(`/tickets/${id}`);
            setTicket(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/tickets/${id}/comments`, {
                body: replyBody,
                is_internal: isInternal
            });
            setReplyBody('');
            setIsInternal(false);
            fetchTicket();
        } catch (err) {
            console.error(err);
        }
    };

    if (!ticket) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
                    <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Tickets</Link>
                    <h1 className="text-xl font-bold text-gray-800 flex-1">Ticket #{ticket.id}</h1>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded shadow p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold">{ticket.subject}</h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {ticket.status}
                        </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                    <div className="mt-6 pt-4 border-t text-sm text-gray-500 flex gap-6">
                        <p><strong>Requester:</strong> {ticket.requester?.name}</p>
                        <p><strong>Priority:</strong> {ticket.priority}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {ticket.comments?.map(comment => (
                        <div key={comment.id} className={`p-4 rounded shadow-sm ${comment.is_internal ? 'bg-yellow-50 border border-yellow-200' : 'bg-white'}`}>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">{comment.user?.name} {comment.is_internal && '(Internal Note)'}</span>
                                <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{comment.body}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded shadow p-6">
                    <h3 className="font-semibold mb-4 text-lg">Leave a Reply</h3>
                    <form onSubmit={handleReply}>
                        <textarea 
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            className="w-full border rounded p-3 mb-4 focus:outline-none focus:border-blue-500 min-h-[100px]"
                            placeholder="Type your message here..."
                            required
                        ></textarea>
                        
                        <div className="flex items-center justify-between">
                            {user?.role !== 'customer' ? (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isInternal}
                                        onChange={(e) => setIsInternal(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Internal Note</span>
                                </label>
                            ) : <div></div>}
                            
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                                Submit Reply
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default TicketDetail;
