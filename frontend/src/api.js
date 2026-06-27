// EMERGENCY HACKATHON MOCK API
// This completely bypasses the backend and uses LocalStorage so it works 100% instantly on Vercel.

const getDB = () => {
    const defaultTickets = [
        { id: 1, subject: 'Login issue on portal', description: 'Users cannot login to the main portal since morning.', status: 'open', priority: 'high', requester: { name: 'Alice Smith' }, assignee: { name: 'John Doe' }, comments: [] },
        { id: 2, subject: 'Billing inquiry', description: 'I was charged twice for the last month.', status: 'pending', priority: 'medium', requester: { name: 'Bob Jones' }, comments: [] },
        { id: 3, subject: 'Feature request: Dark Mode', description: 'Would love to see a dark mode.', status: 'closed', priority: 'low', requester: { name: 'Charlie' }, comments: [] }
    ];
    
    return {
        users: JSON.parse(localStorage.getItem('users')) || [],
        tickets: JSON.parse(localStorage.getItem('tickets')) || defaultTickets
    };
};

const saveDB = (db) => {
    localStorage.setItem('users', JSON.stringify(db.users));
    localStorage.setItem('tickets', JSON.stringify(db.tickets));
};

const api = {
    post: async (url, data) => {
        const db = getDB();
        
        if (url === '/register') {
            const user = { id: Date.now(), ...data, role: 'admin' };
            db.users.push(user);
            saveDB(db);
            return { data: { user, token: 'mock-jwt-token' } };
        }
        if (url === '/login' || url === '/register') {
            let user = db.users.find(u => u.email === data.email);
            if (!user) {
                user = { 
                    id: Date.now(), 
                    email: data.email, 
                    name: data.name || (data.role === 'customer' ? 'Demo Customer' : 'Demo Admin'), 
                    company: data.company || '',
                    role: data.role || 'admin' 
                };
                db.users.push(user);
            } else {
                // Update role & name if provided
                user.role = data.role || user.role;
                if (data.name) user.name = data.name;
                if (data.company) user.company = data.company;
            }
            saveDB(db);
            return { data: { user, token: 'mock-jwt-token' } };
        }
        if (url === '/tickets') {
            const newTicket = {
                id: Date.now(),
                subject: data.subject || 'New Ticket',
                description: data.description || '',
                status: 'open',
                priority: 'medium',
                requester: { name: db.users[0]?.name || 'User' },
                comments: []
            };
            db.tickets.unshift(newTicket);
            saveDB(db);
            return { data: newTicket };
        }
        if (url.includes('/comments')) {
            const ticketId = parseInt(url.split('/')[2]);
            const ticketIndex = db.tickets.findIndex(t => t.id === ticketId);
            if (ticketIndex > -1) {
                if (!db.tickets[ticketIndex].comments) db.tickets[ticketIndex].comments = [];
                db.tickets[ticketIndex].comments.push({
                    id: Date.now(),
                    body: data.body,
                    is_internal: data.is_internal,
                    user: { name: db.users[0]?.name || 'Admin User' },
                    created_at: new Date().toISOString()
                });
                
                // Auto-update ticket status when admin replies
                db.tickets[ticketIndex].status = 'pending';
                db.tickets[ticketIndex].assignee = { name: db.users[0]?.name || 'Admin User' };
                
                saveDB(db);
            }
            return { data: { message: 'success' } };
        }
    },
    get: async (url, config) => {
        const db = getDB();
        
        if (url === '/user') {
            return { data: db.users[0] || { name: 'Demo User', role: 'admin' } };
        }
        if (url === '/tickets') {
            let filtered = db.tickets;
            if (config?.params?.status) {
                filtered = db.tickets.filter(t => t.status === config.params.status);
            }
            return { data: filtered };
        }
        if (url.startsWith('/tickets/')) {
            const id = parseInt(url.split('/')[2]);
            const ticket = db.tickets.find(t => t.id === id);
            return { data: ticket || db.tickets[0] };
        }
    }
};

export default api;
