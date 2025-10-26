# Our-Ancestors (with Improved Auth)
This package contains a scaffold for the 'Our-Ancestors' site with an integrated authentication system:
- Backend: Node.js + Express + MongoDB (Gmail OTP via Nodemailer placeholder)
- Frontend: Static HTML/CSS pages inside /client (register, login, verify)

## Quick start (backend)
1. Copy `server/.env.example` to `server/.env` and fill values (use Gmail App Password for SMTP_PASS).
2. Start MongoDB (local or atlas).
3. Install & run:
   ```bash
   cd server
   npm install
   npm run dev   # or npm start
   ```

## Quick start (frontend)
Serve the `/client` folder using a static server (VSCode Live Server, `serve`, `http-server`, or your web host).
Example using `npx http-server` from repo root:
```bash
npx http-server ./client -p 5500
```
Then open http://localhost:5500

## Notes
- Replace SMTP_PASS with your Gmail App Password locally.
- Don't commit `.env` to GitHub.
- For production, use HTTPS, input validation, and secure cookie-based auth for refresh tokens.
