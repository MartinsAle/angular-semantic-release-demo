# Husky

**Status:** Pendente

## Objetivo

Executar hooks Git locais para garantir qualidade e padrão de commits antes de entrarem no histórico.

## O que será configurado neste repo

| Hook | Função prevista |
|------|-----------------|
| `pre-commit` | Rodar lint-staged (ESLint / Prettier nos arquivos staged) |
| `commit-msg` | Validar mensagem com Commitlint |

Pasta alvo: [`.husky/`](../.husky/) (hoje apenas placeholder).

## Pré-requisitos

1. Repositório Git inicializado (`git init`)
2. Instalação do Husky conforme [documentação oficial](https://typicode.github.io/husky/)
3. Script `prepare` no `package.json` para instalar hooks após `npm install`

## Como usar neste repo

Será preenchido na fase Husky do [ROADMAP](../.ai/ROADMAP.md), incluindo:

- Comandos de instalação
- Conteúdo dos hooks
- Integração com lint-staged e Commitlint

## Relacionados

- [commitlint.md](./commitlint.md)
- [conventional-commits.md](./conventional-commits.md)

## Links oficiais

- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
