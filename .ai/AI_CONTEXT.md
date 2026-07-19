# Projeto

Angular Semantic Release Demo

## Objetivo

Demonstrar:

- Husky
- Conventional Commits
- Semantic Release
- CHANGELOG
- GitHub Actions
- Azure DevOps

## Stack

Angular 19 (Standalone Components)

ESLint (`angular-eslint@19`) + Prettier

Husky 9 + lint-staged + Commitlint (`@commitlint/config-conventional`)

Semantic Release (`release.config.cjs`: changelog + git + github; sem npm)

GitHub Actions: `ci.yml` + `release.yml` (Node 22 no CI)

Node 24 local · npm (CI usa Node 22)

## Concluído

- Angular 19 + Standalone + routing (CSS, sem SSR)
- ESLint + Prettier
- Estrutura de documentação (`.ai/` + `docs/`)
- Git inicializado
- Husky (`pre-commit` → lint-staged; `commit-msg` → Commitlint)
- Semantic Release + plugins (CHANGELOG, tags, GitHub Release via config)
- GitHub Actions: CI (install/lint/test/build) + Release na `main`

## Próximo

1. Documentação completa de adaptação para Azure DevOps (`azure-pipelines.yml` + checklist)

Ver checklist completo em [ROADMAP.md](./ROADMAP.md).

## Regras

- Sempre explicar alterações antes de implementá-las.
- Não utilizar bibliotecas depreciadas.
- Seguir documentação oficial.
- Explicar todas as decisões arquiteturais (registrar em [DECISIONS.md](./DECISIONS.md)).
- Reescrever este arquivo a cada fase concluída.

## Observações de ambiente

- Angular CLI: 19.2.20
- Node 24 é marcado como unsupported pelo CLI; CI usa Node 22; localmente preferir Node 22 via nvm se houver falhas.
- Script `"prepare": "husky"` reinstala hooks após `npm install`.
- `npm run release:dry-run` valida a config sem publicar.
- Workflows em `.github/workflows/`; detalhes em [docs/github-actions.md](../docs/github-actions.md).

## Referências rápidas

| Recurso          | Caminho                                                    |
| ---------------- | ---------------------------------------------------------- |
| Roadmap          | [ROADMAP.md](./ROADMAP.md)                                 |
| Decisões (ADR)   | [DECISIONS.md](./DECISIONS.md)                             |
| Prompts Cursor   | [PROMPTS.md](./PROMPTS.md)                                 |
| Husky            | [../docs/husky.md](../docs/husky.md)                       |
| Commitlint       | [../docs/commitlint.md](../docs/commitlint.md)             |
| Semantic Release | [../docs/semantic-release.md](../docs/semantic-release.md) |
| GitHub Actions   | [../docs/github-actions.md](../docs/github-actions.md)     |
| Azure DevOps     | [../docs/azure-devops.md](../docs/azure-devops.md)         |
| Arquitetura      | [../docs/architecture.md](../docs/architecture.md)         |
| README           | [../README.md](../README.md)                               |
