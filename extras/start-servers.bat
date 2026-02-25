@echo off
REM Hora - Frontend & Backend Startup Script for Windows

echo.
echo ========================================
echo   HORA - Astrology Platform
echo   Starting Frontend and Backend
echo ========================================
echo.

REM Check if backend folder exists
if not exist "HoraBackend\backend" (
  echo Error: Backend folder not found
  exit /b 1
)

REM Check if frontend folder exists
if not exist "HoraBackend\frontend" (
  echo Error: Frontend folder not found
  exit /b 1
)

echo.
echo 📋 Important Notes:
echo.
echo 1. This script will open two terminal windows
echo 2. Backend will run on: http://localhost:5000
echo 3. Frontend will run on: http://localhost:5173
echo.
echo 4. Make sure to:
echo    - Have installed Node.js
echo    - Created .env files in both backend and frontend folders
echo.
echo 5. You can stop servers with Ctrl+C in each terminal
echo.

pause

REM Start backend in new terminal
echo Starting backend server...
start cmd /k "cd HoraBackend\backend && npm install && npm start"

REM Wait a moment before starting frontend
timeout /t 2 /nobreak

REM Start frontend in new terminal
echo Starting frontend server...
start cmd /k "cd HoraBackend\frontend && npm install && npm run dev"

echo.
echo ✅ Both servers are starting...
echo.
echo Once both are running:
echo 1. Open http://localhost:5173 in your browser
echo 2. You should see the Hora application
echo.

pause
