# Task Management System - Startup Script
Write-Host "🚀 Starting Task Management System..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "📦 Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
$backendPath = "c:\Users\SAHIL\OneDrive - vit.ac.in\PROJECT INTERN\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; `$env:DATABASE_URL='file:./prisma/dev.db'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server (Port 3000)..." -ForegroundColor Green
$frontendPath = "c:\Users\SAHIL\OneDrive - vit.ac.in\PROJECT INTERN\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to open the app in your browser..." -ForegroundColor Yellow
Read-Host

Start-Process "http://localhost:3000"
