# Prompts utilizados com Cursor

Registro dos prompts principais desta jornada, para rastreabilidade e reuso.

---

## 1. Scaffold Angular 19

**Prompt (resumo):**

> Crie um projeto Angular 19 utilizando Standalone Components, ESLint, Prettier e uma estrutura simples apenas para servir de projeto de demonstração. Não implemente funcionalidades de negócio.

**Resultado:**

- App Angular 19 (standalone, routing, CSS, sem SSR)
- Home estática
- ESLint (`angular-eslint@19`) + Prettier
- README com setup e scripts

---

## 2. Contexto para a próxima conversa (`AI_CONTEXT`)

**Prompt (resumo):**

> Faça um resumo técnico desta conversa (arquivos criados/alterados, decisões, deps, comandos, próximos passos) e crie `AI_CONTEXT.md` no formato Projeto / Objetivo / Stack / Concluído / Próximo / Regras.

**Resultado:**

- `AI_CONTEXT.md` na raiz (depois migrado para `.ai/`)

---

## 3. Organização da documentação

**Prompt (resumo):**

> Organize a documentação do projeto assim:
>
> - `.ai/` → `AI_CONTEXT.md`, `ROADMAP.md`, `DECISIONS.md`, `PROMPTS.md`
> - `docs/` → architecture, husky, commitlint, semantic-release, github-actions, azure-devops, conventional-commits
> - Placeholders `.github/`, `.husky/`, `CHANGELOG.md`
> - `README.md` como entrada
>
> Objetivo: facilitar quem for usar o projeto e a construção dos próximos passos.

**Resultado:**

- Estrutura `.ai/` + `docs/` criada
- Placeholders e CHANGELOG
- README como índice

---

## Como atualizar este arquivo

A cada fase relevante, acrescente uma seção com:

1. Título da fase
2. Prompt (ou resumo fiel)
3. Resultado / artefatos gerados
