import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function TicketDetail({ user }) {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [replyBody, setReplyBody] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

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

    const generateAIReply = () => {
        if (isGenerating) return;
        setIsGenerating(true);
        setReplyBody('');
        
        const aiResponse = `Hi ${ticket.requester?.name || 'Customer'},\n\nThank you for reaching out to us. I understand that you are experiencing an issue regarding "${ticket.subject}".\n\nOur engineering team has been notified and we are currently investigating this with high priority. We will provide you with an update within the next 24 hours.\n\nIf you have any further questions in the meantime, please let me know.\n\nBest regards,\n${user?.name || 'Support Team'}`;
        
        let index = 0;
        const interval = setInterval(() => {
            setReplyBody((prev) => prev + aiResponse.charAt(index));
            index++;
            if (index >= aiResponse.length) {
                clearInterval(interval);
                setIsGenerating(false);
            }
        }, 15); // Typing speed
    };

    if (!ticket) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
                    <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-2">
                        <span>&larr;</span> Back to Dashboard
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex-1">Ticket #{ticket.id}</h1>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{ticket.subject}</h2>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                            ${ticket.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                              ticket.status === 'closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                    <div className="mt-6 pt-4 border-t dark:border-gray-700 text-sm flex gap-8">
                        <p className="text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200">Requester:</strong> {ticket.requester?.name}</p>
                        <p className="text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200">Priority:</strong> <span className="capitalize">{ticket.priority}</span></p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {ticket.comments?.map(comment => (
                        <div key={comment.id} className={`p-5 rounded-2xl shadow-sm border ${comment.is_internal ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50' : 'bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
                            <div className="flex justify-between mb-3">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {comment.user?.name} 
                                    {comment.is_internal && <span className="ml-2 text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-full">Internal Note</span>}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{comment.body}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Leave a Reply</h3>
                        
                        <div className="flex gap-2">
                            <button 
                                type="button"
                                onClick={async () => {
                                    const db = JSON.parse(localStorage.getItem('tickets')) || [];
                                    const tIndex = db.findIndex(t => t.id === parseInt(id));
                                    if (tIndex > -1) {
                                        db[tIndex].status = 'resolved';
                                        localStorage.setItem('tickets', JSON.stringify(db));
                                        fetchTicket();
                                    }
                                }}
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                            >
                                ✓ Mark as Resolved
                            </button>
                            
                            {user?.role !== 'customer' && (
                                <button 
                                    type="button"
                                    onClick={generateAIReply}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <span>✨</span>
                                    {isGenerating ? 'Generating...' : 'AI Auto-Reply'}
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <form onSubmit={handleReply}>
                        <textarea 
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-100 min-h-[150px] transition-all"
                            placeholder="Type your message here..."
                            required
                        ></textarea>
                        
                        <div className="flex items-center justify-between">
                            {user?.role !== 'customer' ? (
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={isInternal}
                                        onChange={(e) => setIsInternal(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Internal Note</span>
                                </label>
                            ) : <div></div>}
                            
                            <button 
                                type="submit" 
                                disabled={isGenerating || !replyBody.trim()}
                                className="bg-indigo-600 text-white font-medium px-8 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
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
