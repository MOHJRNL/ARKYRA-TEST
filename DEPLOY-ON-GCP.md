# Deploying ARKYRA on Google Cloud Platform (GCP)

This guide provides an overview of deployment strategies for ARKYRA on Google Cloud Platform (GCP). GCP offers a range of powerful, scalable, and cost-effective solutions suitable for both the internal Al Jazeera platform and the public SaaS product.

---

## Why Choose GCP for ARKYRA?

*   **Scalability:** From a single container to a global Kubernetes cluster.
*   **Cost-Effectiveness:** Pay-as-you-go pricing and a generous free tier.
*   **Performance:** Access to Google's high-speed global network.
*   **AI and Data Tools:** Seamless integration with Google's world-class AI/ML services.

---

## Option 1: Google Cloud Run (Recommended for Simplicity and Scale)

Cloud Run is a serverless platform that automatically scales your containers up or down, even to zero. This is a fantastic option for a cost-effective and scalable deployment.

**Best For:** Staging, production environments with variable traffic, and API services.

### Deployment Steps:

1.  **Containerize Your Application:** Use the `Dockerfile.backend` and `Dockerfile.frontend` files we have already created.

2.  **Push Images to Google Artifact Registry:**
    *   Enable the Artifact Registry API in your GCP project.
    *   Create a Docker repository.
    *   Build and push your images:
        ```bash
        gcloud auth configure-docker
        docker build -t gcr.io/YOUR_PROJECT_ID/arkyra-backend -f Dockerfile.backend .
        docker push gcr.io/YOUR_PROJECT_ID/arkyra-backend
        ```

3.  **Deploy to Cloud Run:**
    *   For each service (backend, frontend, etc.), create a new Cloud Run service.
    *   Select the container image you just pushed.
    *   Configure environment variables, CPU, and memory.
    *   Set up a public URL and configure Cloud Armor for security.

4.  **Use Managed Services:**
    *   **Database:** Use **Cloud SQL** for a fully managed PostgreSQL database.
    *   **Redis:** Use **Memorystore** for a managed Redis instance.

**Benefits of Cloud Run:**
*   **Pay-per-use:** You only pay when your code is running.
*   **Auto-scaling:** Handles traffic spikes automatically.
*   **Simple:** No servers to manage.

---

## Option 2: Google Kubernetes Engine (GKE) (Recommended for SaaS)

GKE is a managed Kubernetes service that provides the ultimate scalability and control. This is the recommended path for the public ARKYRA SaaS platform.

**Best For:** Large-scale production, multi-tenant applications, and complex microservices.

### Deployment Steps:

1.  **Create a GKE Cluster:**
    *   Choose a region and the number of nodes.
    *   Enable auto-scaling and auto-upgrades.

2.  **Create Kubernetes Manifests:**
    *   You will need to create YAML files for each service (`Deployment`, `Service`, `Ingress`, etc.).
    *   We will create a `helm` chart for ARKYRA to simplify this process.

3.  **Deploy with `kubectl` or `helm`:**
    ```bash
    kubectl apply -f ./k8s/
    # or
    helm install arkyra ./helm/arkyra
    ```

**Benefits of GKE:**
*   **Massive Scalability:** Can handle millions of users.
*   **High Availability:** Resilient to failures.
*   **Portable:** Based on the open-source Kubernetes standard.

---

## Option 3: Google Compute Engine (GCE)

This is the Infrastructure-as-a-Service (IaaS) option, where you get a virtual machine and have full control. It is similar to the Hetzner setup but within the GCP ecosystem.

**Best For:** Full control, custom configurations, and lifting-and-shifting existing Docker Compose setups.

### Deployment Steps:

1.  **Create a VM Instance:**
    *   Choose a machine type (e.g., `e2-medium`).
    *   Select an OS image (e.g., Ubuntu 22.04).
    *   Configure firewall rules to allow HTTP/HTTPS traffic.

2.  **Follow the Hetzner Guide:** The steps are nearly identical to the `DEPLOY-ON-HETZNER.md` guide. You will install Docker, clone the repo, and run `docker compose`.

**Benefits of GCE:**
*   **Full Control:** You can install any software you want.
*   **Simple:** Easy to understand if you are familiar with VMs.

---

## Cost Comparison (Estimated Monthly)

| Service | Use Case | Cost |
| :--- | :--- | :--- |
| **Cloud Run** | Backend API, Frontend | ~$30 - $150 (scales with traffic) |
| **GKE** | Full SaaS Platform | ~$150 - $500+ |
| **GCE** | Self-Hosted | ~$25 - $100 |
| **Cloud SQL** | PostgreSQL Database | ~$15 - $75 |
| **Memorystore** | Redis Cache | ~$20 - $60 |

## Recommendation for ARKYRA

1.  **Staging:** Use **Cloud Run**. It's fast to deploy and cost-effective.
2.  **Al Jazeera Internal:** Use **Compute Engine (GCE)** with Docker Compose for a simple, controlled environment.
3.  **ARKYRA SaaS:** Use **Google Kubernetes Engine (GKE)** for the power and scalability needed to serve a global audience.

This multi-faceted approach allows you to leverage the best of GCP for each stage of the ARKYRA project's lifecycle.
