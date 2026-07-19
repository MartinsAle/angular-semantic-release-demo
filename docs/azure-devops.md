# Azure DevOps

**Status:** Em progresso (mapeamento a partir do GitHub Actions)

## Objetivo

Documentar como portar a mesma estratégia (Conventional Commits → hooks → Semantic Release → CHANGELOG) para pipelines no Azure DevOps, que é a finalidade de referência deste projeto.

## Escopo desta demo

O repositório implementa o fluxo em **GitHub Actions** ([`ci.yml`](../.github/workflows/ci.yml) + [`release.yml`](../.github/workflows/release.yml)). Este documento mapeia o equivalente previsto no Azure DevOps.

| Conceito            | GitHub Actions                                                      | Azure DevOps (previsto)                                           |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| CI                  | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)           | Stage **CI** em `azure-pipelines.yml`                             |
| Release             | [`.github/workflows/release.yml`](../.github/workflows/release.yml) | Stage **Release** (só na `main`)                                  |
| Install             | `npm ci`                                                            | Task Node + `npm ci`                                              |
| Lint / test / build | Jobs do `ci.yml`                                                    | Mesmos comandos no stage CI                                       |
| Secrets             | `GITHUB_TOKEN` (Actions)                                            | Variable group / secret variables (PAT ou OAuth para push de tag) |
| Hooks locais        | Husky                                                               | Igual (local; independente do host)                               |

### Correspondência de etapas

```text
GitHub ci.yml                    Azure (stage CI)
─────────────────                ────────────────
checkout                         checkout
setup Node 22                    NodeTool / UseNode
npm ci                           npm ci
npm run lint                     npm run lint
Chrome + npm test (headless)     npm test -- --watch=false --browsers=ChromeHeadless
npm run build                    npm run build

GitHub release.yml               Azure (stage Release, condition: main)
─────────────────                ─────────────────────────────────────
fetch-depth: 0                   checkout com histórico completo
npm run release                  npm run release
[skip ci] no commit de release   condição para não reentrar no stage
```

## Como usar neste repo

Próximo passo da documentação Azure:

- Exemplo concreto de `azure-pipelines.yml`
- Diferenças de autenticação / permissões de push de tag e criação de release
- Checklist de migração para um app Angular real no Azure DevOps

Até lá, use os workflows do GitHub como referência canônica dos comandos e da ordem das etapas.

## Relacionados

- [github-actions.md](./github-actions.md)
- [semantic-release.md](./semantic-release.md)
- [architecture.md](./architecture.md)

## Links oficiais

- [Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [semantic-release CI](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration)
