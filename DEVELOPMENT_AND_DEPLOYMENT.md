# ARKYRA: Development and Deployment Guide

This guide provides a comprehensive overview of the different ways to develop, test, and deploy the ARKYRA platform. It is designed to help developers choose the right method for their needs and to provide a clear path from local development to production.

## 1. Development Environments

There are three primary ways to set up your development environment. Choose the one that best fits your workflow.

### Method A: Hybrid Development (Recommended)

This is the **recommended method for most developers**. It provides the best balance of performance, ease of use, and consistency.

*   **How it works:** Your application code (Next.js/NestJS) runs directly on your machine for maximum speed, while the backing services (PostgreSQL, Redis, Temporal) run in isolated Docker containers.
*   **Best for:** Day-to-day development, feature implementation, and debugging.

**Setup:**

```bash
# 1. Start the services in Docker
docker compose -f docker-compose.dev.yaml up -d

# 2. In a new terminal, install dependencies
pnpm install

# 3. Set up your .env file
cp .env.arkyra.example .env
# -- EDIT .env with your API keys and set DB/Redis ports to 5433/6380 --

# 4. Run the database migrations
pnpm run prisma-db-push

# 5. Start the development server
pnpm run dev
```

*   **Access Frontend:** `http://localhost:4200`
*   **Access Temporal UI:** `http://localhost:8081`

### Method B: Full Docker Development

This method runs the entire application stack inside Docker containers. It's the easiest to set up but can be slower for rapid development due to Docker overhead.

*   **How it works:** Everything, including your code, runs inside Docker. Changes to your code will trigger a rebuild of the relevant container.
*   **Best for:** Ensuring 100% production parity, onboarding new team members, or if you prefer a fully containerized workflow.

**Setup:**

```bash
# 1. Set up your .env file
cp .env.arkyra.example .env
# -- EDIT .env with your API keys --

# 2. Run the start script
./start-arkyra.sh
```

*   **Access Frontend:** `http://localhost:4007`
*   **Access Temporal UI:** `http://localhost:8080`

### Method C: Full Local Development

This is the most advanced method and offers the absolute best performance, but requires you to install and manage all services (PostgreSQL, Redis, Temporal) directly on your machine.

*   **How it works:** Nothing runs in Docker. Everything runs natively on your OS.
*   **Best for:** Senior developers who want maximum control and performance, and are comfortable managing local services.

**Setup:**

1.  Install PostgreSQL, Redis, and Temporal on your machine.
2.  Follow the steps for Hybrid Development, but ensure your `.env` file points to your locally installed services.

---

## 2. Production Deployment

This section covers how to deploy ARKYRA to a live server.

### Deployment to Hetzner Cloud (for Al Jazeera Internal)

This is the recommended path for the self-hosted, internal Al Jazeera platform. It is cost-effective, secure, and provides full control.

**Full Guide:** See `DEPLOY-ON-HETZNER.md` (to be created).

**Summary:**

1.  Provision a Hetzner Cloud server (e.g., CPX41).
2.  Install Docker and Docker Compose.
3.  Clone the ARKYRA repository.
4.  Configure a production `.env` file.
5.  Run `docker compose -f docker-compose.arkyra.yaml up -d`.
6.  Set up a firewall and a reverse proxy (Nginx) with SSL.

### Deployment to Railway (for Staging/Testing)

Railway is perfect for creating a temporary, shareable staging environment for testing new features.

**Full Guide:** See `DEPLOY-ON-RAILWAY.md` (to be created).

**Summary:**

1.  Create a new project on Railway.
2.  Connect it to your ARKYRA GitHub repository.
3.  Configure the environment variables in the Railway dashboard.
4.  Railway will automatically build and deploy the application on every push to the `main` or `staging` branch.

### Deployment to Google Cloud (GCP)

Google Cloud offers multiple powerful options for production deployment, from simple VMs to scalable container orchestration.

**Full Guide:** See `DEPLOY-ON-GCP.md` (to be created).

**Options:**

1.  **Compute Engine:** Similar to Hetzner, you manage your own Virtual Machine and run Docker Compose. Good for control and simplicity.
2.  **Cloud Run:** A serverless platform that runs your containers. It automatically scales to zero, making it very cost-effective for variable workloads.
3.  **Google Kubernetes Engine (GKE):** The ultimate solution for scalability and the recommended path for the public ARKYRA SaaS platform.

---

This guide will be the central point of reference for all development and deployment activities. The next step is to create the detailed guides for each production platform.
