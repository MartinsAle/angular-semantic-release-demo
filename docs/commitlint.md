# Commitlint

**Status:** Configurado

## Objetivo

Rejeitar commits cuja mensagem não siga [Conventional Commits](./conventional-commits.md).

## Papel no fluxo

```text
git commit
  → Husky commit-msg
  → scripts/commit-msg-lint.js   (orquestração)
  → commitlint                   (validação)
  → scripts/commit-msg-presentation.js  (UX amigável, se falhar)
  → aceita ou rejeita a mensagem
```

- **Validação:** sempre pelo Commitlint e [`commitlint.config.js`](../commitlint.config.js).
- **Apresentação:** mensagens profissionais em português em [`scripts/commit-msg-presentation.js`](../scripts/commit-msg-presentation.js) (cores ANSI, emojis, orientações). O output técnico do Commitlint não é exibido.

## Instalação (já aplicada)

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

## Configuração

Arquivo [`commitlint.config.js`](../commitlint.config.js):

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'refactor',
        'perf',
        'test',
        'ci',
        'build',
        'style',
        'revert',
      ],
    ],
  },
};
```

A regra `type-enum` (nível `2` = erro) aceita apenas os tipos listados. Qualquer outro type (ex.: `wip`, `update`) é rejeitado.

Hook Husky [`.husky/commit-msg`](../.husky/commit-msg):

```sh
node scripts/commit-msg-lint.js "$1"
```

## Exemplos

Válido:

```text
chore: setup husky
feat: add home page
fix(home): correct typo
style: format css
revert: undo last change
```

Inválido:

```text
bad message
Updated stuff
WIP
wip: draft
```

## Como testar localmente

Via wrapper (mesma UX do hook):

```bash
printf 'bad message\n' > /tmp/msg-bad && node scripts/commit-msg-lint.js /tmp/msg-bad
printf 'wip: draft\n' > /tmp/msg-wip && node scripts/commit-msg-lint.js /tmp/msg-wip
printf 'feat: add home page\n' > /tmp/msg-ok && node scripts/commit-msg-lint.js /tmp/msg-ok
```

Via Commitlint puro (validação sem UX):

```bash
echo "bad message" | npx commitlint
echo "chore: setup husky" | npx commitlint
```

## Relacionados

- [conventional-commits.md](./conventional-commits.md)
- [husky.md](./husky.md)
- [semantic-release.md](./semantic-release.md)

## Links oficiais

- [Commitlint](https://commitlint.js.org/)
- [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
