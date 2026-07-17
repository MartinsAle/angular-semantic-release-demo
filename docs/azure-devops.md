# Azure DevOps

**Status:** Pendente

## Objetivo

Documentar como portar a mesma estratégia (Conventional Commits → hooks → Semantic Release → CHANGELOG) para pipelines no Azure DevOps, que é a finalidade de referência deste projeto.

## Escopo desta demo

O repositório implementa primeiro o fluxo em **GitHub Actions**. Este documento descreverá o mapeamento equivalente para Azure DevOps:

| Conceito | GitHub | Azure DevOps (previsto) |
|----------|--------|-------------------------|
| CI | Actions workflow | Pipeline YAML |
| Secrets | GitHub Secrets | Variable groups / secret variables |
| Release | semantic-release job | Job equivalente com Node + npm |
| Hooks locais | Husky | Igual (local; independente do host) |

## Como usar neste repo

Será preenchido após a fase GitHub Actions:

- Exemplo de `azure-pipelines.yml` (ou referência)
- Diferenças de autenticação / permissões de push de tag
- Checklist de migração para um app Angular real no Azure DevOps

## Relacionados

- [github-actions.md](./github-actions.md)
- [semantic-release.md](./semantic-release.md)
- [architecture.md](./architecture.md)

## Links oficiais

- [Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [semantic-release CI](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration)
