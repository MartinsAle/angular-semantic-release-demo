# Azure DevOps

**Status:** Inventário de arquivos documentado; pipeline ainda pendente

## Objetivo

Documentar como portar a mesma estratégia (Conventional Commits → hooks → Semantic Release → CHANGELOG) para o Azure DevOps — sem gerar pipeline nesta etapa.

## Premissa

Destino = **Azure Repos** + **Azure Pipelines**.

- A versão oficial continua nas tags Git (`vX.Y.Z`) + [`CHANGELOG.md`](../CHANGELOG.md) (alinhado a [ADR-011](../.ai/DECISIONS.md)).
- O artefato **GitHub Release** deixa de existir; remove-se `@semantic-release/github`.
- O repositório hoje implementa o fluxo em **GitHub Actions** ([`ci.yml`](../.github/workflows/ci.yml) + [`release.yml`](../.github/workflows/release.yml)). Este documento inventaria o que permanece igual e o que muda.

## Inventário: permanecem iguais

Tooling local e convenções SemVer — independentes do host de CI:

| Arquivo / pasta                                                               | Papel                                     |
| ----------------------------------------------------------------------------- | ----------------------------------------- |
| [`commitlint.config.js`](../commitlint.config.js)                             | Regras Conventional Commits               |
| [`.husky/`](../.husky/)                                                       | Hooks `pre-commit` e `commit-msg`         |
| [`scripts/commit-msg-lint.js`](../scripts/commit-msg-lint.js)                 | Wrapper do Commitlint                     |
| [`scripts/commit-msg-presentation.js`](../scripts/commit-msg-presentation.js) | UX de erro em PT                          |
| Scripts/deps locais em `package.json`                                         | `prepare`, husky, lint-staged, commitlint |
| [`docs/conventional-commits.md`](./conventional-commits.md)                   | Guia de mensagens                         |
| [`docs/semantic-versioning.md`](./semantic-versioning.md)                     | MAJOR / MINOR / PATCH                     |
| [`docs/husky.md`](./husky.md)                                                 | Hooks locais                              |
| [`docs/commitlint.md`](./commitlint.md)                                       | Validação de commits                      |

App Angular, ESLint e Prettier também permanecem iguais (fora do escopo de release).

Scripts `release` e `release:dry-run` em `package.json` **permanecem** (só as deps de publish mudam — ver abaixo).

## Inventário: mudam

| Arquivo                                                             | Por quê                                                                                  |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)           | Substituído pelo stage **CI** em `azure-pipelines.yml` (ainda não gerado)                |
| [`.github/workflows/release.yml`](../.github/workflows/release.yml) | Substituído pelo stage **Release** (só na `main`)                                        |
| [`release.config.cjs`](../release.config.cjs)                       | Remover `@semantic-release/github`; manter analyzer, notes, changelog, git               |
| [`package.json`](../package.json) / `package-lock.json`             | Remover dep `@semantic-release/github`; scripts `release` / `release:dry-run` ficam      |
| [`docs/github-actions.md`](./github-actions.md)                     | Referência canônica enquanto o GitHub for o CI; no port, aponta para o equivalente Azure |
| [`docs/semantic-release.md`](./semantic-release.md)                 | Referências a GitHub Release / `GITHUB_TOKEN` passam ao equivalente Azure (tags + PAT)   |
| [`.ai/DECISIONS.md`](../.ai/DECISIONS.md) (ADR-011 / ADR-012)       | Registrar a decisão Azure quando a implementação ocorrer                                 |

## Fronteira: ideia igual, implementação diferente

| Conceito                      | GitHub Actions                        | Azure DevOps (previsto)                                  |
| ----------------------------- | ------------------------------------- | -------------------------------------------------------- |
| Skip de loop                  | `if` no job: mensagem com `[skip ci]` | Condition no stage Release                               |
| Token                         | `GITHUB_TOKEN` / `GH_TOKEN`           | PAT ou OAuth em variable group (push de tag + CHANGELOG) |
| Histórico completo            | `fetch-depth: 0`                      | Checkout com histórico completo                          |
| Install / lint / test / build | Mesmos comandos (`npm ci`, etc.)      | Mesmos comandos; só a sintaxe da task muda               |
| Hooks locais                  | Husky                                 | Igual (local; independente do host)                      |

## Correspondência de etapas

```text
GitHub ci.yml                    Azure (stage CI)
─────────────────                ────────────────
checkout                         checkout
setup Node 22                    NodeTool / UseNode
npm ci                           npm ci
npm run lint                     npm run lint
Chrome + npm test (headless)     npm test -- --watch=false --browsers=ChromeHeadless
npm run build                    npm run build

GitHub release.yml               Azure (stage Release, condition: main)
─────────────────                ─────────────────────────────────────
fetch-depth: 0                   checkout com histórico completo
npm run release                  npm run release
[skip ci] no commit de release   condição para não reentrar no stage
```

| Conceito            | GitHub Actions                                                      | Azure DevOps (previsto)                                           |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| CI                  | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)           | Stage **CI** em `azure-pipelines.yml`                             |
| Release             | [`.github/workflows/release.yml`](../.github/workflows/release.yml) | Stage **Release** (só na `main`)                                  |
| Install             | `npm ci`                                                            | Task Node + `npm ci`                                              |
| Lint / test / build | Jobs do `ci.yml`                                                    | Mesmos comandos no stage CI                                       |
| Secrets             | `GITHUB_TOKEN` (Actions)                                            | Variable group / secret variables (PAT ou OAuth para push de tag) |

## Próximo passo

Gerar `azure-pipelines.yml` com stages CI + Release, autenticação para push de tag/CHANGELOG e condição de `[skip ci]`.

Até lá, use os workflows do GitHub como referência canônica dos comandos e da ordem das etapas.

## Relacionados

- [github-actions.md](./github-actions.md)
- [semantic-release.md](./semantic-release.md)
- [architecture.md](./architecture.md)

## Links oficiais

- [Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [semantic-release CI](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration)
