# 🌟 Hora - Astrology Platform (Integrated Setup)

A full-stack astrology platform with React frontend and Node.js/Express backend.

## 🎯 What's Been Set Up

Your frontend and backend are now fully integrated! Here's what has been configured:

### ✅ Backend (Node.js + Express)
- RESTful API with Express.js
- MongoDB database integration
- JWT authentication
- CORS configured for frontend communication
- Multiple feature routes: Users, Astrology, AI, Quiz, Gamification, Human Design

### ✅ Frontend (React + Vite)
- Modern React application with Vite bundler
- React Router for navigation
- Axios for API communication
- Context API for state management
- Authentication system with JWT tokens
- Responsive UI with Tailwind CSS

### ✅ Integration
- API service layer for all HTTP requests
- Authentication context for user state management
- Automatic token management in requests
- Error handling and redirects
- Environment configuration files

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ and npm (or pnpm)
- Internet connection (for MongoDB Atlas)

### Quick Start (2 Terminals)

**Terminal 1 - Backend:**
```bash
cd HoraBackend\backend
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd HoraBackend\frontend
npm install
npm run dev
```

Then open: `http://localhost:5173`

### Or Use the Startup Script
On Windows, simply double-click:
```
start-servers.bat
```

This will automatically open both servers in separate terminals.

## 📁 File Structure

```
HORA/
├── HoraBackend/
│   ├── backend/
│   │   ├── .env                      # ← Set your configurations here
│   │   ├── server.js                 # Main server file
│   │   ├── package.json
│   │   ├── controllers/              # API logic
│   │   ├── models/                   # MongoDB schemas
│   │   ├── routes/                   # API endpoints
│   │   ├── middleware/               # Auth & other middleware
│   │   └── utils/                    # Helper functions
│   │
│   └── frontend/
│       ├── .env                      # ← Set VITE_API_URL here
│       ├── .env.example
│       ├── package.json
│       ├── src/
│       │   ├── services/
│       │   │   └── api.js            # All API calls go through here
│       │   ├── contexts/
│       │   │   └── AuthContext.jsx   # User authentication state
│       │   ├── pages/                # Page components
│       │   ├── components/           # Reusable components
│       │   ├── App.jsx
│       │   └── main.jsx
│       └── vite.config.js
│
├── INTEGRATION_SETUP_GUIDE.md         # Detailed configuration guide
├── verify-integration.js              # Run: node verify-integration.js
└── start-servers.bat                  # Windows startup script

```

## ⚙️ Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🔌 How to Use API Endpoints

### In React Components

```jsx
import { useAuth } from '../contexts/AuthContext';
import { authAPI, astroAPI, aiAPI } from '../services/api';

function MyComponent() {
  const { user, login, logout } = useAuth();

  // Login
  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };

  // Get natal chart
  const handleGetNatal = async () => {
    const result = await astroAPI.getNatal({
      birthDateISO: '1995-08-15T10:25:00.000Z',
      place: 'London, UK'
    });
    console.log(result.data);
  };

  return <div>...</div>;
}
```

## 📚 Available API Endpoints

### User Management
```
POST   /api/users/register     - Register new user
POST   /api/users/login        - Login (returns token)
GET    /api/users/me           - Get current user (requires auth)
PUT    /api/users/profile      - Update profile (requires auth)
```

### Astrology
```
POST   /api/astro/natal        - Generate natal chart
POST   /api/astro/astrocartography - Astrocartography
```

### AI
```
POST   /api/ai/reading         - Generate reading
POST   /api/ai/dream           - Interpret dream
POST   /api/ai/past-life       - Past life analysis
```

### Quiz
```
GET    /api/quiz/daily         - Get daily quiz
POST   /api/quiz/submit        - Submit answers
```

### Gamification
```
POST   /api/gamify/checkin     - Daily check-in
```

### Human Design
```
POST   /api/hd/design          - Generate design chart
```

## 🔐 Authentication Flow

1. User enters credentials on Login page
2. Frontend sends `POST /api/users/login`
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. Token automatically included in all subsequent requests
6. On token expiry → automatic redirect to login

## 🧪 Verification

Run the verification script to check your setup:
```bash
node verify-integration.js
```

This checks:
- ✅ .env files exist and are configured
- ✅ All dependencies are listed
- ✅ API service layer exists
- ✅ Auth context exists

## 🆘 Troubleshooting

### Frontend can't connect to backend
**Error:** `Failed to fetch http://localhost:5000`

**Solutions:**
1. Verify backend is running on port 5000
2. Check `VITE_API_URL=http://localhost:5000` in frontend `.env`
3. Restart frontend dev server (Vite caches env vars)
4. Check browser console for detailed errors

### Login fails
**Error:** `401 Unauthorized` or `Cannot POST /api/users/login`

**Solutions:**
1. Verify MongoDB connection: `mongodb+srv://...` in backend `.env`
2. Check user exists in database
3. Verify password is correct
4. Check backend server logs for error messages

### CORS errors
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Set `CORS_ORIGIN=http://localhost:5173` in backend `.env`
2. Restart backend server
3. Clear browser cache (Ctrl+Shift+Delete)

### Port already in use
**Error:** `Error: listen EADDRINUSE :::5000`

**Solutions:**
1. Close other applications using port 5000
2. Or change PORT in backend `.env`
3. Update `VITE_API_URL` to match new port

## 📝 Next Steps

1. **Update Components** - Connect existing pages to API endpoints
2. **Add Error Handling** - Implement global error handling
3. **Loading States** - Add loading indicators to components
4. **Validation** - Add form validation for user inputs
5. **Environment Management** - Set up production configurations
6. **Testing** - Write unit and integration tests

## 📊 Tech Stack

**Backend:**
- Node.js / Express.js
- MongoDB / Mongoose
- JWT Authentication
- Axios for HTTP requests

**Frontend:**
- React 19
- Vite (bundler)
- React Router v7
- Axios
- Tailwind CSS
- Context API (state management)

## 🌟 Key Features Integrated

- ✅ User authentication with JWT
- ✅ API service layer with interceptors
- ✅ Global auth context
- ✅ Protected routes ready to implement
- ✅ Environment configuration
- ✅ CORS configured for local development
- ✅ Error handling middleware
- ✅ Request logging

## 📞 Support

For detailed setup instructions, see: `INTEGRATION_SETUP_GUIDE.md`

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Status:** ✅ Frontend & Backend Integrated & Ready
