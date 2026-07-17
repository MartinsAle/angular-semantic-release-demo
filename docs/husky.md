# Husky

**Status:** Configurado

## Objetivo

Executar hooks Git locais para garantir qualidade e padrão de commits antes de entrarem no histórico.

## Hooks neste repo

| Hook         | Comando                              | Função                                |
| ------------ | ------------------------------------ | ------------------------------------- |
| `pre-commit` | `npx lint-staged`                    | ESLint + Prettier nos arquivos staged |
| `commit-msg` | `npx --no -- commitlint --edit "$1"` | Valida Conventional Commits           |

Pasta: [`.husky/`](../.husky/)

## Instalação (já aplicada)

```bash
npm install --save-dev husky
npx husky init
npm install --save-dev lint-staged
```

O script `"prepare": "husky"` no `package.json` reinstala os hooks após cada `npm install`.

## Como funciona

1. `git commit` dispara `pre-commit` → lint-staged (só arquivos staged).
2. Se passar, dispara `commit-msg` → Commitlint valida a mensagem.
3. Se ambos passarem, o commit é criado.

## lint-staged

Configurado em `package.json`:

- `*.{ts,html}` → `eslint --fix`
- `*.{ts,html,css,json,md}` → `prettier --write`

## Desabilitar temporariamente

```bash
git commit -m "..." -n          # pula hooks neste commit
HUSKY=0 git commit -m "..."     # desabilita Husky
```

## Relacionados

- [commitlint.md](./commitlint.md)
- [conventional-commits.md](./conventional-commits.md)

## Links oficiais

- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
