# Commitlint

**Status:** Pendente

## Objetivo

Rejeitar commits cuja mensagem não siga [Conventional Commits](./conventional-commits.md).

## Papel no fluxo

```text
git commit
  → Husky commit-msg
  → commitlint
  → aceita ou rejeita a mensagem
```

## O que será configurado

- Pacotes `@commitlint/cli` e `@commitlint/config-conventional` (versões atuais, não depreciadas)
- Arquivo de config (ex.: `commitlint.config.js` ou equivalente flat)
- Hook Husky `commit-msg` apontando para o Commitlint

## Como usar neste repo

Será preenchido na fase Commitlint:

- Instalação
- Exemplo de mensagem válida / inválida
- Como testar localmente (`npx commitlint --from HEAD~1` ou equivalente)

## Relacionados

- [conventional-commits.md](./conventional-commits.md)
- [husky.md](./husky.md)
- [semantic-release.md](./semantic-release.md)

## Links oficiais

- [Commitlint](https://commitlint.js.org/)
- [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
