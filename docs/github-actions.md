# GitHub Actions

**Status:** Pendente

## Objetivo

Rodar CI (lint/build) e disparar Semantic Release no fluxo de integração contínua.

## O que está previsto

Pasta alvo: [`.github/`](../.github/) (hoje apenas placeholder).

Workflows típicos desta demo:

| Workflow | Gatilho | Função |
|----------|---------|--------|
| CI | PR / push | `npm ci`, lint, build |
| Release | push na branch de release | Semantic Release (token) |

## Como usar neste repo

Será preenchido na fase GitHub Actions:

- YAML dos workflows
- Secrets necessários (`GITHUB_TOKEN` / tokens de publicação)
- Condições de branch

## Relacionados

- [semantic-release.md](./semantic-release.md)
- [azure-devops.md](./azure-devops.md)

## Links oficiais

- [GitHub Actions](https://docs.github.com/en/actions)
- [semantic-release + CI](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration)
