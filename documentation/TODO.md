# TODO

## Persistence

- [x] Add database support (PostgreSQL/MongoDB)
- [x] Implement flow CRUD operations
- [x] Store execution history
- [ ] Add flow versioning
- [ ] Implement flow templates

## New Steps

### Control Flow

- [ ] Conditional step (if/else branching)
- [ ] Loop step (for_each iteration)
- [ ] Switch/case step
- [ ] Parallel execution step

### Data Operations

- [ ] Set variable step
- [ ] Merge objects step
- [ ] Split string step
- [ ] Math operations step

### Database

- [ ] SQL query step
- [ ] MongoDB query step
- [ ] Redis operations step

### Communication

- [ ] Send email step
- [ ] Slack notification step
- [ ] Discord webhook step

### File Operations

- [ ] Read file step
- [ ] Write file step
- [ ] CSV parser step
- [ ] Excel operations step

## UI/UX Improvements

- [x] Save/load flows from UI
- [x] Delete flows from UI
- [x] Visual node connections with arrows
- [x] Horizontal flow layout (left-to-right)
- [x] Auto-layout with dagre
- [x] Inline flow name editing
- [x] Delete nodes with confirmation
- [x] Topological sort for execution order
- [x] Step output display in config panel
- [x] Unique step IDs with auto-increment
- [x] Execution duration display
- [x] Unsaved changes indicator
- [x] Auto-save before execution
- [x] Minimap for large flows
- [ ] Visual flow validation before execution
- [ ] Real-time execution progress indicators
- [ ] Dark mode support
- [ ] Export/import flows as JSON
- [ ] Undo/redo functionality
- [ ] Flow search and filtering
- [ ] Keyboard shortcuts

## Production Readiness

- [ ] Authentication and authorization
- [ ] Multi-user support with permissions
- [ ] Rate limiting
- [ ] Structured logging (Winston/Pino)
- [ ] Metrics and monitoring (Prometheus)
- [ ] Docker compose setup
- [ ] Environment variables per flow
- [ ] API documentation (Swagger)
- [ ] Health check endpoints
- [ ] Graceful shutdown handling

## Testing

- [x] Unit tests for all steps
- [x] Unit tests for engine components
- [x] Unit tests for utilities
- [ ] E2E tests for Web UI (Playwright)
- [ ] Integration tests (API + Web)
- [ ] Performance tests for large flows
- [ ] Load testing
- [ ] Increase unit test coverage to 90%+

## Developer Experience

- [x] Monorepo with pnpm workspaces
- [x] Shared types and schemas package
- [x] Step metadata system (labels, categories, schemas)
- [ ] Hot reload for steps during development
- [ ] Playground for testing individual steps
- [ ] Step development CLI tool
- [ ] Flow templates library
- [ ] Community step marketplace
- [ ] Step documentation generator
- [ ] Debug mode with breakpoints

## Documentation

- [x] README with getting started guide
- [x] Adding new steps guide
- [ ] Architecture decision records (ADRs)
- [ ] API reference documentation
- [ ] Step development guide
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Video tutorials
- [ ] Example flows repository

## Performance

- [ ] Implement step result caching
- [ ] Optimize template resolution
- [ ] Add flow execution timeout
- [ ] Implement step execution pooling
- [ ] Add flow execution queue
- [ ] Optimize large array operations

## Security

- [ ] Input validation for all steps
- [ ] Secrets management integration
- [ ] Audit logging
- [ ] CORS configuration
- [ ] Rate limiting per user
- [ ] SQL injection prevention
- [ ] XSS protection
