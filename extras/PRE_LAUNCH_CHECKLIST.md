# ✅ Pre-Launch Checklist

## Before You Start

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm or pnpm available (`npm --version`)
- [ ] MongoDB connection works (Atlas account set up)
- [ ] Ports 5000 and 5173 are free

## Installation

- [ ] `cd HoraBackend\backend && npm install` completed
- [ ] `cd HoraBackend\frontend && npm install` completed
- [ ] No installation errors seen
- [ ] All dependencies listed correctly

## Configuration

Backend (.env created and filled):
- [ ] PORT=5000
- [ ] MONGODB_URI set (MongoDB connection string)
- [ ] JWT_SECRET set (secure key)
- [ ] CORS_ORIGIN=http://localhost:5173

Frontend (.env created and filled):
- [ ] VITE_API_URL=http://localhost:5000

## Files Verification

Backend:
- [ ] `backend/.env` file exists
- [ ] `backend/server.js` has CORS config
- [ ] `backend/routes/userRoutes.js` exists

Frontend:
- [ ] `frontend/.env` file exists
- [ ] `frontend/src/services/api.js` exists
- [ ] `frontend/src/contexts/AuthContext.jsx` exists
- [ ] `frontend/src/pages/Login.jsx` updated
- [ ] `frontend/src/App.jsx` has AuthProvider

## Pre-Run Tests

- [ ] Run: `node verify-integration.js` (all checks pass)
- [ ] No error messages in console

## Startup

Terminal 1 - Backend:
- [ ] `cd HoraBackend\backend`
- [ ] `npm start`
- [ ] See: "Server running on port 5000"
- [ ] See: "MongoDB connected successfully"
- [ ] No error messages

Terminal 2 - Frontend:
- [ ] `cd HoraBackend\frontend`
- [ ] `npm run dev`
- [ ] See: "Local: http://localhost:5173"
- [ ] No error messages

## Browser Testing

- [ ] Open: http://localhost:5173
- [ ] See: Hora application loads
- [ ] No CORS errors in console
- [ ] No 404 errors in network tab

## Login Testing

- [ ] Click Login button
- [ ] Enter valid credentials (from MongoDB)
- [ ] See: Request goes to http://localhost:5000/api/users/login
- [ ] See: Response with JWT token
- [ ] See: Token stored in localStorage
- [ ] See: Redirect to home page (or dashboard)

## Post-Login

- [ ] User information displays correctly
- [ ] Navigation works
- [ ] Pages load without API errors
- [ ] No 401 errors for authenticated requests

## API Communication

- [ ] Backend receives requests from frontend
- [ ] Frontend receives responses from backend
- [ ] No CORS errors in browser console
- [ ] No network errors in DevTools

## Optional: Advanced Checks

- [ ] Test /api/test endpoint directly: http://localhost:5000/api/test
- [ ] Check backend logs for all requests
- [ ] Check browser DevTools Network tab
- [ ] Check browser LocalStorage for token
- [ ] Verify API requests include Authorization header

## Troubleshooting Checklist

If something doesn't work:

- [ ] Backend running? (Check Terminal 1)
- [ ] Frontend running? (Check Terminal 2)
- [ ] .env files created? (Both folders)
- [ ] Port 5000 free? (Try: netstat -ano | findstr :5000)
- [ ] MongoDB connected? (Check backend logs)
- [ ] CORS_ORIGIN correct? (Should be http://localhost:5173)
- [ ] VITE_API_URL correct? (Should be http://localhost:5000)
- [ ] Browser cache cleared? (Ctrl+Shift+Delete)
- [ ] Browser console shows errors? (F12 → Console)
- [ ] Network tab shows requests? (F12 → Network)

## Documentation

- [ ] Read: QUICK_START.md
- [ ] Read: INTEGRATION_SETUP_GUIDE.md (if issues)
- [ ] Read: README_INTEGRATION.md (for API docs)
- [ ] Read: CHANGES_MADE.md (to see what changed)

## Ready to Develop!

Once everything above is checked:

- [ ] Pick a page component to connect
- [ ] Import API from `../services/api`
- [ ] Make API calls using the connected endpoints
- [ ] Add loading/error states
- [ ] Test in browser
- [ ] Repeat for all components

## Useful Commands

Backend:
```bash
npm start      # Production mode
npm run dev    # Development with auto-reload
```

Frontend:
```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # Check code style
```

## Emergency Fixes

### Backend won't start
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm start
```

### Port already in use
```bash
# Windows - find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### CORS not working
- Restart backend after changing CORS_ORIGIN
- Clear browser cache
- Try incognito mode

### Token not working
- Check JWT_SECRET matches backend
- Verify token exists in localStorage
- Check token hasn't expired
- Try logging out and back in

## Notes

- Keep both terminal windows open while developing
- Changes to files will auto-reload (hot reload enabled)
- Check console frequently for error messages
- Use browser DevTools (F12) to debug frontend
- Check backend logs to debug backend

## Success Indicators

You'll know everything works when:

✅ Frontend loads at http://localhost:5173
✅ You can see the Hora application UI
✅ Login page appears without CORS errors
✅ API request goes to backend (seen in DevTools)
✅ Login succeeds and redirects to home
✅ User information displays
✅ No red errors in browser console

## Final Notes

- This checklist ensures smooth setup
- If stuck, check browser console first
- Verify ports are correct (5000, 5173)
- Ensure .env files have correct values
- Both servers MUST be running

---

**When all items are checked, you're good to go! 🚀**
