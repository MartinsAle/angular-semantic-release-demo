# Semantic Release

**Status:** Pendente

## Objetivo

Automatizar versionamento semântico, geração de tags Git e atualização do [CHANGELOG.md](../CHANGELOG.md) com base em Conventional Commits.

## Fluxo previsto

```text
commits na branch de release
  → análise dos tipos (feat / fix / BREAKING)
  → calcula próxima versão (MAJOR.MINOR.PATCH)
  → gera/atualiza CHANGELOG
  → cria tag Git
  → publica release (GitHub Releases, conforme config)
```

## O que será configurado

- `semantic-release` e plugins oficiais necessários (changelog, git, github, etc.)
- Configuração no repositório (arquivo de config ou `release` no `package.json`)
- Integração com CI ([github-actions.md](./github-actions.md))

O [CHANGELOG.md](../CHANGELOG.md) na raiz é placeholder até esta fase.

## Como usar neste repo

Será preenchido na fase Semantic Release:

- Branches de release
- Plugins escolhidos e por quê (registrar também em [DECISIONS.md](../.ai/DECISIONS.md))
- Como rodar localmente em dry-run

## Relacionados

- [conventional-commits.md](./conventional-commits.md)
- [github-actions.md](./github-actions.md)
- [azure-devops.md](./azure-devops.md)

## Links oficiais

- [semantic-release](https://semantic-release.gitbook.io/)
- [Semantic Versioning](https://semver.org/)
