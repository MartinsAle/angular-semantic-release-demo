# Roadmap

Checklist de implementação do projeto de demonstração. Marque itens conforme forem concluídos e atualize [AI_CONTEXT.md](./AI_CONTEXT.md).

## Fase 0 — Base da aplicação

- [x] Scaffold Angular 19 (Standalone, routing, CSS, sem SSR)
- [x] Página Home estática (sem lógica de negócio)
- [x] ESLint (`angular-eslint@19`)
- [x] Prettier + `eslint-config-prettier`
- [x] Estrutura de documentação (`.ai/` + `docs/`)

## Fase 1 — Git e hooks locais

- [x] `git init` e primeiro commit
- [x] Husky (hooks `pre-commit`, `commit-msg`)
- [x] lint-staged (lint/format no staged)
- [x] Conventional Commits + Commitlint

## Fase 2 — Release automático

- [x] Semantic Release
- [x] CHANGELOG automático
- [x] Tags e versionamento semântico

## Fase 3 — CI/CD

- [x] GitHub Actions (CI + release)
- [x] Documentação de adaptação para Azure DevOps (`azure-pipelines.yml` + checklist)

## Ordem sugerida

```text
git init → Husky → lint-staged → Commitlint
  → Semantic Release → CHANGELOG
  → GitHub Actions → docs Azure DevOps
```

## Docs por fase

| Fase    | Documentação                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| Base    | [docs/architecture.md](../docs/architecture.md)                                                              |
| Commits | [docs/conventional-commits.md](../docs/conventional-commits.md), [docs/commitlint.md](../docs/commitlint.md) |
| Hooks   | [docs/husky.md](../docs/husky.md)                                                                            |
| Release | [docs/semantic-release.md](../docs/semantic-release.md)                                                      |
| CI      | [docs/github-actions.md](../docs/github-actions.md), [docs/azure-devops.md](../docs/azure-devops.md)         |
