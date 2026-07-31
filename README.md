# 🏥 AI-Driven Multilingual Healthcare Assistant

An intelligent, multilingual virtual healthcare assistant designed to improve healthcare awareness and accessibility in rural communities. Built with modern full-stack technologies and deployed using Docker containerisation.

![Architecture](https://img.shields.io/badge/Architecture-Full_Stack-blue)
![AI](https://img.shields.io/badge/AI-LLM_Powered-green)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF)
![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Monitoring](#monitoring)

---

## ✨ Features

- ✅ **AI-Powered Virtual Assistant** — Conversational healthcare guidance powered by Ollama LLM
- ✅ **Multilingual Support** — English, Hindi (हिन्दी), Telugu (తెలుగు)
- ✅ **Government Healthcare Schemes** — Detailed information on PMJAY, Aarogyasri, JSY, and more
- ✅ **Healthcare Facility Finder** — Find nearby hospitals, PHCs, and health centres
- ✅ **FAQ System** — Quick answers to common healthcare questions
- ✅ **REST API Architecture** — Clean, well-documented API endpoints
- ✅ **PostgreSQL Database** — Persistent storage for schemes, facilities, and chat history
- ✅ **Docker Containerisation** — One-command deployment with Docker Compose
- ✅ **Responsive Web Interface** — Modern, dark-themed UI with glassmorphism design
- ✅ **Monitoring Stack** — Optional Prometheus + Grafana dashboards

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS 3, Axios, React Router |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy (async), Pydantic |
| **AI/NLP** | Ollama, Gemma 2B, LangChain |
| **Database** | PostgreSQL 16 |
| **DevOps** | Docker, Docker Compose, Nginx |
| **Monitoring** | Prometheus, Grafana |
| **Version Control** | Git, GitHub |

---

## 🏗 System Architecture

```
                        Users
                          │
                          ▼
                 React Web Frontend
                          │
                    Axios (HTTP)
                          │
                     REST API
                          │
                   FastAPI Backend
                   │            │
                   │            │
                   ▼            ▼
           Ollama (Gemma 2B)   PostgreSQL
                   │
                   ▼
            AI-generated Response
                   │
                   ▼
                 React UI
```

### Docker Deployment Architecture

```
                      Users
                        │
                        ▼
                 Internet/Browser
                        │
                        ▼
                  Docker Compose
                        │
      ┌─────────────────┼──────────────────┐
      │                 │                  │
      ▼                 ▼                  ▼
React Frontend     FastAPI Backend     PostgreSQL
  Container           Container         Container
                           │
                           ▼
                  Ollama Container
```

---

## 📁 Project Structure

```
AI-Multilingual-Healthcare-Assistant/
├── frontend/                    # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page-level components
│   │   ├── services/            # API service layer (Axios)
│   │   └── i18n/                # Internationalization files
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                     # FastAPI + Python
│   ├── app/
│   │   ├── main.py              # FastAPI application entry
│   │   ├── config.py            # Application settings
│   │   ├── database.py          # SQLAlchemy async setup
│   │   ├── models.py            # ORM models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── seed_data.py         # Database seeding
│   │   ├── routers/             # API route handlers
│   │   └── services/            # Business logic (AI, translation)
│   ├── Dockerfile
│   └── requirements.txt
│
├── monitoring/                  # Prometheus + Grafana configs
├── docker-compose.yml           # All services orchestration
├── .env                         # Environment configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed
- Minimum 8 GB RAM (recommended for running the LLM)

### Quick Start (One Command)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/AI-Multilingual-Healthcare-Assistant.git
   cd AI-Multilingual-Healthcare-Assistant
   ```

2. **Run the launcher script**
   ```powershell
   .\run.ps1
   ```

   That's it! The script will automatically:
   - ✅ Check that Docker is running
   - 🏗️ Build and start all containers (Frontend, Backend, PostgreSQL, Ollama)
   - ⏳ Wait for PostgreSQL to be healthy
   - 📥 Pull the LLM model if not already present
   - 🎉 Print all access URLs when ready

3. **Access the application**
   - 🌐 Frontend: http://localhost:3000
   - 📡 Backend API: http://localhost:8000
   - 📖 API Docs (Swagger): http://localhost:8000/docs

### Launcher Script Options

| Command | Description |
|---------|-------------|
| `.\run.ps1` | Start all core services |
| `.\run.ps1 -Monitor` | Start with Prometheus + Grafana monitoring |
| `.\run.ps1 -Stop` | Stop all running services |
| `.\run.ps1 -Reset` | Stop, remove data volumes, and restart fresh |

### Start with Monitoring

```powershell
.\run.ps1 -Monitor
```

- 📊 Prometheus: http://localhost:9090
- 📈 Grafana: http://localhost:3001 (admin/admin)

### Manual Docker Commands (Alternative)

If you prefer not to use the launcher script:

```bash
# Start core services
docker compose up -d --build

# Pull the LLM model (first time only)
docker exec -it healthcare-ollama ollama pull gemma:2b

# Start with monitoring
docker compose --profile monitoring up -d --build

# Stop all services
docker compose down
```

---

## 📡 API Documentation

### Chat API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send a message to the AI assistant |
| GET | `/api/chat/history?session_id=...` | Get chat history for a session |

### Healthcare Schemes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schemes` | List all healthcare schemes |
| GET | `/api/schemes/{id}` | Get scheme details |
| GET | `/api/schemes?language=hi&search=...` | Filter/search schemes |

### Healthcare Facilities API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/facilities` | List all healthcare facilities |
| GET | `/api/facilities/{id}` | Get facility details |
| GET | `/api/facilities?facility_type=PHC&district=...` | Filter facilities |

### Languages & FAQ API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/languages` | List supported languages |
| POST | `/api/languages/detect?text=...` | Detect text language |
| GET | `/api/faqs?language=en` | List FAQs by language |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Application health status |

Full interactive API documentation is available at `/docs` (Swagger UI) when the backend is running.

---

## 🐳 Docker Deployment

### Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| Frontend | `healthcare-frontend` | 3000 | React app served via Nginx |
| Backend | `healthcare-backend` | 8000 | FastAPI REST API server |
| Database | `healthcare-postgres` | 5432 | PostgreSQL 16 |
| LLM | `healthcare-ollama` | 11434 | Ollama LLM server |
| Prometheus | `healthcare-prometheus` | 9090 | Metrics collector (optional) |
| Grafana | `healthcare-grafana` | 3001 | Monitoring dashboard (optional) |

### Common Commands

```bash
# Start all core services
docker compose up -d

# Start with monitoring
docker compose --profile monitoring up -d

# View logs
docker compose logs -f backend

# Stop all services
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Reset database
docker compose down -v
docker compose up -d
```

---

## 📊 Monitoring

The optional monitoring stack includes:

- **Prometheus** — Collects metrics from the backend application
- **Grafana** — Displays dashboards visualising application performance

Dashboard metrics include:
- CPU and memory usage
- Backend health status
- Container status overview

---

## 📜 License

This project is developed for educational purposes as part of an engineering DevOps project.

---

## ⚠️ Disclaimer

This application provides **general healthcare information only** and is **not a substitute for professional medical advice**, diagnosis, or treatment. In case of a medical emergency, please call **112** (National Emergency) or **108** (Ambulance).
