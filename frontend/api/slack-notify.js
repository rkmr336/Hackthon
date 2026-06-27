// Vercel Serverless Function - Slack Proxy
// This runs on the SERVER side, so no CORS issues!

export default async function handler(req, res) {
    // Allow CORS from our frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const SLACK_BOT_TOKEN = process.env.VITE_SLACK_BOT_TOKEN || process.env.SLACK_BOT_TOKEN;

    if (!SLACK_BOT_TOKEN) {
        return res.status(500).json({ error: 'Slack token not configured' });
    }

    try {
        const { channel, text, blocks } = req.body;

        const body = { channel, text };
        if (blocks) body.blocks = blocks;

        const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
            },
            body: JSON.stringify(body),
        });

        const data = await slackRes.json();

        if (!data.ok) {
            console.error('Slack error:', data.error);
            return res.status(400).json({ error: data.error });
        }

        return res.status(200).json({ ok: true, ts: data.ts });
    } catch (err) {
        console.error('Slack proxy error:', err);
        return res.status(500).json({ error: err.message });
    }
}
