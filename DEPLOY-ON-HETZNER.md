# Deploying ARKYRA on Hetzner Cloud

This guide provides step-by-step instructions for deploying the ARKYRA platform to a production environment on a Hetzner Cloud server. This is the recommended setup for the self-hosted Al Jazeera internal platform, offering the best performance-to-cost ratio.

**Estimated Time:** 30-45 minutes
**Estimated Cost:** ~$20/month

---

## Prerequisites

1.  **A Hetzner Cloud Account:** [Sign up here](https://www.hetzner.com/cloud).
2.  **A Domain Name:** (e.g., `arkyra.pro`) pointed to Cloudflare.
3.  **Basic Linux/Command-Line Knowledge.**

---

## Step 1: Provision the Server

1.  Log in to your [Hetzner Cloud Console](https://console.hetzner.cloud/).
2.  Create a new project (e.g., "ARKYRA").
3.  Click **"Add Server"**.
4.  **Location:** Choose a location (e.g., `Falkenstein` or `Helsinki` for good European latency).
5.  **Image:** Select **Ubuntu 22.04**.
6.  **Type:** Select **Standard** and choose a server. The **CPX31** (4 vCPU, 8 GB RAM) is a powerful and cost-effective starting point (~€11.84/month).
7.  **Networking:** Keep the defaults.
8.  **SSH Key:** Add your public SSH key for secure access. This is highly recommended.
9.  **Name:** Give your server a name (e.g., `arkyra-production-server`).
10. Click **"Create & Buy Now"**.

Hetzner will provision your server and provide you with its IP address.

---

## Step 2: Initial Server Setup & Security

Connect to your new server via SSH:

```bash
ssh root@YOUR_SERVER_IP
```

First, update your system:

```bash
sudo apt update && sudo apt upgrade -y
```

**Create a non-root user** for better security:

```bash
adduser your_username
usermod -aG sudo your_username
su - your_username
```

From now on, use `your_username` to log in.

---

## Step 3: Install Docker and Docker Compose

Install Docker using the official script:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Add your user to the `docker` group to run Docker commands without `sudo`:

```bash
sudo usermod -aG docker $USER
# You will need to log out and log back in for this to take effect.
newgrp docker
```

Docker Compose is now included with Docker. Verify the installation:

```bash
docker --version
docker compose version
```

---

## Step 4: Clone the ARKYRA Repository

Clone your private ARKYRA repository onto the server:

```bash
git clone https://github.com/MOHJRNL/ARKYRA.git
cd ARKYRA
```

---

## Step 5: Configure the Production Environment

1.  Copy the example environment file:

    ```bash
    cp .env.arkyra.example .env
    ```

2.  **Edit the `.env` file** with your production settings:

    ```bash
    nano .env
    ```

    **Crucial Settings to Change:**

    *   `DATABASE_URL`: Use the credentials defined in `docker-compose.arkyra.yaml`.
    *   `JWT_SECRET`: Generate a long, random string.
    *   `FRONTEND_URL`: Set this to `https://your-domain.com` (e.g., `https://arkyra.pro`).
    *   `NEXT_PUBLIC_BACKEND_URL`: Set this to `https://api.your-domain.com`.
    *   All your Social Media and AI Provider API keys.

---

## Step 6: Configure DNS and Reverse Proxy (Nginx)

For production, you need a reverse proxy to handle SSL and direct traffic to the correct Docker containers.

1.  **Point your DNS to the server:**
    *   In Cloudflare, create two **A records**:
        *   `arkyra.pro` -> `YOUR_SERVER_IP`
        *   `api.arkyra.pro` -> `YOUR_SERVER_IP`

2.  **Use the provided Nginx configuration:**
    The `nginx.arkyra.conf` file in the repository is pre-configured. You just need to tell the `docker-compose.arkyra.yaml` to use it and enable SSL.

3.  **Enable SSL with Certbot:**
    We will use Certbot to get free SSL certificates from Let's Encrypt.

    ```bash
    # Install Certbot
    sudo apt install certbot python3-certbot-nginx -y

    # Stop the ARKYRA Nginx container if it's running
    # docker compose -f docker-compose.arkyra.yaml down

    # Obtain certificates
    sudo certbot --nginx -d arkyra.pro -d api.arkyra.pro
    ```

    Certbot will automatically edit your Nginx configuration to enable SSL.

---

## Step 7: Launch the Application

Now you are ready to launch the full ARKYRA stack.

```bash
# From the ARKYRA directory
docker compose -f docker-compose.arkyra.yaml up -d --build
```

This command will:
*   Build the custom Docker images for the frontend, backend, and orchestrator.
*   Start all services in detached mode (`-d`).

Check the status of your containers:

```bash
docker compose -f docker-compose.arkyra.yaml ps
```

---

## Step 8: Run Database Migrations

After the containers are running, you need to run the initial database migrations.

```bash
docker compose -f docker-compose.arkyra.yaml exec arkyra-backend pnpm run prisma-db-push
```

---

## Step 9: Access Your Platform

Congratulations! Your ARKYRA platform is now live.

*   **Frontend:** `https://arkyra.pro`
*   **API:** `https://api.arkyra.pro`

---

## Maintenance and Updates

To update your ARKYRA instance to the latest version:

1.  SSH into your server and navigate to the ARKYRA directory.
2.  Pull the latest changes from your Git repository:

    ```bash
    git pull origin main
    ```

3.  Rebuild and restart the containers:

    ```bash
    docker compose -f docker-compose.arkyra.yaml up -d --build
    ```

4.  Run any new database migrations if needed:

    ```bash
    docker compose -f docker-compose.arkyra.yaml exec arkyra-backend pnpm run prisma-migrate-deploy
    ```

This setup provides a robust, secure, and cost-effective production environment for the ARKYRA platform.
