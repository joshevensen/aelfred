# Contributing

Aelfred is a personal project maintained on personal time. It is not a supported open source project. It is open source because the ideas are worth sharing — not because there is a product roadmap or a team behind it. Contributions are welcome within that context, but there is no SLA on reviews and feature requests that do not align with personal use are unlikely to land.

## What kind of contributions make sense

**Bug fixes** — If something is broken, a fix is always welcome.

**Documentation** — Setup guides, self-hosting docs, architecture explanations. This is the area most likely to benefit from outside eyes.

**Self-hosting improvements** — Better deployment scripts, Docker support, alternative infrastructure options.

**Features that align with the vision** — Aelfred is opinionated. Memory is the product. Everything draws from one context pool. Contributions that fit this model are welcome; features that work around it or add complexity without serving it are unlikely to land.

## What is not a priority

- UI themes (dark mode only, intentionally)
- Multi-user / team features (this is a personal AI, not a platform)
- Hosted deployment support (self-hosted by design)
- Feature requests for capabilities I personally do not need

If you are unsure, open an issue and ask before building.

## How to contribute

1. Fork the repository
2. Create a branch from `main`
3. Make your changes
4. Open a pull request with a clear description of what changed and why

There is no formal review SLA. This is a solo project and reviews happen when time allows.

## Code style

TypeScript throughout. Prettier and ESLint configs are in the repo. Run `pnpm lint` before submitting.

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
