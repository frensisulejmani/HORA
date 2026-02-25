# 🚀 Hora - Quick Start Reference

## 📍 One-Command Start (Windows)
```bash
start-servers.bat
```

## 📍 Manual Start (Two Terminals)

**Terminal 1:**
```bash
cd HoraBackend\backend
npm install
npm start
```

**Terminal 2:**
```bash
cd HoraBackend\frontend
npm install
npm run dev
```

## 🔗 Access URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Test API:** http://localhost:5000/api/test

## ⚙️ Configuration Files

**Backend Config:**
- File: `HoraBackend\backend\.env`
- Key vars: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`

**Frontend Config:**
- File: `HoraBackend\frontend\.env`
- Key vars: `VITE_API_URL`

## 🧪 Verify Setup
```bash
node verify-integration.js
```

## 📚 Full Guides
- **Setup Guide:** `INTEGRATION_SETUP_GUIDE.md`
- **README:** `README_INTEGRATION.md`

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://junacullhaj3_db_user:07OJeANaRmHEItBa@cluster0.ow0aaym.mongodb.net/hora
JWT_SECRET=hora_jwt_secret_development_key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 🔌 Key Files Added

**Backend:**
- `.env` - Configuration file

**Frontend:**
- `.env` - Configuration file
- `src/services/api.js` - API client with axios
- `src/contexts/AuthContext.jsx` - User authentication state
- Updated `src/pages/Login.jsx` - Connected to backend

**Project Root:**
- `INTEGRATION_SETUP_GUIDE.md` - Detailed guide
- `README_INTEGRATION.md` - Comprehensive README
- `verify-integration.js` - Integration checker
- `start-servers.bat` - Startup script (Windows)

## 🎯 What's Connected

| Frontend | Backend | Status |
|----------|---------|--------|
| Login page | /api/users/login | ✅ Connected |
| Components | /api/* endpoints | 📋 Ready to connect |
| Auth Context | JWT auth system | ✅ Configured |
| API Service | Express backend | ✅ Integrated |

## ✅ Common Issues & Fixes

**Q: Frontend can't reach backend?**
- A: Check backend is running on port 5000 and `VITE_API_URL` is set

**Q: Login fails?**
- A: Check MongoDB is connected and user exists in database

**Q: CORS errors?**
- A: Set `CORS_ORIGIN=http://localhost:5173` in backend `.env`

**Q: Port 5000 already in use?**
- A: Change `PORT` in backend `.env` and update `VITE_API_URL`

## 📞 Next Steps

1. Install dependencies: `npm install` in both folders
2. Start servers using quick start above
3. Open http://localhost:5173 in browser
4. Test login with backend credentials
5. Connect other components to API endpoints

## 🌟 You're All Set!

Your frontend and backend are now integrated and ready to work together.

Happy cosmic coding! 🚀✨
