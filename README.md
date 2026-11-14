# Barnet Roleplay - Discord OAuth Example

This repository contains a static frontend and a small Node/Express backend to demonstrate Discord OAuth2 login.

## What this does
- Frontend (`index.html`) redirects users to Discord OAuth2 when clicking **Login**.
- `auth-callback.html` receives the authorization code and sends it to the backend.
- Backend (`server.js`) exchanges the code for tokens and returns the Discord user info.

## Setup
1. Create a Discord Application in the Discord Developer Portal.
2. Add a redirect URI: `http://localhost:3000/auth-callback.html`
3. Note your **Client ID** and **Client Secret**.

## Environment
Create a `.env` file in the project root with:

```
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:3000/auth-callback.html
PORT=3000
```

## Install & Run

```bash
npm install
npm start
```

Then open `http://localhost:3000` in your browser and click **Login**.

## Security
- Keep your `DISCORD_CLIENT_SECRET` private. Do not commit it to source control.
- For production use, secure HTTPS redirect URIs and session handling.

## Next steps
- Add session cookies and database storage for users.
- Integrate with your Discord bot to add the user to a guild or post messages.
