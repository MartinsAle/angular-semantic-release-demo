# Angular Semantic Release Demo

Projeto de referência para versionamento semântico em Angular: Conventional Commits, Husky, Commitlint, Semantic Release, CHANGELOG automático e CI — com o objetivo de servir de base para a mesma estratégia em projetos no **Azure DevOps**.

## O que este projeto demonstra

- Conventional Commits
- Commitlint
- Husky
- lint-staged
- Semantic Release
- CHANGELOG automático
- GitHub Actions
- Adaptação para Azure DevOps (documentação)

## Stack atual

- Angular 19 (Standalone Components)
- ESLint (`angular-eslint`)
- Prettier

## Setup local

```bash
npm install
npm start
```

### Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Sobe o app em modo desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run format` | Formata o código com Prettier |
| `npm run format:check` | Verifica formatação sem alterar arquivos |

## Documentação

### Guias (`docs/`)

| Documento | Conteúdo |
|-----------|----------|
| [Architecture](docs/architecture.md) | Estrutura do app e mapa do repositório |
| [Conventional Commits](docs/conventional-commits.md) | Padrão de mensagens de commit |
| [Husky](docs/husky.md) | Hooks Git locais |
| [Commitlint](docs/commitlint.md) | Validação de mensagens |
| [Semantic Release](docs/semantic-release.md) | Versionamento e CHANGELOG |
| [GitHub Actions](docs/github-actions.md) | CI/CD no GitHub |
| [Azure DevOps](docs/azure-devops.md) | Portabilidade para Azure Pipelines |

### Contexto de implementação (`.ai/`)

| Arquivo | Uso |
|---------|-----|
| [AI_CONTEXT.md](.ai/AI_CONTEXT.md) | Estado atual do projeto |
| [ROADMAP.md](.ai/ROADMAP.md) | Checklist de fases |
| [DECISIONS.md](.ai/DECISIONS.md) | Decisões arquiteturais (ADR) |
| [PROMPTS.md](.ai/PROMPTS.md) | Prompts usados no Cursor |

## Próximo passo

Inicializar o repositório Git e configurar **Husky**. Detalhes em [.ai/ROADMAP.md](.ai/ROADMAP.md).

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md) (gerado pelo Semantic Release nas fases futuras).
