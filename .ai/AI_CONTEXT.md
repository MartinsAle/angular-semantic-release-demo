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

Node 24 · npm

## Concluído

- Angular 19 + Standalone + routing (CSS, sem SSR)
- ESLint + Prettier
- Estrutura de documentação (`.ai/` + `docs/`)
- Git inicializado
- Husky (`pre-commit` → lint-staged; `commit-msg` → Commitlint)

## Próximo

1. Semantic Release
2. CHANGELOG automático
3. GitHub Actions + docs Azure DevOps

Ver checklist completo em [ROADMAP.md](./ROADMAP.md).

## Regras

- Sempre explicar alterações antes de implementá-las.
- Não utilizar bibliotecas depreciadas.
- Seguir documentação oficial.
- Explicar todas as decisões arquiteturais (registrar em [DECISIONS.md](./DECISIONS.md)).
- Reescrever este arquivo a cada fase concluída.

## Observações de ambiente

- Angular CLI: 19.2.20
- Node 24 é marcado como unsupported pelo CLI; se houver falhas, preferir Node 22 via nvm.
- Script `"prepare": "husky"` reinstala hooks após `npm install`.

## Referências rápidas

| Recurso        | Caminho                                            |
| -------------- | -------------------------------------------------- |
| Roadmap        | [ROADMAP.md](./ROADMAP.md)                         |
| Decisões (ADR) | [DECISIONS.md](./DECISIONS.md)                     |
| Prompts Cursor | [PROMPTS.md](./PROMPTS.md)                         |
| Husky          | [../docs/husky.md](../docs/husky.md)               |
| Commitlint     | [../docs/commitlint.md](../docs/commitlint.md)     |
| Arquitetura    | [../docs/architecture.md](../docs/architecture.md) |
| README         | [../README.md](../README.md)                       |
