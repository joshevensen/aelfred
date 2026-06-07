## Pre-commit Gate

pnpm run lint
pnpm run format:check
pnpm run check-types

## Verification

pnpm run build
pnpm run test
