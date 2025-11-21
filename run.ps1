# Start backend and frontend servers together

Write-Host "Starting Expense Tracker..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Start backend
Write-Host "Starting backend server on port 5000..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'd:\Desktop\expense tracker\backend'; npm start"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend server on port 3000..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'd:\Desktop\expense tracker\frontend'; npm start"

Write-Host "=====================================" -ForegroundColor Green
Write-Host "Both servers are running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
