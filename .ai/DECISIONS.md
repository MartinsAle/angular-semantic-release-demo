# Decisões arquiteturais (ADR simplificado)

Registro das decisões do projeto. Novas decisões devem ser acrescentadas aqui antes ou junto da implementação.

---

## ADR-001 — Standalone Components (Angular 19)

- **Status:** Aceita
- **Contexto:** Projeto de demonstração Angular 19.
- **Decisão:** Usar Standalone Components (padrão do Angular 19), sem NgModules.
- **Consequências:** Estrutura mais simples; `imports` nos componentes; alinhado à documentação oficial atual.

## ADR-002 — Routing sim, SSR não

- **Status:** Aceita
- **Contexto:** Precisamos de estrutura mínima de páginas, sem complexidade de hospedagem SSR.
- **Decisão:** Habilitar routing; desabilitar SSR.
- **Consequências:** Rota `''` → `HomeComponent`; build client-side apenas.

## ADR-003 — CSS em vez de SCSS

- **Status:** Aceita
- **Contexto:** Demo sem design system nem componentes de UI complexos.
- **Decisão:** Estilos em CSS puro.
- **Consequências:** Menos tooling; suficiente para páginas estáticas.

## ADR-004 — Sem funcionalidades de negócio

- **Status:** Aceita
- **Contexto:** O valor do repositório é a estratégia de versionamento, não um produto.
- **Decisão:** Apenas shell (`AppComponent`) + Home estática.
- **Consequências:** Sem services, HTTP, formulários ou estado global.

## ADR-005 — `--skip-git` no scaffold

- **Status:** Aceita
- **Contexto:** O diretório já tinha README e não era um repositório git.
- **Decisão:** Gerar o app com `--skip-git`.
- **Consequências:** `git init` ficou como pré-requisito explícito da Fase 1 (Husky).

## ADR-006 — angular-eslint na major 19

- **Status:** Aceita
- **Contexto:** `ng add @angular-eslint/schematics` instalou `angular-eslint@21`.
- **Decisão:** Downgrade para `angular-eslint@19.8.1` e flat config com `tseslint.config(...)`.
- **Consequências:** Lint alinhado ao Angular 19; evita mismatch de peers/APIs.

## ADR-007 — Prettier separado do ESLint

- **Status:** Aceita
- **Contexto:** Formatação e lint de qualidade devem coexistir sem conflitos.
- **Decisão:** `prettier` + `eslint-config-prettier`; scripts `format` e `format:check`.
- **Consequências:** ESLint não disputa estilo; Prettier é a fonte da verdade para formatação.

## ADR-008 — Documentação em `.ai/` + `docs/`

- **Status:** Aceita
- **Contexto:** Facilitar continuidade com Cursor e onboarding de quem for reutilizar o projeto.
- **Decisão:**
  - `.ai/` — estado operacional (contexto, roadmap, ADRs, prompts)
  - `docs/` — guias humanos por tema (arquitetura, husky, release, CI, Azure)
  - Placeholders `.github/` e `.husky/` até as fases correspondentes
- **Consequências:** Separação clara entre “contexto de agente/fases” e “documentação de uso”; README vira índice.

## ADR-009 — Escopo por fases

- **Status:** Aceita
- **Contexto:** Evitar misturar scaffold, hooks e release numa única etapa.
- **Decisão:** Implementar na ordem do [ROADMAP.md](./ROADMAP.md); cada fase atualiza docs e `AI_CONTEXT.md`.
- **Consequências:** Entregas incrementais; menos risco de configuração incompleta.

## ADR-010 — Husky 9 + lint-staged + Commitlint

