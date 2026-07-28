<#
.SYNOPSIS
    AI-Driven Multilingual Healthcare Assistant - Launcher Script

.DESCRIPTION
    Builds and starts all Docker services for the Healthcare Assistant.

.PARAMETER Monitor
    Also start Prometheus and Grafana monitoring services.

.PARAMETER Stop
    Stop all running services.

.PARAMETER Reset
    Stop services, remove data volumes, and restart fresh.

.EXAMPLE
    .\run.ps1
    .\run.ps1 -Monitor
    .\run.ps1 -Stop
    .\run.ps1 -Reset
#>

param(
    [switch]$Monitor,
    [switch]$Stop,
    [switch]$Reset
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

Write-Host ""
Write-Host "  [HEALTHCARE ASSISTANT] AI-Driven Multilingual Healthcare Assistant" -ForegroundColor Cyan
Write-Host "  ====================================================================" -ForegroundColor DarkCyan
Write-Host ""

# ── Check Docker is installed and running ─────────────────
function Test-Docker {
    try {
        $null = docker info 2>&1
        if ($LASTEXITCODE -ne 0) { throw "Docker not running" }
    } catch {
        Write-Host "  [ERROR] Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        Write-Host ""
        exit 1
    }
    Write-Host "  [OK] Docker is running" -ForegroundColor Green
}

# ── Stop all services ────────────────────────────────────
if ($Stop) {
    Test-Docker
    Write-Host "  [STOP] Stopping all services..." -ForegroundColor Yellow
    docker compose --project-directory $ProjectRoot down
    Write-Host ""
    Write-Host "  [OK] All services stopped." -ForegroundColor Green
    Write-Host ""
    exit 0
}

# ── Reset (stop + remove volumes + restart) ──────────────
if ($Reset) {
    Test-Docker
    Write-Host "  [WARN] Resetting: stopping services and removing data volumes..." -ForegroundColor Yellow
    docker compose --project-directory $ProjectRoot down -v
    Write-Host "  [OK] Volumes removed. Restarting..." -ForegroundColor Green
    Write-Host ""
}

# ── Start services ───────────────────────────────────────
Test-Docker

if ($Monitor) {
    Write-Host "  [START] Starting all services WITH monitoring (Prometheus + Grafana)..." -ForegroundColor Cyan
    Write-Host ""
    docker compose --project-directory $ProjectRoot --profile monitoring up -d --build
} else {
    Write-Host "  [START] Starting core services (Frontend, Backend, PostgreSQL, Ollama)..." -ForegroundColor Cyan
    Write-Host ""
    docker compose --project-directory $ProjectRoot up -d --build
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  [ERROR] Failed to start services. Check the errors above." -ForegroundColor Red
    Write-Host ""
    exit 1
}

# ── Wait for PostgreSQL to be healthy ────────────────────
Write-Host ""
Write-Host "  [WAIT] Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxRetries = 30
$retry = 0
while ($retry -lt $maxRetries) {
    $health = docker inspect --format "{{.State.Health.Status}}" healthcare-postgres 2>$null
    if ($health -eq "healthy") {
        Write-Host "  [OK] PostgreSQL is healthy" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 2
    $retry++
}
if ($retry -ge $maxRetries) {
    Write-Host "  [WARN] PostgreSQL health check timed out (may still be starting)" -ForegroundColor Yellow
}

# ── Pull LLM model if not already present ────────────────
Write-Host ""
Write-Host "  [AI] Checking Ollama LLM model..." -ForegroundColor Cyan

# Give Ollama a moment to start
Start-Sleep -Seconds 3

$modelName = "gemma:2b"
$envFile = Join-Path $ProjectRoot ".env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "OLLAMA_MODEL=(\S+)") {
        $modelName = $Matches[1]
    }
}

$existingModels = docker exec healthcare-ollama ollama list 2>$null
if ($existingModels -and ($existingModels -match $modelName)) {
    Write-Host "  [OK] Model '$modelName' is already available" -ForegroundColor Green
} else {
    Write-Host "  [DOWNLOAD] Pulling model '$modelName' (this may take several minutes on first run)..." -ForegroundColor Yellow
    docker exec healthcare-ollama ollama pull $modelName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Model '$modelName' pulled successfully" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Failed to pull model. You can pull it manually later:" -ForegroundColor Yellow
        Write-Host "         docker exec -it healthcare-ollama ollama pull $modelName" -ForegroundColor DarkYellow
    }
}

# ── Print access info ────────────────────────────────────
Write-Host ""
Write-Host "  ====================================================================" -ForegroundColor DarkCyan
Write-Host "  [READY] All services are running!" -ForegroundColor Green
Write-Host "  ====================================================================" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  Frontend:       " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend API:    " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs:       " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000/docs" -ForegroundColor Cyan

if ($Monitor) {
    Write-Host "  Prometheus:     " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:9090" -ForegroundColor Cyan
    Write-Host "  Grafana:        " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:3001  (admin/admin)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "  Useful commands:" -ForegroundColor DarkGray
Write-Host "    .\run.ps1 -Stop     Stop all services" -ForegroundColor DarkGray
Write-Host "    .\run.ps1 -Reset    Reset database and restart" -ForegroundColor DarkGray
Write-Host "    .\run.ps1 -Monitor  Start with monitoring" -ForegroundColor DarkGray
Write-Host "    docker compose logs -f backend   View backend logs" -ForegroundColor DarkGray
Write-Host ""
