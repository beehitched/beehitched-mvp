@echo off
chcp 65001 >nul
echo ==================================================
echo Welcome to BeeHitched Wedding Planning App Setup!
echo ==================================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo SUCCESS: Node.js version: 
node --version
echo.

REM Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo SUCCESS: npm version:
npm --version
echo.

REM Install root dependencies
echo Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)
echo SUCCESS: Root dependencies installed
echo.

REM Install client dependencies
echo Installing client dependencies...
cd client
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
cd ..
echo SUCCESS: Client dependencies installed
echo.

REM Install server dependencies
echo Installing server dependencies...
cd server
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
cd ..
echo SUCCESS: Server dependencies installed
echo.

REM Create environment files
echo Setting up environment files...

REM Server environment
if not exist "server\.env" (
    echo Creating server .env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/beehitched
        echo JWT_SECRET=your-super-secret-jwt-key-change-in-production
        echo PORT=5000
        echo NODE_ENV=development
        echo CLIENT_URL=http://localhost:3000
    ) > server\.env
    echo SUCCESS: Server .env file created
) else (
    echo INFO: Server .env file already exists
)

REM Client environment
if not exist "client\.env.local" (
    echo Creating client .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ) > client\.env.local
    echo SUCCESS: Client .env.local file created
) else (
    echo INFO: Client .env.local file already exists
)

echo.
echo ==================================================
echo SETUP COMPLETE!
echo ==================================================
echo.
echo Next steps:
echo.
echo 1. Start MongoDB (if running locally):
echo    mongod
echo.
echo 2. Seed the database with sample data:
echo    cd server
echo    npm run seed
echo    cd ..
echo.
echo 3. Start the development servers:
echo    npm run dev
echo.
echo 4. Access the application:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5000
echo.
echo 5. Test accounts:
echo    Email: sarah@example.com
echo    Password: password123
echo.
echo Happy wedding planning!
echo ==================================================
pause