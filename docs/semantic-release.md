# Semantic Release

**Status:** Ativo (config local; disparo automático no CI = Fase 3)

## Objetivo

Automatizar versionamento semântico, geração de tags Git, GitHub Releases e atualização do [CHANGELOG.md](../CHANGELOG.md) com base em Conventional Commits.

## Fluxo: do `git push` até tag, release e CHANGELOG

O Semantic Release **não roda no `git push` em si**. O push dispara o CI; o job de release executa `npx semantic-release` (ver [github-actions.md](./github-actions.md)).

```text
commits na main (Conventional Commits)
  → CI: npx semantic-release
  → analyzeCommits (feat / fix / BREAKING)
  → calcula próxima versão (MAJOR.MINOR.PATCH)
  → generateNotes
  → prepare: atualiza CHANGELOG.md + commit git [skip ci]
  → publish: tag vX.Y.Z + GitHub Release
```

### Lifecycle

| Step                 | O que acontece                                                      | Plugins neste repo           |
| -------------------- | ------------------------------------------------------------------- | ---------------------------- |
| **verifyConditions** | Branch, token GitHub, remotes, opções                               | `github`, `git`, `changelog` |
| **analyzeCommits**   | Commits desde a última tag → major / minor / patch (ou sem release) | `commit-analyzer`            |
| **generateNotes**    | Markdown das release notes                                          | `release-notes-generator`    |
| **prepare**          | Escreve `CHANGELOG.md`; commit + push dos assets                    | `changelog`, `git`           |
| **publish**          | Tag `vX.Y.Z` + GitHub Release                                       | `github`                     |

Sem commits releasable desde a última tag (`docs:`, `chore:`, etc.), o processo **encerra sem criar versão**.

### Artefatos

| Artefato         | Onde                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| Versão semântica | Tags Git (`vX.Y.Z`); `package.json` permanece `0.0.0` (sem plugin npm) |
| `CHANGELOG.md`   | Raiz, commitado pelo `@semantic-release/git`                           |
| GitHub Release   | Aba Releases do repositório                                            |

## Plugins

Configuração em [`release.config.cjs`](../release.config.cjs) (API atual: array `plugins`, sem formato legado).

| Plugin                                      | Papel                                      |
| ------------------------------------------- | ------------------------------------------ |
| `@semantic-release/commit-analyzer`         | Decide o tipo de release (preset angular)  |
| `@semantic-release/release-notes-generator` | Gera as release notes                      |
| `@semantic-release/changelog`               | Atualiza `CHANGELOG.md`                    |
| `@semantic-release/github`                  | Cria tag + GitHub Release (`GITHUB_TOKEN`) |
| `@semantic-release/git`                     | Commit do CHANGELOG com `[skip ci]`        |

Branch de release: `main`. Decisão registrada em [ADR-011](../.ai/DECISIONS.md).

## Como usar neste repo

### Dry-run local (sem publicar)

```bash
npm run release:dry-run
```

Equivalente a `semantic-release --dry-run --no-ci`: analisa commits e mostra a próxima versão/notes, **sem** alterar CHANGELOG, criar tag ou Release.

### Release real

```bash
npm run release
```

Em produção, rode no CI na `main` com token GitHub (Fase 3). Localmente só faz sentido com `--no-ci` e credenciais configuradas — prefira o dry-run para validar.

### Tokens (CI)

- `GITHUB_TOKEN` ou `GH_TOKEN` com permissão para criar releases e push do commit de changelog.
- Detalhes do workflow: [github-actions.md](./github-actions.md).

## Relacionados

- [semantic-versioning.md](./semantic-versioning.md) — o que significam MAJOR / MINOR / PATCH
- [conventional-commits.md](./conventional-commits.md)
- [github-actions.md](./github-actions.md)
- [azure-devops.md](./azure-devops.md)

## Links oficiais

- [semantic-release](https://semantic-release.gitbook.io/)
- [Semantic Versioning](https://semver.org/)
