require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/auth/token', async (req, res) => {
    const code = req.body && req.body.code;
    if (!code) return res.status(400).json({ error: 'Missing code' });

    const client_id = process.env.DISCORD_CLIENT_ID;
    const client_secret = process.env.DISCORD_CLIENT_SECRET;
    const redirect_uri = process.env.DISCORD_REDIRECT_URI || `http://localhost:${PORT}/auth-callback.html`;

    if (!client_id || !client_secret) {
        return res.status(500).json({ error: 'Server not configured with DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET' });
    }

    const params = new URLSearchParams();
    params.append('client_id', client_id);
    params.append('client_secret', client_secret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);

    try {
        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
        const tokens = await tokenRes.json();
        if (tokens.error) return res.status(400).json({ error: tokens.error, details: tokens });

        // Optionally fetch the user's identity
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        const user = await userRes.json();

        return res.json({ tokens, user });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Public config endpoint (exposes only public client_id)
app.get('/config', (req, res) => {
    const client_id = process.env.DISCORD_CLIENT_ID || null;
    res.json({ client_id });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
