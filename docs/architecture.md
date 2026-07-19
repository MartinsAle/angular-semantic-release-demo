# Arquitetura

**Status:** Concluído (base da aplicação)

## Objetivo

Descrever a estrutura do app Angular de demonstração e o mapa da documentação do repositório.

## Stack

| Item            | Valor                               |
| --------------- | ----------------------------------- |
| Framework       | Angular 19                          |
| Componentes     | Standalone                          |
| Routing         | Sim                                 |
| Estilo          | CSS                                 |
| SSR             | Não                                 |
| Lint            | ESLint + `angular-eslint@19`        |
| Format          | Prettier + `eslint-config-prettier` |
| Package manager | npm                                 |

## Estrutura da aplicação

```text
src/app/
├── app.component.*      # Shell (header + router-outlet)
├── app.config.ts
├── app.routes.ts        # '' → HomeComponent
└── pages/home/          # Página estática de demonstração
```

- Sem services, HTTP, formulários ou regras de negócio.
- O valor do repositório está na estratégia de versionamento, não no produto.

## Mapa da documentação

```text
.ai/                   # Contexto operacional (agente / fases)
docs/                  # Guias humanos por tema
.github/               # CI/CD ativo (workflows ci.yml + release.yml)
azure-pipelines.yml    # Referência Azure Pipelines (não executado neste demo)
.husky/                # Hooks locais (pre-commit, commit-msg)
```

| Pasta / arquivo                                 | Uso                                 |
| ----------------------------------------------- | ----------------------------------- |
| [`.ai/AI_CONTEXT.md`](../.ai/AI_CONTEXT.md)     | Estado atual; reescrito a cada fase |
| [`.ai/ROADMAP.md`](../.ai/ROADMAP.md)           | Checklist de implementação          |
| [`.ai/DECISIONS.md`](../.ai/DECISIONS.md)       | Decisões arquiteturais (ADR)        |
| [`.ai/PROMPTS.md`](../.ai/PROMPTS.md)           | Prompts usados no Cursor            |
| [`docs/`](./)                                   | Guias por tema (este e os demais)   |
| [`azure-pipelines.yml`](../azure-pipelines.yml) | Portabilidade Azure (referência)    |

## Fluxo (implementação ativa)

```text
commit (Conventional Commits)
  → Husky (pre-commit / commit-msg)
  → lint-staged + Commitlint
  → push
  → GitHub Actions
  → Semantic Release → tag + CHANGELOG (+ GitHub Release)
```

Portabilidade documentada: [azure-devops.md](./azure-devops.md). Decisões: [DECISIONS.md](../.ai/DECISIONS.md).

## Links oficiais

- [Angular](https://angular.dev/)
- [angular-eslint](https://github.com/angular-eslint/angular-eslint)
- [Prettier](https://prettier.io/)
