# Streamly Web

Visual flow builder for Streamly workflows.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **ReactFlow (@xyflow/react)** - Flow builder library
- **Zustand** - State management

## Development

```bash
# From root
pnpm dev:web

# Or from this directory
pnpm dev
```

App runs on `http://localhost:5173`

## Features

- ✅ Drag & drop nodes
- ✅ Connect steps visually
- ✅ Zoom and pan canvas
- ✅ Mini map for navigation
- 🚧 Custom step nodes (coming soon)
- 🚧 Step configuration panel (coming soon)
- 🚧 Save/load flows (coming soon)
- 🚧 Execute flows (coming soon)

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   └── FlowBuilder.tsx    # Main flow canvas
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── package.json
└── vite.config.ts
```

## Next Steps

1. Create custom node types for each step (http_request, send_sms, etc.)
2. Add step configuration panel
3. Integrate with API to save/load flows
4. Add execution controls (run, stop, debug)
5. Display execution logs and results