- **Status:** Aceita
- **Contexto:** Fase 1 — hooks locais antes do Semantic Release.
- **Decisão:**
  - Husky **v9** com `"prepare": "husky"` e hooks simples em `.husky/` (sem `husky.sh`)
  - `pre-commit` → `npx lint-staged` (ESLint + Prettier só no staged)
  - `commit-msg` → `node scripts/commit-msg-lint.js "$1"` (wrapper) que executa Commitlint com `@commitlint/config-conventional`
  - UX amigável centralizada em `scripts/commit-msg-presentation.js` (ANSI, emojis, PT); regras do Commitlint inalteradas
  - `type-enum` explícito em `commitlint.config.js`: `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`, `ci`, `build`, `style`, `revert`
- **Consequências:** Commits locais passam por lint rápido e Conventional Commits com orientação clara em falha; Semantic Release fica para a Fase 2.

## ADR-011 — Semantic Release sem npm publish

- **Status:** Aceita
- **Contexto:** Fase 2 — versionamento automático em app Angular `"private": true`.
- **Decisão:**
  - `semantic-release` com config em [`release.config.cjs`](../release.config.cjs) (API atual: `branches` + array `plugins`; sem formato legado por step)
  - Branch de release: `main`
  - Plugins: `commit-analyzer`, `release-notes-generator`, `changelog`, `github`, `git`
  - **Sem** `@semantic-release/npm` — versão oficial nas tags Git (`vX.Y.Z`); `package.json` permanece `0.0.0`
  - `@semantic-release/git` commita apenas `CHANGELOG.md` com mensagem `chore(release): … [skip ci]`
  - Scripts: `release` e `release:dry-run` (`--dry-run --no-ci`)
- **Consequências:** CHANGELOG e GitHub Releases automáticos no CI (Fase 3); dry-run local valida a config sem publicar.

## ADR-012 — Dois workflows GitHub Actions (CI + Release)

- **Status:** Aceita
- **Contexto:** Fase 3 — simular a pipeline futura do Azure DevOps no GitHub.
- **Decisão:**
  - [`ci.yml`](../.github/workflows/ci.yml): `push` + `pull_request` → `npm ci` → lint → test (Chrome headless) → build
  - [`release.yml`](../.github/workflows/release.yml): só `push` na `main` → `npm run release`
  - Node **22** no CI (LTS alinhado ao Angular 19)
  - `npm ci` (install reproduzível)
  - Skip de release quando a mensagem do commit contém `[skip ci]` (evita loop do `@semantic-release/git`)
  - Token: `GITHUB_TOKEN` / `GH_TOKEN` do Actions, com `permissions` de contents/issues/pull-requests
- **Consequências:** CI valida qualidade em qualquer branch; release só na `main`; mapeamento direto para stages Azure (ver [azure-devops.md](../docs/azure-devops.md)).

## ADR-013 — Azure DevOps como documentação de referência

- **Status:** Aceita
- **Contexto:** Fase 3 — fechar a portabilidade documentada para Azure Repos + Azure Pipelines sem executar Azure neste demo.
- **Decisão:**
  - Artefato [`azure-pipelines.yml`](../azure-pipelines.yml) na raiz com stages **CI** + **Release**, espelhando `ci.yml` + `release.yml`
  - Guia oficial em [`docs/azure-devops.md`](../docs/azure-devops.md) (variáveis, permissões Build Service, Semantic Release, checklist, diferenças, cuidados)
  - Auth preferida: `System.AccessToken` + `persistCredentials: true` + permissões Contribute / Create tag na identidade Build Service correta (project vs collection scope)
  - Alternativa documentada: PAT via `GIT_CREDENTIALS` (URL-encoded)
  - Node via `UseNode@1` (não `NodeTool@0`); cache npm via `Cache@2` + `npm_config_cache`
  - Na migração real: remover `@semantic-release/github`; neste repo o plugin e os workflows GitHub **permanecem** (implementação ativa)
  - Loop de release: confiar no skip nativo `[skip ci]` do Azure Pipelines
- **Consequências:** Equipes podem migrar com checklist acionável; o demo permanece validado apenas no GitHub Actions; o YAML Azure não é executado neste repositório.
