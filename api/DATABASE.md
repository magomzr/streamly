# Database Setup

Streamly uses PostgreSQL with Drizzle ORM for persistence.

## Quick Start

### 1. Start PostgreSQL

```bash
# From project root
docker-compose up -d
```

### 2. Push Schema

```bash
cd api
pnpm db:push
```

### 3. Start API

```bash
pnpm dev
```

## Database Scripts

```bash
# Generate migration files
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema directly (dev only)
pnpm db:push

# Open Drizzle Studio (GUI)
pnpm db:studio
```

## Schema

### flows

- `id` - UUID primary key
- `name` - Flow name
- `data` - Full flow definition (JSONB)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### executions

- `id` - UUID primary key
- `flowId` - Reference to flow
- `context` - Full execution context (JSONB)
- `status` - Execution status
- `createdAt` - Execution timestamp

## API Endpoints

### Flows

- `POST /flows` - Create flow
- `GET /flows` - List all flows
- `GET /flows/:id` - Get flow by ID
- `PUT /flows/:id` - Update flow
- `DELETE /flows/:id` - Delete flow
- `POST /flows/:id/execute` - Execute flow
- `GET /flows/:id/executions` - Get execution history

## Environment Variables

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/streamly
```

## Production

For production, use migrations instead of push:

```bash
pnpm db:generate
pnpm db:migrate
```
