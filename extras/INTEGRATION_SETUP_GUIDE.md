# 🌟 Hora - Frontend & Backend Integration Guide

This guide will help you get the Hora frontend and backend working together.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- MongoDB connection string (already configured)

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd c:\Users\junac\OneDrive\Desktop\HoraFull\HORA\HoraBackend\backend
npm install
# OR
pnpm install
```

### Step 2: Install Frontend Dependencies

```bash
cd c:\Users\junac\OneDrive\Desktop\HoraFull\HORA\HoraBackend\frontend
npm install
# OR
pnpm install
```

### Step 3: Backend Configuration

Create or update the `.env` file in the backend folder with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://junacullhaj3_db_user:07OJeANaRmHEItBa@cluster0.ow0aaym.mongodb.net/hora

# JWT
JWT_SECRET=hora_jwt_secret_development_key

# CORS - Allow frontend to communicate with backend
CORS_ORIGIN=http://localhost:5173

# Optional: Astrology API credentials
ASTROLOGY_API_USER_ID=your_astrology_api_user_id
ASTROLOGY_API_KEY=your_astrology_api_key

# Optional: OpenAI API
OPENAI_API_KEY=your_openai_api_key
```

### Step 4: Frontend Configuration

Create or update the `.env` file in the frontend folder with:

```env
# API Configuration - Backend URL
VITE_API_URL=http://localhost:5000
```

## 🏃 Running the Application

### Terminal 1 - Start the Backend

```bash
cd c:\Users\junac\OneDrive\Desktop\HoraFull\HORA\HoraBackend\backend
npm start
# OR for development with auto-reload
npm run dev
```

The backend will start on `http://localhost:5000`

### Terminal 2 - Start the Frontend

```bash
cd c:\Users\junac\OneDrive\Desktop\HoraFull\HORA\HoraBackend\frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔌 What's Been Connected

### Frontend → Backend Communication

1. **API Service** (`src/services/api.js`)
   - Centralized axios instance with automatic token management
   - Handles all API calls across the application
   - Auto-redirects to login on 401 errors

2. **Authentication Context** (`src/contexts/AuthContext.jsx`)
   - Manages user state globally
   - Handles login, registration, and logout
   - Stores JWT token in localStorage
   - Auto-includes token in all API requests

3. **Login Page** (Updated)
   - Now connects to backend `/api/users/login` endpoint
   - Displays validation errors from server
   - Redirects to home on successful login

### Backend API Endpoints Available

#### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user (returns JWT token)
- `GET /api/users/me` - Get current user (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

#### Astrology
- `POST /api/astro/natal` - Generate natal chart
- `POST /api/astro/astrocartography` - Generate astrocartography

#### AI Features
- `POST /api/ai/reading` - Generate reading
- `POST /api/ai/dream` - Interpret dream
- `POST /api/ai/past-life` - Past life analysis

#### Quiz
- `GET /api/quiz/daily` - Get daily quiz
- `POST /api/quiz/submit` - Submit quiz answers

#### Gamification
- `POST /api/gamify/checkin` - Daily check-in

#### Human Design
- `POST /api/hd/design` - Generate human design

## 📱 How to Use the API in Components

### Example: Making API Calls in React Components

```jsx
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

function MyComponent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetNatalChart = async () => {
    try {
      setLoading(true);
      const response = await astroAPI.getNatal({
        name: user.fullName,
        birthDateISO: user.birthday,
        place: user.birthPlace,
        latitude: 51.5074,
        longitude: -0.1278
      });
      console.log('Natal Chart:', response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleGetNatalChart} disabled={loading}>
      {loading ? 'Loading...' : 'Get Natal Chart'}
    </button>
  );
}
```

## 🔐 Authentication Flow

1. User enters email and password on login page
2. Frontend sends request to `POST /api/users/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Frontend automatically includes token in all subsequent requests
6. When token expires or is invalid, user is redirected to login

## 🛠️ Troubleshooting

### Backend won't start
- Ensure MongoDB connection string is correct
- Check that port 5000 is not in use
- Verify all dependencies are installed

### Frontend won't connect to backend
- Check that backend is running on port 5000
- Verify `VITE_API_URL=http://localhost:5000` in frontend `.env`
- Check browser console for CORS errors
- Ensure backend CORS is configured: `CORS_ORIGIN=http://localhost:5173`

### Login not working
- Check browser console for error messages
- Verify backend is receiving requests (check server logs)
- Ensure JWT_SECRET is set in backend `.env`
- Check that MongoDB is connected

### API calls return 401 Unauthorized
- User token may have expired
- Token might not be stored correctly in localStorage
- Backend JWT_SECRET might not match frontend's expectations

## 📦 Project Structure

```
HORA/
├── HoraBackend/
│   ├── backend/
│   │   ├── .env                 # Backend environment variables
│   │   ├── .env.example         # Example env file
│   │   ├── server.js            # Express server (CORS configured)
│   │   ├── controllers/         # Business logic
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Authentication & other middleware
│   │   └── utils/               # Helper functions
│   │
│   └── frontend/
│       ├── .env                 # Frontend environment variables
│       ├── .env.example         # Example env file
│       ├── src/
│       │   ├── services/
│       │   │   └── api.js       # Axios instance & API calls
│       │   ├── contexts/
│       │   │   └── AuthContext.jsx  # Authentication state management
│       │   ├── pages/           # Page components
│       │   ├── components/      # Reusable components
│       │   ├── App.jsx          # Main app with routes
│       │   └── main.jsx         # React entry point
│       └── vite.config.js       # Vite configuration
```

## ✅ Next Steps

1. Update other page components to use the API service
2. Implement error handling globally
3. Add loading states to components
4. Set up environment variables for production
5. Test all API endpoints
6. Configure additional features (astrology API, OpenAI API)

## 🆘 Need Help?

- Check the backend server logs for error messages
- Check the browser console (F12) for client-side errors
- Verify network requests in browser DevTools (Network tab)
- Ensure all environment variables are correctly set

---

**Happy cosmic coding! 🌟**
