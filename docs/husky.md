# Husky

**Status:** Configurado

## Objetivo

Executar hooks Git locais para garantir qualidade e padrão de commits antes de entrarem no histórico.

## Hooks neste repo

| Hook         | Comando                                | Função                                             |
| ------------ | -------------------------------------- | -------------------------------------------------- |
| `pre-commit` | `npx lint-staged`                      | ESLint + Prettier nos arquivos staged              |
| `commit-msg` | `node scripts/commit-msg-lint.js "$1"` | Valida Conventional Commits (wrapper + Commitlint) |

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
2. Se passar, dispara `commit-msg` → [`scripts/commit-msg-lint.js`](../scripts/commit-msg-lint.js) roda o Commitlint.
3. Se a mensagem for inválida, [`scripts/commit-msg-presentation.js`](../scripts/commit-msg-presentation.js) exibe uma orientação amigável em português.
4. Se ambos passarem, o commit é criado.

## lint-staged

Configurado em `package.json`:

- `*.{ts,html}` → `eslint --fix`
- `*.{ts,html,css,json,md}` → `prettier --write`

### Por que só arquivos staged?

Rodar ESLint/Prettier só no staged (via lint-staged) é melhor do que lintar o projeto inteiro no `pre-commit`:

1. **Velocidade** — o hook analisa só o que entra no commit. Em repos maiores, `ng lint` / ESLint no tree inteiro pode levar dezenas de segundos a minutos e vira atrito a cada commit.
2. **Feedback no diff certo** — o desenvolvedor corrige o que está enviando agora, sem ruído de arquivos que não tocou (dívida antiga, gerados, etc.).
3. **Menos falsos bloqueios** — um erro pré-existente em outro arquivo não impede um commit legítimo; a qualidade do _delta_ fica garantida localmente.
4. **Auto-fix seguro** — `eslint --fix` e `prettier --write` reescrevem só o staged; o lint-staged re-stageia as correções. Rodar format/lint no repo todo no hook alteraria arquivos fora do commit.
5. **Papel certo de cada camada** — hook = barreira rápida no staged; CI e scripts manuais (`npm run lint`, `format:check`) = garantia no projeto inteiro antes do merge/release.

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
