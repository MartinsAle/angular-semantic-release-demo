# Commitlint

**Status:** Configurado

## Objetivo

Rejeitar commits cuja mensagem não siga [Conventional Commits](./conventional-commits.md).

## Papel no fluxo

```text
git commit
  → Husky commit-msg
  → commitlint
  → aceita ou rejeita a mensagem
```

## Instalação (já aplicada)

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

## Configuração

Arquivo [`commitlint.config.js`](../commitlint.config.js):

```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

Hook Husky [`.husky/commit-msg`](../.husky/commit-msg):

```sh
npx --no -- commitlint --edit "$1"
```

## Exemplos

Válido:

```text
chore: setup husky
feat: add home page
fix(home): correct typo
```

Inválido:

```text
bad message
Updated stuff
WIP
```

## Como testar localmente

```bash
echo "bad message" | npx commitlint          # deve falhar
echo "chore: setup husky" | npx commitlint   # deve passar
```

## Relacionados

- [conventional-commits.md](./conventional-commits.md)
- [husky.md](./husky.md)
- [semantic-release.md](./semantic-release.md)

## Links oficiais

- [Commitlint](https://commitlint.js.org/)
- [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
