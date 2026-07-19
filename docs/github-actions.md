# GitHub Actions

**Status:** Ativo

## Objetivo

Rodar CI (install / lint / test / build) e disparar Semantic Release no fluxo de integração contínua — implementação ativa deste demo. O equivalente documentado para Azure Pipelines está em [azure-devops.md](./azure-devops.md).

## Workflows

Pasta: [`.github/workflows/`](../.github/workflows/).

| Workflow | Arquivo                                           | Gatilho                                   | Função                                            |
| -------- | ------------------------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| CI       | [`ci.yml`](../.github/workflows/ci.yml)           | `push` e `pull_request` (qualquer branch) | Validar qualidade                                 |
| Release  | [`release.yml`](../.github/workflows/release.yml) | `push` na branch `main`                   | Semantic Release (tag, CHANGELOG, GitHub Release) |

```text
push / PR
  → ci.yml: npm ci → lint → test → build

push na main (merge incluso)
  → ci.yml (mesmo fluxo)
  → release.yml: npm run release
       → analisa Conventional Commits
       → tag vX.Y.Z + GitHub Release + commit do CHANGELOG [skip ci]
```

## `ci.yml` — etapas

| Etapa            | Comando / action                                      | Por quê                                                                        |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Checkout**     | `actions/checkout@v4`                                 | Obtém o código no runner                                                       |
| **Setup Node**   | `actions/setup-node@v4` (Node **22** + `cache: npm`)  | Ambiente estável com Angular 19; cache acelera installs                        |
| **Install**      | `npm ci`                                              | Dependências reproduzíveis a partir do `package-lock.json`                     |
| **Lint**         | `npm run lint`                                        | ESLint (`angular-eslint`) no código                                            |
| **Setup Chrome** | `browser-actions/setup-chrome@v1`                     | Browser para Karma em CI (sem display)                                         |
| **Test**         | `npm test -- --watch=false --browsers=ChromeHeadless` | Testes unitários em modo headless; `CHROME_BIN` aponta para o Chrome instalado |
| **Build**        | `npm run build`                                       | Build de produção Angular                                                      |

Runner: `ubuntu-latest`.

## `release.yml` — etapas

| Etapa                    | Comando / action                               | Por quê                                                                                         |
| ------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Gatilho**              | `on.push.branches: [main]`                     | Release só após merge/push na `main` (alinhado a [`release.config.cjs`](../release.config.cjs)) |
| **Skip loop**            | `if: "!contains(…, '[skip ci]')"`              | O commit `chore(release): … [skip ci]` do plugin git não dispara outro release                  |
| **Checkout**             | `actions/checkout@v4` com `fetch-depth: 0`     | Histórico completo para o commit-analyzer                                                       |
| **Setup Node + Install** | Node 22 + `npm ci`                             | Mesmo ambiente da CI                                                                            |
| **Permissions**          | `contents`, `issues`, `pull-requests`: `write` | Tag, push do CHANGELOG e GitHub Release                                                         |
| **Release**              | `npm run release`                              | Executa Semantic Release com `GITHUB_TOKEN` / `GH_TOKEN`                                        |

Este workflow **não** repete lint/test/build — o `ci.yml` já valida o mesmo push.

## Secrets e tokens

| Variável       | Origem                                               | Uso                                                          |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| `GITHUB_TOKEN` | Token automático do Actions (`secrets.GITHUB_TOKEN`) | `@semantic-release/github` e push do `@semantic-release/git` |
| `GH_TOKEN`     | Mesmo valor (alias)                                  | Alguns plugins preferem este nome                            |

Não é necessário criar secret manual para o fluxo padrão deste repo. Se o repositório restringir o token padrão, use um PAT com permissão de contents/releases e configure-o como secret.

## Relacionados

- [semantic-release.md](./semantic-release.md)
- [azure-devops.md](./azure-devops.md) — portabilidade completa (YAML + checklist)
- [conventional-commits.md](./conventional-commits.md)

## Links oficiais

- [GitHub Actions](https://docs.github.com/en/actions)
- [semantic-release + CI](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration)
