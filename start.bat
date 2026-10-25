@echo off
echo ==============================================
echo        Starting IMovies Services
echo ==============================================

echo [1/3] Starting MongoDB...
start "IMovies - MongoDB" "C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe" --dbpath C:\data\db

timeout /t 3 >nul

echo [2/3] Starting Backend Server (Port 5000)...
start "IMovies - Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 >nul

echo [3/3] Starting Frontend Server (Port 5173)...
start "IMovies - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==============================================
echo All services started!
echo Open your browser at: http://localhost:5173
echo ==============================================
echo.
pause
