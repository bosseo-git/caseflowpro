@echo off
echo =============================================
echo       CaseFlowPro Setup and Test Script
echo =============================================

REM Check for required tools
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed.
    exit /b 1
)

where npx >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npx is not installed.
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Check if .env.local exists, if not, copy from .env.example
if not exist .env.local (
    echo Creating .env.local from .env.example...
    copy .env.example .env.local
    echo Warning: Please edit .env.local with your actual values!
    echo          particularly the GoHighLevel credentials.
)

REM Setup the database
echo Setting up the database...
call npx prisma db push

REM Build the application
echo Building the application...
call npm run build

echo =============================================
echo Setup complete! You can now start the development server with:
echo npm run dev
echo =============================================
echo.
echo Next steps:
echo 1. Edit .env.local with your GoHighLevel credentials
echo 2. Start the server with 'npm run dev'
echo 3. Create an account at http://localhost:3000/signup
echo 4. Configure GoHighLevel settings at http://localhost:3000/dashboard/settings
echo 5. Generate your widget at http://localhost:3000/dashboard/script-generator
echo.
echo For testing the widget with ngrok, run:
echo npx ngrok http 3000
echo Then use the ngrok URL in your GoHighLevel webhook configuration 