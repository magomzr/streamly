# Streamly Monorepo

Streamly is a workflow automation engine with a visual UI, built with NestJS and TypeScript.

## Project Structure

```
streamly/
├── api/          # NestJS backend (workflow engine)
├── web/          # Frontend UI (coming soon)
└── shared/       # Shared types and utilities (future)
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

```bash
# Run API in development mode
pnpm dev:api

# Run both API and Web (when web is ready)
pnpm dev

# Run tests
pnpm test

# Build all packages
pnpm build
```

## Packages

### API (`/api`)

The workflow automation engine. See [api/README.md](./api/README.md) for detailed documentation.

**Quick start:**
```bash
cd api
pnpm dev
```

API runs on `http://localhost:3000`

### Web (`/web`)

Visual flow builder UI (coming soon).

## Scripts

- `pnpm dev:api` - Start API in watch mode
- `pnpm dev:web` - Start web app in dev mode
- `pnpm dev` - Start both API and web
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier

## Documentation

- [API Documentation](./api/README.md)
- [Architecture](./documentation/)

## License

MIT
