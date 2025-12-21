# TODO

## Persistence

- [ ] Add database support (PostgreSQL/MongoDB)
- [ ] Implement flow CRUD operations
- [ ] Store execution history
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

- [ ] Save/load flows from UI
- [ ] Visual flow validation before execution
- [ ] Real-time execution progress indicators
- [ ] Dark mode support
- [ ] Export/import flows as JSON
- [ ] Undo/redo functionality
- [ ] Flow search and filtering
- [ ] Keyboard shortcuts
- [ ] Minimap for large flows

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

- [ ] E2E tests for Web UI (Playwright)
- [ ] Integration tests (API + Web)
- [ ] Performance tests for large flows
- [ ] Load testing
- [ ] Increase unit test coverage to 90%+

## Developer Experience

- [ ] Hot reload for steps during development
- [ ] Playground for testing individual steps
- [ ] Step development CLI tool
- [ ] Flow templates library
- [ ] Community step marketplace
- [ ] Step documentation generator
- [ ] Debug mode with breakpoints

## Documentation

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
