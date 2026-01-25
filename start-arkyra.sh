#!/bin/bash

# ARKYRA Quick Start Script
# This script sets up and starts the ARKYRA platform

set -e

echo "🚀 Starting ARKYRA Platform..."
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.arkyra.example .env
    echo "⚠️  Please edit .env file with your configuration before proceeding."
    echo "   Especially set secure passwords and API keys!"
    read -p "Press Enter to continue after editing .env..."
fi

# Create uploads directory
mkdir -p uploads

# Stop any running containers
echo "🛑 Stopping any running ARKYRA containers..."
docker-compose -f docker-compose.arkyra.yaml down 2>/dev/null || true

# Pull latest images
echo "📦 Pulling Docker images..."
docker-compose -f docker-compose.arkyra.yaml pull

# Build custom images
echo "🔨 Building ARKYRA images..."
docker-compose -f docker-compose.arkyra.yaml build

# Start services
echo "🚀 Starting ARKYRA services..."
docker-compose -f docker-compose.arkyra.yaml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.arkyra.yaml ps

echo ""
echo "✅ ARKYRA Platform is starting up!"
echo "================================"
echo ""
echo "🌐 Access ARKYRA at: http://localhost:4007"
echo "📊 Temporal UI at: http://localhost:8080"
echo "🗄️  PostgreSQL at: localhost:5432"
echo "🔴 Redis at: localhost:6379"
echo ""
echo "📋 View logs with: docker-compose -f docker-compose.arkyra.yaml logs -f"
echo "🛑 Stop ARKYRA with: docker-compose -f docker-compose.arkyra.yaml down"
echo ""
echo "📚 For more information, see ARKYRA_PROJECT_README.md"
echo ""
