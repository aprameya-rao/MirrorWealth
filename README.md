# 📈 MirrorWealth

MirrorWealth is an AI-driven, algorithmic wealth management platform. It combines cognitive risk assessment (RRA), LangGraph-powered multi-agent market analysis, and Mean-Variance Optimization (MVO) to generate, execute, and monitor highly personalized investment portfolios.

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Backend:** FastAPI (Python 3.12)
* **Database:** PostgreSQL (Hosted on Supabase) + SQLAlchemy (Asyncio)
* **Message Broker & Cache:** Redis
* **Background Processing:** Celery (Worker) & Celery Beat (Cron Scheduler)
* **AI Engine:** LangGraph + Google Gemini (Flash)
* **Quant Engine:** `yfinance` + `bt` (Backtesting) + Scipy (Optimization)

---

## 📂 Project Structure

```text
MirrorWealth/
├── Backend/
│   ├── app/
│   │   ├── api/          # FastAPI Routes (Auth, Portfolio, Risk)
│   │   ├── core/         # JWT Security, DB config, Celery App
│   │   ├── models/       # SQLAlchemy ORM Models (User, RiskProfile, etc.)
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── quant/        # MVO Math, Backtesting, Live Pricing
│   │   ├── agents/       # LangGraph multi-agent AI system
│   │   └── worker/       # Celery tasks (Portfolio Gen, Drift Monitor)
│   ├── requirements.txt  # Python dependencies
│   ├── Dockerfile        # Backend container definition
│   └── .env              # Backend secrets
├── Frontend/
│   ├── src/              # React components and pages
│   ├── package.json      # Node dependencies
│   ├── vite.config.ts    # Vite configuration
│   └── Dockerfile        # Frontend container definition
└── docker-compose.yml    # Master orchestration file
```

---

## ⚙️ Environment Setup

Before running the application, you must configure your environment variables. 

1. Navigate to the `Backend/` directory and create a `.env` file:
```bash
# Backend/.env

# Database (Supabase) - Must use asyncpg driver!
DATABASE_URL=postgresql+asyncpg://postgres:[YOUR_PASSWORD]@[YOUR_HOST]:5432/postgres

# API Keys
GOOGLE_API_KEY=your_gemini_api_key_here
GNEWS_API_KEY=your_gnews_api_key_here
SECRET_KEY=your_secure_random_jwt_string

# Redis Configuration
# NOTE: Use 'redis://redis:6379/0' for Docker, or 'redis://localhost:6379/0' for Local Multi-Terminal
REDIS_URL=redis://redis:6379/0
```

2. The Frontend handles environment variables via Vite. Ensure your `.env` (if applicable) or `docker-compose.yml` points to the backend:
`VITE_API_URL=http://localhost:8000`

---

## 🐳 Running with Docker (Recommended)

The easiest way to run the entire architecture (Frontend, API, Worker, Scheduler, and Redis) is using Docker Compose.

**Prerequisites:** Docker and Docker Desktop installed.

1. Ensure your local Redis server is stopped to avoid port conflicts:
   ```bash
   sudo systemctl stop redis-server
   ```
2. Run the master build command from the root `MirrorWealth/` directory:
   ```bash
   docker compose up --build
   ```
3. **Access the Application:**
   * **Frontend App:** [http://localhost:5173](http://localhost:5173)
   * **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

*(To shut down the containers, press `Ctrl+C`, then run `docker compose down`)*

---

## 💻 Running Locally (Multi-Terminal Approach)

If you prefer to run the services natively for debugging, you will need 4 separate terminal windows.

**Prerequisites:** Python 3.12+, Node.js 20+, and Redis installed locally.
**Crucial:** Change the Redis URLs in your `Backend/.env` to `redis://localhost:6379/0`.

### Terminal 1: Start Redis
Ensure the Redis server is running in the background.
```bash
sudo service redis-server start
```

### Terminal 2: Start the FastAPI Backend
```bash
cd Backend
source venv/bin/activate  # If using a virtual environment
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Terminal 3: Start the Celery Worker (AI & Quant Engine)
```bash
cd Backend
source venv/bin/activate
celery -A app.core.celery_app worker --loglevel=info
```

### Terminal 4: Start the Celery Beat (Drift Monitor)
```bash
cd Backend
source venv/bin/activate
celery -A app.core.celery_app beat --loglevel=info
```

### Terminal 5: Start the React Frontend
```bash
cd Frontend
npm install
npm run dev
```

---

## 🔒 Authentication Flow
MirrorWealth uses secure **JWT (JSON Web Tokens)** with native `bcrypt` password hashing. 
1. Create a user via `POST /api/v1/auth/register`.
2. Login via `POST /api/v1/auth/login` to receive a Bearer Token.
3. Pass this token in the `Authorization` header for all protected portfolio operations.

## 🤖 Architecture Highlights
* **Asynchronous Execution:** Portfolio generation relies on heavy market data fetching and LLM calls. FastAPI instantly offloads this to Redis/Celery so the API never blocks.
* **LangGraph Multi-Agent:** Uses sequential AI agents (Sentiment, Fundamentals, Backtester) to synthesize real-world constraints before passing them to the math engine.
* **Automated Drift Monitoring:** Celery Beat wakes up daily, fetches live asset prices via `yfinance`, calculates the portfolio drift against the user's Dynamic Risk Score, and flags necessary rebalancing.