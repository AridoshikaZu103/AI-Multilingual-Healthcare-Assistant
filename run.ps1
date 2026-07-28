# ============================================================
#  🏥 AI-Driven Multilingual Healthcare Assistant — Launcher
# ============================================================
#  Usage:
#    .\run.ps1           → Start all core services
#    .\run.ps1 -Monitor  → Start with Prometheus + Grafana
#    .\run.ps1 -Stop     → Stop all services
#    .\run.ps1 -Reset    → Stop, remove volumes, and restart
# ============================================================

param(
    [switch]$Monitor,
    [switch]$Stop,
    [switch]$Reset
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

Write-Host ""
Write-Host "  🏥  AI-Driven Multilingual Healthcare Assistant" -ForegroundColor Cyan
Write-Host "  ================================================" -ForegroundColor DarkCyan
Write-Host ""

# ── Check Docker is installed and running ─────────────────
function Test-Docker {
    try {
        $null = docker info 2>&1
        if ($LASTEXITCODE -ne 0) { throw }
    }
    catch {
        Write-Host "  ❌  Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        Write-Host ""
        exit 1
    }
    Write-Host "  ✅  Docker is running" -ForegroundColor Green
}

# ── Stop all services ────────────────────────────────────
if ($Stop) {
    Test-Docker
    Write-Host "  🛑  Stopping all services..." -ForegroundColor Yellow
    docker compose --project-directory $ProjectRoot down
    Write-Host ""
    Write-Host "  ✅  All services stopped." -ForegroundColor Green
    Write-Host ""
    exit 0
}

# ── Reset (stop + remove volumes + restart) ──────────────
if ($Reset) {
    Test-Docker
    Write-Host "  ⚠️   Resetting: stopping services and removing data volumes..." -ForegroundColor Yellow
    docker compose --project-directory $ProjectRoot down -v
    Write-Host "  ✅  Volumes removed. Restarting..." -ForegroundColor Green
    Write-Host ""
}

# ── Start services ───────────────────────────────────────
Test-Docker

if ($Monitor) {
    Write-Host "  🚀  Starting all services WITH monitoring (Prometheus + Grafana)..." -ForegroundColor Cyan
    Write-Host ""
    docker compose --project-directory $ProjectRoot --profile monitoring up -d --build
} else {
    Write-Host "  🚀  Starting core services (Frontend, Backend, PostgreSQL, Ollama)..." -ForegroundColor Cyan
    Write-Host ""
    docker compose --project-directory $ProjectRoot up -d --build
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  ❌  Failed to start services. Check the errors above." -ForegroundColor Red
    Write-Host ""
    exit 1
}

# ── Wait for PostgreSQL to be healthy ────────────────────
Write-Host ""
Write-Host "  ⏳  Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxRetries = 30
$retry = 0
while ($retry -lt $maxRetries) {
    $health = docker inspect --format "{{.State.Health.Status}}" healthcare-postgres 2>$null
    if ($health -eq "healthy") {
        Write-Host "  ✅  PostgreSQL is healthy" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 2
    $retry++
}
if ($retry -ge $maxRetries) {
    Write-Host "  ⚠️   PostgreSQL health check timed out (may still be starting)" -ForegroundColor Yellow
}

# ── Pull LLM model if not already present ────────────────
Write-Host ""
Write-Host "  🤖  Checking Ollama LLM model..." -ForegroundColor Cyan

# Give Ollama a moment to start
Start-Sleep -Seconds 3

$modelName = "llama3"
$envFile = Join-Path $ProjectRoot ".env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "OLLAMA_MODEL=(\S+)") {
        $modelName = $Matches[1]
    }
}

$existingModels = docker exec healthcare-ollama ollama list 2>$null
if ($existingModels -and $existingModels -match $modelName) {
    Write-Host "  ✅  Model '$modelName' is already available" -ForegroundColor Green
} else {
    Write-Host "  📥  Pulling model '$modelName' (this may take several minutes on first run)..." -ForegroundColor Yellow
    docker exec healthcare-ollama ollama pull $modelName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅  Model '$modelName' pulled successfully" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️   Failed to pull model. You can pull it manually later:" -ForegroundColor Yellow
        Write-Host "       docker exec -it healthcare-ollama ollama pull $modelName" -ForegroundColor DarkYellow
    }
}

# ── Print access info ────────────────────────────────────
Write-Host ""
Write-Host "  ════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host "  🎉  All services are running!" -ForegroundColor Green
Write-Host "  ════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  🌐  Frontend:       " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "  📡  Backend API:    " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host "  📖  API Docs:       " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000/docs" -ForegroundColor Cyan

if ($Monitor) {
    Write-Host "  📊  Prometheus:     " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:9090" -ForegroundColor Cyan
    Write-Host "  📈  Grafana:        " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:3001  (admin/admin)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "  📋  Useful commands:" -ForegroundColor DarkGray
Write-Host "       .\run.ps1 -Stop     Stop all services" -ForegroundColor DarkGray
Write-Host "       .\run.ps1 -Reset    Reset database & restart" -ForegroundColor DarkGray
Write-Host "       .\run.ps1 -Monitor  Start with monitoring" -ForegroundColor DarkGray
Write-Host "       docker compose logs -f backend   View backend logs" -ForegroundColor DarkGray
Write-Host ""
