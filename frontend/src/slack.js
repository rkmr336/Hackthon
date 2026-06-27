// Slack Integration for PulseDesk
// Uses a Vercel serverless function proxy to avoid CORS issues.

const CHANNELS = {
    allteam: 'C0BDLC9BMC2',      // allpulsedeskteam
    log: 'C0BDQ44NU84',           // log
    humanreview: 'C0BDH35EMPX',   // humanreview
    cicd: 'C0BDH33NDL5',          // cicd
    coder: 'C0BDH30KQF7',         // agent coder
};

async function postToSlack(channel, text, blocks = null) {
    try {
        const body = { channel, text };
        if (blocks) body.blocks = blocks;

        // Call our own Vercel serverless proxy (no CORS issues!)
        const res = await fetch('/api/slack-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!data.ok) console.warn('Slack error:', data.error);
        return data;
    } catch (err) {
        console.warn('Slack post failed:', err);
    }
}

export async function notifyNewTicket(ticket, user) {
    const blocks = [
        {
            type: 'header',
            text: { type: 'plain_text', text: '🎫 New Support Ticket Created', emoji: true }
        },
        {
            type: 'section',
            fields: [
                { type: 'mrkdwn', text: `*Subject:*\n${ticket.subject}` },
                { type: 'mrkdwn', text: `*Submitted by:*\n${user?.name || user?.email || 'Unknown'}` },
                { type: 'mrkdwn', text: `*Priority:*\n${ticket.priority || 'medium'}` },
                { type: 'mrkdwn', text: `*Status:*\n🟡 Open` },
            ]
        },
        {
            type: 'section',
            text: { type: 'mrkdwn', text: `*Description:*\n>${ticket.description}` }
        },
        { type: 'divider' }
    ];

    // Notify team channel
    await postToSlack(CHANNELS.allteam, `🎫 New ticket: "${ticket.subject}" from ${user?.name || user?.email}`, blocks);
    // Log it
    await postToSlack(CHANNELS.log, `[LOG] New ticket #${ticket.id} created by ${user?.email}`);
}

export async function notifyTicketReply(ticket, reply, agent) {
    const blocks = [
        {
            type: 'header',
            text: { type: 'plain_text', text: '💬 New Reply on Ticket', emoji: true }
        },
        {
            type: 'section',
            fields: [
                { type: 'mrkdwn', text: `*Ticket:*\n${ticket.subject}` },
                { type: 'mrkdwn', text: `*Agent:*\n${agent?.name || agent?.email || 'Support Agent'}` },
            ]
        },
        {
            type: 'section',
            text: { type: 'mrkdwn', text: `*Reply:*\n>${reply}` }
        },
        { type: 'divider' }
    ];

    await postToSlack(CHANNELS.allteam, `💬 Reply on ticket "${ticket.subject}"`, blocks);
    await postToSlack(CHANNELS.log, `[LOG] Agent ${agent?.email} replied on ticket #${ticket.id}`);
}

export async function notifyAIReply(ticket, aiReply) {
    const blocks = [
        {
            type: 'header',
            text: { type: 'plain_text', text: '🤖 AI Auto-Reply Generated', emoji: true }
        },
        {
            type: 'section',
            fields: [
                { type: 'mrkdwn', text: `*Ticket:*\n${ticket.subject}` },
                { type: 'mrkdwn', text: `*Status:*\n🔄 Needs Human Review` },
            ]
        },
        {
            type: 'section',
            text: { type: 'mrkdwn', text: `*AI Draft Reply:*\n>${aiReply?.substring(0, 300)}${aiReply?.length > 300 ? '...' : ''}` }
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: { type: 'plain_text', text: '✅ Approve & Send', emoji: true },
                    style: 'primary',
                    value: `approve_${ticket.id}`
                },
                {
                    type: 'button',
                    text: { type: 'plain_text', text: '✏️ Edit Reply', emoji: true },
                    value: `edit_${ticket.id}`
                }
            ]
        },
        { type: 'divider' }
    ];

    // Human review channel gets AI reply notification
    await postToSlack(CHANNELS.humanreview, `🤖 AI reply generated for "${ticket.subject}" — needs review`, blocks);
    await postToSlack(CHANNELS.log, `[LOG] AI reply generated for ticket #${ticket.id}`);
}

export async function notifyTicketResolved(ticket, agent) {
    const text = `✅ Ticket Resolved: *"${ticket.subject}"* resolved by ${agent?.name || agent?.email || 'Agent'}`;
    await postToSlack(CHANNELS.allteam, text);
    await postToSlack(CHANNELS.log, `[LOG] Ticket #${ticket.id} resolved by ${agent?.email}`);
}

export async function notifyTicketClosed(ticket, agent) {
    const text = `🔒 Ticket Closed: *"${ticket.subject}"* closed by ${agent?.name || agent?.email || 'Agent'}`;
    await postToSlack(CHANNELS.allteam, text);
    await postToSlack(CHANNELS.log, `[LOG] Ticket #${ticket.id} closed by ${agent?.email}`);
}
