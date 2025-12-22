# TODO

## High Priority

### Critical Steps (Control Flow)

- [ ] Loop step (for_each iteration)
- [ ] Parallel execution step

### UI/UX

- [ ] Real-time execution progress indicators (SSE/WebSocket)
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts (Ctrl+S, Delete, Ctrl+Z)
- [ ] Copy/paste nodes
- [ ] Duplicate flow

### Core Features

- [ ] Flow versioning and history
- [ ] Secrets management (env variables, encrypted storage)
- [ ] Flow execution timeout and cancellation
- [ ] Error handling strategies (retry, fallback, skip)

## Medium Priority

### New Steps

- [ ] Send email step (SMTP/SendGrid)
- [ ] SQL query step (PostgreSQL/MySQL)
- [ ] Slack notification step
- [ ] Math operations step
- [ ] Merge/split objects step
- [ ] CSV parser step

### Production Readiness

- [ ] Docker compose setup (API + Web + DB)
- [ ] Health check endpoints
- [ ] Structured logging (Pino)
- [ ] API documentation (Swagger)
- [ ] Authentication (JWT)

### Testing

- [ ] E2E tests for Web UI (Playwright)
- [ ] Integration tests (API + DB)
- [ ] Increase test coverage to 90%+

## Low Priority

### Advanced Features

- [ ] Flow templates library
- [ ] Multi-user support with permissions
- [ ] Metrics and monitoring (Prometheus)
- [ ] Step result caching
- [ ] Flow execution queue

### Developer Experience

- [ ] Hot reload for steps
- [ ] Debug mode with step breakpoints
- [ ] Step development CLI tool

### Documentation

- [ ] Architecture decision records (ADRs)
- [ ] Deployment guide
- [ ] Video tutorials
- [ ] Example flows repository

## Ideas / Future

- [ ] Visual flow diff for versioning
- [ ] Flow marketplace/sharing
- [ ] AI-powered step suggestions
- [ ] Flow analytics dashboard
- [ ] Mobile app for monitoring
- [ ] Scheduled flow execution (cron)
- [ ] Flow triggers (webhooks, events)
