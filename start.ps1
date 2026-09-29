# Storyify Anime PowerShell Launcher
$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Magenta
Write-Host " Storyify Anime - Cinematic Anime Visual Novel Learning" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Magenta

$nodeDir = "C:\Users\prathamesh pipare\nodejs"
if (Test-Path "$nodeDir\node.exe") {
    $env:PATH = "$nodeDir;$env:PATH"
}

Write-Host "Node version: $(node -v)" -ForegroundColor Green
Write-Host "NPM version:  $(npm -v)" -ForegroundColor Green

if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Launching Next.js development server at http://localhost:3000..." -ForegroundColor Cyan
npm run dev
