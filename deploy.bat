@echo off
REM ChatLANTERN Frontend Deployment Script for Windows

echo.
echo ================================
echo ChatLANTERN Deployment
echo ================================
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI not found
    echo [INFO] Installing Vercel CLI...
    npm i -g vercel
)

REM Check if .env.local exists
if not exist .env.local (
    echo [WARNING] .env.local not found
    echo [INFO] Creating from .env.example...
    copy .env.example .env.local
    echo.
    echo [WARNING] Please update NEXT_PUBLIC_API_URL in .env.local
    echo           Then run this script again
    pause
    exit /b 1
)

REM Build locally first
echo [INFO] Building locally...
call pnpm build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo [SUCCESS] Build successful
echo.

REM Deploy to Vercel
echo [INFO] Deploying to Vercel...
call vercel --prod

echo.
echo [SUCCESS] Deployment complete!
echo.
echo Next steps:
echo   1. Set NEXT_PUBLIC_API_URL in Vercel dashboard
echo   2. Redeploy if needed
echo   3. Test your deployment
echo.
echo Vercel Dashboard: https://vercel.com/dashboard
echo.
pause
