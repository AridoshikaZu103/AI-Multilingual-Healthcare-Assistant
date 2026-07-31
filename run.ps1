<#
.SYNOPSIS
    AI-Driven Multilingual Healthcare Assistant - Launcher Script

.DESCRIPTION
    Interactive launcher with numbered menu for all Docker operations.
    Also supports direct flags for scripting/automation.

.PARAMETER Monitor
    Start with Prometheus and Grafana monitoring services.

.PARAMETER Stop
    Stop all running services.

.PARAMETER Reset
    Stop services, remove data volumes, and restart fresh.

.EXAMPLE
    .\run.ps1              Interactive menu
    .\run.ps1 -Monitor     Direct: start with monitoring
    .\run.ps1 -Stop        Direct: stop all
    .\run.ps1 -Reset       Direct: reset and restart
#>

param(
    [switch]$Monitor,
    [switch]$Stop,
    [switch]$Reset
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

# ── System Info ──────────────────────────────────────────
$totalRAM = [math]::Round((Get-CimInstance -ClassName Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 1)

# ── Banner ───────────────────────────────────────────────
function Show-Banner {
    Write-Host ""
    Write-Host "  ====================================================================" -ForegroundColor DarkCyan
    Write-Host "  [HEALTHCARE ASSISTANT] AI-Driven Multilingual Healthcare Assistant" -ForegroundColor Cyan
    Write-Host "  ====================================================================" -ForegroundColor DarkCyan
    Write-Host "  System RAM: ${totalRAM}GB" -ForegroundColor DarkGray
    Write-Host ""
}

# ── Interactive Menu ─────────────────────────────────────
function Show-Menu {
    Write-Host "  Choose an option:" -ForegroundColor White
    Write-Host ""
    Write-Host "    [1] Start Core Services" -ForegroundColor Green
    Write-Host "        Frontend + Backend + PostgreSQL + Ollama" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    [2] Start with Monitoring" -ForegroundColor Cyan
    if ($totalRAM -lt 12) {
        Write-Host "        Core + Prometheus + Grafana  [WARN: ${totalRAM}GB RAM - may crash]" -ForegroundColor Yellow
    } else {
        Write-Host "        Core + Prometheus + Grafana" -ForegroundColor DarkGray
    }
    Write-Host ""
    Write-Host "    [3] Stop All Services" -ForegroundColor Yellow
    Write-Host "        Gracefully stop all running containers" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "    [4] Reset and Restart" -ForegroundColor Red
    Write-Host "        Stop all, remove database volumes, restart clean" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  -------------------------------------------------------------------" -ForegroundColor DarkGray
    $choice = Read-Host "  Enter choice (1-4)"
    return $choice
}

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

# ── Post-Start: Wait for DB, pull model, print URLs ──────
function Start-PostSetup {
    param([bool]$WithMonitor)

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "  [ERROR] Failed to start services. Check the errors above." -ForegroundColor Red
        Write-Host ""
        exit 1
    }

    # Wait for PostgreSQL
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

    # Pull LLM model
    Write-Host ""
    Write-Host "  [AI] Checking Ollama LLM model..." -ForegroundColor Cyan
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

    # Print access info
    Write-Host ""
    Write-Host "  ====================================================================" -ForegroundColor DarkCyan
    Write-Host "  [READY] All services are running!" -ForegroundColor Green
    Write-Host "  ====================================================================" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  Frontend:       " -NoNewline -ForegroundColor White
    Write-Host "http://127.0.0.1:3000" -ForegroundColor Cyan
    Write-Host "  Backend API:    " -NoNewline -ForegroundColor White
    Write-Host "http://127.0.0.1:8000" -ForegroundColor Cyan
    Write-Host "  API Docs:       " -NoNewline -ForegroundColor White
    Write-Host "http://127.0.0.1:8000/docs" -ForegroundColor Cyan

    if ($WithMonitor) {
        Write-Host "  Prometheus:     " -NoNewline -ForegroundColor White
        Write-Host "http://127.0.0.1:9090" -ForegroundColor Cyan
        Write-Host "  Grafana:        " -NoNewline -ForegroundColor White
        Write-Host "http://127.0.0.1:3001 (admin/admin)" -ForegroundColor Cyan
    }

    Write-Host ""
    Write-Host "  Quick commands:" -ForegroundColor DarkGray
    Write-Host "    .\run.ps1            Re-open this menu" -ForegroundColor DarkGray
    Write-Host "    docker compose logs -f backend   View backend logs" -ForegroundColor DarkGray
    Write-Host ""
}

# ── Action: Start Core ───────────────────────────────────
function Start-Core {
    Test-Docker
    Write-Host "  [START] Starting core services (Frontend, Backend, PostgreSQL, Ollama)..." -ForegroundColor Cyan
    Write-Host ""
    docker compose --project-directory $ProjectRoot up -d --build
    Start-PostSetup -WithMonitor $false
}

# ── Action: Start with Monitoring ────────────────────────
function Start-WithMonitor {
    Test-Docker
    if ($totalRAM -lt 12) {
        Write-Host "  [WARN] Your system has ${totalRAM}GB RAM. Monitoring adds ~1.5GB extra." -ForegroundColor Yellow
        Write-Host "         This may cause containers to crash on 8GB systems." -ForegroundColor Yellow
        Write-Host ""
        $continue = Read-Host "  Continue with monitoring? (y/N)"
        if ($continue -ne 'y') {
            Write-Host "  [INFO] Falling back to core services only..." -ForegroundColor Cyan
            Write-Host ""
            docker compose --project-directory $ProjectRoot up -d --build
            Start-PostSetup -WithMonitor $false
            return
        }
    }
    Write-Host "  [START] Starting all services WITH monitoring (Prometheus + Grafana)..." -ForegroundColor Cyan
    Write-Host ""
    docker compose --project-directory $ProjectRoot --profile monitoring up -d --build
    Start-PostSetup -WithMonitor $true
}

# ── Action: Stop ─────────────────────────────────────────
function Stop-All {
    Test-Docker
    Write-Host "  [STOP] Stopping all services..." -ForegroundColor Yellow
    docker compose --project-directory $ProjectRoot --profile monitoring down
    Write-Host ""
    Write-Host "  [OK] All services stopped." -ForegroundColor Green
    Write-Host ""
}

# ── Action: Reset ────────────────────────────────────────
function Reset-All {
    Test-Docker
    Write-Host "  [WARN] This will DELETE all database data and restart fresh!" -ForegroundColor Red
    $confirm = Read-Host "  Are you sure? (y/N)"
    if ($confirm -ne 'y') {
        Write-Host "  [INFO] Reset cancelled." -ForegroundColor DarkGray
        Write-Host ""
        return
    }
    Write-Host "  [RESET] Stopping services and removing data volumes..." -ForegroundColor Yellow
    docker compose --project-directory $ProjectRoot --profile monitoring down -v
    Write-Host "  [OK] Volumes removed. Restarting core services..." -ForegroundColor Green
    Write-Host ""
    docker compose --project-directory $ProjectRoot up -d --build
    Start-PostSetup -WithMonitor $false
}

# ══════════════════════════════════════════════════════════
# MAIN ENTRY POINT
# ══════════════════════════════════════════════════════════

Show-Banner

# If direct flags are passed, execute immediately (for scripting)
if ($Stop) {
    Stop-All
    exit 0
}
if ($Reset) {
    Reset-All
    exit 0
}
if ($Monitor) {
    Start-WithMonitor
    exit 0
}

# No flags = show interactive menu
$choice = Show-Menu

switch ($choice) {
    '1' { Start-Core }
    '2' { Start-WithMonitor }
    '3' { Stop-All }
    '4' { Reset-All }
    default {
        Write-Host ""
        Write-Host "  [ERROR] Invalid choice '$choice'. Please enter 1, 2, 3, or 4." -ForegroundColor Red
        Write-Host ""
        exit 1
    }
}
