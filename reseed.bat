@echo off
echo ==============================================
echo    Reseeding IMovies Database with Fresh Shows
echo ==============================================
cd backend
node seed/seedDB.js
echo.
echo Database reseeded successfully!
pause
