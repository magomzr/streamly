# @streamly/shared

Shared types, schemas, and metadata for Streamly.

## What's included

### Types (`@streamly/shared/types`)

- `StepType` - All available step types
- `IFlow` - Flow definition structure
- `IStepDefinition` - Individual step configuration
- `IContext` - Execution context (backend)
- `IExecutionResult` - Execution result (API response)

### Schemas (`@streamly/shared/schemas`)

- `FieldSchema` - Field configuration interface
- `STEP_SCHEMAS` - Configuration schemas for each step type

### Metadata (`@streamly/shared/metadata`)

- `STEP_LABELS` - Human-readable labels for steps
- `STEP_CATEGORIES` - Step organization by category

## Usage

```typescript
// Import everything
import { StepType, IFlow, STEP_SCHEMAS, STEP_LABELS } from '@streamly/shared';

// Import specific modules
import { StepType } from '@streamly/shared/types';
import { STEP_SCHEMAS } from '@streamly/shared/schemas';
import { STEP_LABELS } from '@streamly/shared/metadata';
```

## Adding a new step

1. Add step type to `types/flow.ts`
2. Add schema to `schemas/step-schemas.ts`
3. Add label to `metadata/step-labels.ts`
4. Add to category in `metadata/step-categories.ts`
5. Implement in `api/src/steps/`
6. UI will automatically pick it up!

## Philosophy

This package contains the **contract** between API and Web:

- Type definitions
- Configuration schemas
- Metadata
