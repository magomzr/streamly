# Streamly Monorepo Structure

This document describes the monorepo organization.

## Structure

```
streamly/
├── api/              # Backend (NestJS)
│   ├── src/          # Source code
│   ├── test/         # Tests
│   └── package.json  # API dependencies
├── web/              # Frontend (coming soon)
│   ├── src/
│   └── package.json
├── shared/           # Shared code (future)
│   └── types/
├── documentation/    # Project documentation
├── package.json      # Root workspace config
└── pnpm-workspace.yaml
```

## Workspace Commands

### Development
- `pnpm dev:api` - Run API in watch mode
- `pnpm dev:web` - Run web app (when ready)
- `pnpm dev` - Run all apps

### Build
- `pnpm build:api` - Build API
- `pnpm build:web` - Build web
- `pnpm build` - Build all packages

### Testing
- `pnpm test:api` - Test API
- `pnpm test:web` - Test web
- `pnpm test` - Test all packages

### Other
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all code

## Adding Dependencies

### To a specific package:
```bash
pnpm --filter api add express
pnpm --filter web add react
```

### To root (shared dev dependencies):
```bash
pnpm add -D -w prettier
```

## Creating Shared Code

When you need to share types or utilities:

1. Create `shared/types/` folder
2. Add to `pnpm-workspace.yaml`
3. Create `shared/types/package.json`:
```json
{
  "name": "@streamly/shared-types",
  "version": "0.0.1",
  "main": "index.ts"
}
```
4. Import in other packages:
```typescript
import { IFlow } from '@streamly/shared-types';
```

## Next Steps

- [ ] Create web app with Angular/React
- [ ] Extract shared types to `shared/types`
- [ ] Add concurrently for running both apps
- [ ] Setup shared ESLint/Prettier configs
