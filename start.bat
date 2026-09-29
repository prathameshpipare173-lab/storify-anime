@echo off
title Storyify Anime Development Server
setlocal

echo ========================================================
echo  Storyify Anime - Cinematic Anime Visual Novel Learning
echo ========================================================
echo.

set "PATH=C:\Users\prathamesh pipare\nodejs;%PATH%"

echo Checking Node.js installation...
node -v
if %errorlevel% neq 0 (
    echo Error: Node.js was not found in PATH or C:\Users\prathamesh pipare\nodejs
    pause
    exit /b %errorlevel%
)

if not exist "node_modules\" (
    echo Installing dependencies (Next.js, Tailwind, Framer Motion, Lucide)...
    call npm install
)

echo Starting Storyify Anime dev server on http://localhost:3000 ...
call npm run dev

pause
