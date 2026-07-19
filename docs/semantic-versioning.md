# Semantic Versioning (SemVer)

**Status:** Conceito base (usado pelo Semantic Release)

## Objetivo

Explicar o versionamento semântico para quem nunca usou o conceito: o que significa cada número da versão e como commits Conventional Commits determinam o próximo incremento.

## O que é

Semantic Versioning (SemVer) é uma convenção para numerar releases no formato:

```text
MAJOR.MINOR.PATCH
```

Exemplo: `1.4.2`

| Parte   | Significado                                                               |
| ------- | ------------------------------------------------------------------------- |
| `MAJOR` | Mudança incompatível com versões anteriores (quebra contrato / API / uso) |
| `MINOR` | Nova funcionalidade compatível com o que já existia                       |
| `PATCH` | Correção de bug ou ajuste pequeno, sem mudar o comportamento esperado     |

A ideia central: **só de olhar a versão, a equipe (e quem consome o projeto) entende o risco de atualizar**.

## Por que importa

Sem uma regra comum, versões viram números arbitrários (`v2`, `final-final`, `1.0-ok`). Com SemVer:

- `1.0.0` → `1.0.1` — atualização segura (correção)
- `1.0.0` → `1.1.0` — há novidade, mas o que já funcionava continua
- `1.0.0` → `2.0.0` — atenção: algo quebrou ou mudou de forma incompatível

Neste repositório, o [Semantic Release](./semantic-release.md) calcula esses números automaticamente a partir dos commits.

## MAJOR, MINOR e PATCH

### PATCH — correção compatível

Incrementa o último número: `1.2.3` → `1.2.4`.

Use quando o comportamento público permanece o mesmo e você só corrige um defeito.

**Commits típicos:** `fix`, e às vezes `perf` (conforme a config do release).

```text
fix: correct app title in header
fix(auth): handle expired token redirect
perf: reduce home page re-renders
```

### MINOR — nova funcionalidade compatível

Incrementa o número do meio e zera o PATCH: `1.2.3` → `1.3.0`.

Use quando adiciona capacidade sem exigir que quem já usa mude o código ou o fluxo.

**Commits típicos:** `feat` (sem breaking change).

```text
feat: add home page shell
feat(nav): add about page route
feat: allow optional theme preference
```

### MAJOR — mudança incompatível (breaking change)

Incrementa o primeiro número e zera MINOR e PATCH: `1.2.3` → `2.0.0`.

Use quando remove, renomeia ou altera algo de forma que quem atualiza **precisa** adaptar (API, contrato, config, fluxo obrigatório).

**Como sinalizar no Conventional Commits:**

1. `!` após o type (e scope, se houver): `feat!: ...` ou `fix(api)!: ...`
2. Rodapé `BREAKING CHANGE:` descrevendo o impacto

```text
feat!: change release branch policy

feat(api)!: rename /users endpoint to /accounts

fix: drop support for Node 16

BREAKING CHANGE: Node 16 is no longer supported; use Node 18 or later.
```

Qualquer um desses caminhos costuma gerar **MAJOR**, mesmo que o type seja `fix` ou `feat`.

## Relação com Conventional Commits

| Commit (exemplo)                  | Incremento |
| --------------------------------- | ---------- |
| `fix: correct validation message` | PATCH      |
| `feat: add export to CSV`         | MINOR      |
| `feat!: remove legacy login flag` | MAJOR      |
| `docs: update setup instructions` | —          |
| `chore: bump eslint config`       | —          |
| `refactor: extract date helper`   | —          |

Tipos como `docs`, `chore`, `style`, `test`, `ci`, `build` e `refactor` **em geral não geram release** (não mudam a versão). Detalhes da lista fechada deste repo: [conventional-commits.md](./conventional-commits.md).

## Exemplo de linha do tempo

Partindo de `1.0.0`:

| Commit                              | Nova versão |
| ----------------------------------- | ----------- |
| `fix: correct app title in header`  | `1.0.1`     |
| `feat: add about page`              | `1.1.0`     |
| `fix: correct about page link`      | `1.1.1`     |
| `feat: add dark mode toggle`        | `1.2.0`     |
| `feat!: require auth on all routes` | `2.0.0`     |

Observações:

- Vários `fix` antes do release somam **um** PATCH (não um por commit).
- Vários `feat` antes do release somam **um** MINOR.
- Se houver qualquer breaking change no mesmo conjunto, o resultado é **MAJOR** (o maior impacto vence).

## Regras práticas para a equipe

1. Escreva commits no formato Conventional Commits — o type já aponta o impacto.
2. Use `feat` só para funcionalidade visível/consumível; correção é `fix`.
3. Se a mudança quebra compatibilidade, marque com `!` ou `BREAKING CHANGE:` — não dependa só da descrição.
4. Não “force” MAJOR/MINOR na mão no dia a dia: o Semantic Release deriva a versão dos commits.
5. Em dúvida se é breaking: pergunte “quem já usa precisa mudar algo para continuar funcionando?”. Se sim → MAJOR.

## Relacionados

- [conventional-commits.md](./conventional-commits.md) — formato e types dos commits
- [semantic-release.md](./semantic-release.md) — automação de versão, tag e CHANGELOG
- [commitlint.md](./commitlint.md) — validação das mensagens no commit

## Links oficiais

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
