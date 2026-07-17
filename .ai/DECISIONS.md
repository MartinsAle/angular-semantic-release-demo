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
