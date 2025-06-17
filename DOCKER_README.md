
# Docker Setup for Mindway AI

This project includes Docker configuration for both development and production environments.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Development Mode
```bash
# Run in development mode with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up mindway-ai-dev

# Or use the profile
docker-compose --profile dev up
```

### Production Mode
```bash
# Build and run production version
docker-compose up mindway-ai

# Or build and run in detached mode
docker-compose up -d mindway-ai
```

## Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```
VITE_MONGO_URI=your_mongodb_connection_string # Example: mongodb://localhost:27017/mydatabase
VITE_MONGO_DB_NAME=your_mongodb_database_name # Example: mydatabase
# If you were using Supabase for auth, you'll need new variables for your chosen auth provider's configuration.
# VITE_AUTH_PROVIDER_URL=...
# VITE_AUTH_PROVIDER_CLIENT_ID=...
```

## Available Services

- **mindway-ai**: Production build with Nginx (port 3000)
- **mindway-ai-dev**: Development mode with Vite dev server (port 5173)

## Useful Commands

```bash
# Build the Docker image
docker-compose build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (clean start)
docker-compose down -v

# Shell into running container
docker-compose exec mindway-ai-dev sh
```

## Troubleshooting

1. **Port conflicts**: If ports 3000 or 5173 are in use, modify the ports in docker-compose.yml
2. **Permission issues**: On Linux, you might need to run with `sudo`
3. **Node modules**: If you have issues with node_modules, try removing them locally before building
