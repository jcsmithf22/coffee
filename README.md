# Coffee Project

## Docker Setup

This project uses Docker Compose to run both the backend and frontend services in containers.

### Prerequisites

- Docker and Docker Compose installed on your machine
- API keys for the various AI providers used in the application

### Setup Instructions

1. Copy the environment variables example file to create your own `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your API keys for the AI providers you want to use

3. Build and start the containers:

   ```bash
   docker compose up --build
   ```

4. Access the services:
   - Frontend: http://localhost:3005
   - Backend: http://localhost:4000

### Development

The Docker setup includes volume mounts for both the backend and frontend code, which means you can edit the code on your local machine and the changes will be automatically reflected in the containers.

### Stopping the Services

To stop the running containers:

```bash
docker compose down
```

### Running Without Docker

If you prefer to run the services without Docker:

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start both services:
   ```bash
   bun run start
   ```

Or start them individually:

```bash
bun run start:backend
bun run start:frontend
```