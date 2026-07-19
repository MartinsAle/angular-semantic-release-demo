# Azure DevOps

**Status:** Referência oficial (pipeline de exemplo; **não executado** neste repositório)

## Objetivo

Documentar como portar a mesma estratégia (Conventional Commits → hooks → Semantic Release → CHANGELOG → tags) do **GitHub Actions** para **Azure Repos + Azure Pipelines**.

Este projeto **não** liga o pipeline a um projeto Azure DevOps real. O arquivo [`azure-pipelines.yml`](../azure-pipelines.yml) e este guia servem de **documentação e referência** para equipes que desejam migrar.

A implementação ativa deste demo continua em [GitHub Actions](./github-actions.md).

## Premissa

| Aspecto             | Neste demo                                                 | Na migração Azure                                    |
| ------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| CI/CD real          | GitHub Actions (`ci.yml` + `release.yml`)                  | Azure Pipelines (`azure-pipelines.yml`)              |
| Código hospedado    | GitHub                                                     | Azure Repos (destino documentado)                    |
| Versão oficial      | Tags Git `vX.Y.Z` + [`CHANGELOG.md`](../CHANGELOG.md)      | Igual ([ADR-011](../.ai/DECISIONS.md))               |
| Release notes na UI | GitHub Release (`@semantic-release/github`)                | **Remover** o plugin GitHub; tags + CHANGELOG bastam |
| Config de release   | [`release.config.cjs`](../release.config.cjs) (com GitHub) | Mesma estrutura **sem** `@semantic-release/github`   |

Decisão registrada em [ADR-013](../.ai/DECISIONS.md).

## Pipeline de referência

Arquivo na raiz: [`azure-pipelines.yml`](../azure-pipelines.yml).

```text
push / PR
  → Stage CI: UseNode 22 → Cache npm → npm ci → lint → test → build

push na main (após CI ok)
  → Stage Release: checkout (histórico completo) → npm run release
       → tags vX.Y.Z + commit do CHANGELOG [skip ci]
```

O Azure Pipelines **pula automaticamente** a pipeline quando a mensagem do commit contém `[skip ci]` (ou variantes oficiais). O commit gerado pelo `@semantic-release/git` já inclui `[skip ci]`, evitando loop — equivalente ao `if` do [`release.yml`](../.github/workflows/release.yml).

---

## Stages, jobs e tasks

### Stage `CI` — qualidade

Espelha [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

| Task / step                                           | Equivalente GitHub                | Por quê                                                                                                                                                                                          |
| ----------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `checkout: self`                                      | `actions/checkout@v4`             | Obtém o código no agente                                                                                                                                                                         |
| `UseNode@1` (`22.x`)                                  | `actions/setup-node@v4` (Node 22) | **Não** usar `NodeTool@0` (depreciado). [UseNode@1](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/use-node-v1)                                                        |
| `Cache@2` em `npm_config_cache`                       | `cache: npm` do setup-node        | Prática Microsoft: cachear o diretório compartilhado do npm, **não** `node_modules`, quando se usa `npm ci`. [Caching](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching) |
| `npm ci`                                              | `npm ci`                          | Install reproduzível a partir do lockfile                                                                                                                                                        |
| `npm run lint`                                        | `npm run lint`                    | ESLint                                                                                                                                                                                           |
| Resolve Chrome + `CHROME_BIN`                         | `browser-actions/setup-chrome@v1` | Agentes `ubuntu-latest` hospedados pela Microsoft costumam incluir Google Chrome; o step localiza o binário para o Karma                                                                         |
| `npm test -- --watch=false --browsers=ChromeHeadless` | Idem                              | Testes headless                                                                                                                                                                                  |
| `npm run build`                                       | `npm run build`                   | Build de produção Angular                                                                                                                                                                        |

Pool: `vmImage: ubuntu-latest` (paridade com `runs-on: ubuntu-latest`).

Triggers: `trigger` (qualquer branch) + `pr` (qualquer branch) — equivalente a `on: push` / `pull_request`.

### Stage `Release` — Semantic Release

Espelha [`.github/workflows/release.yml`](../.github/workflows/release.yml).

| Task / step                                               | Equivalente GitHub                       | Por quê                                                                                                                                                                                                                                                            |
| --------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `condition: and(succeeded(), eq(..., 'refs/heads/main'))` | `on.push.branches: [main]` + job após CI | Release só na `main` e só se o stage CI passou                                                                                                                                                                                                                     |
| `checkout` com `fetchDepth: 0`                            | `fetch-depth: 0`                         | Histórico completo para o commit-analyzer. Pipelines novas usam shallow fetch (depth 1) por padrão — **sem** `0`, o analyzer falha ou calcula versão errada. [steps.checkout](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/steps-checkout) |
| `persistCredentials: true`                                | `persist-credentials: true`              | Mantém o OAuth token no Git config após o fetch, permitindo `git push` (tag + CHANGELOG). [Git commands](https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/git-commands)                                                                            |
| `UseNode@1` + `npm ci`                                    | Setup Node + install                     | Mesmo ambiente do CI                                                                                                                                                                                                                                               |
| `git config user.*`                                       | Implícito / token Actions                | Obrigatório no Azure para o `@semantic-release/git` criar o commit                                                                                                                                                                                                 |
| `npm run release` + `SYSTEM_ACCESSTOKEN`                  | `GITHUB_TOKEN` / `GH_TOKEN`              | Autenticação via token do job (Build Service)                                                                                                                                                                                                                      |

Este stage **não** repete lint/test/build — o stage CI já validou o mesmo push (`dependsOn: CI`).

---

## Variáveis e secrets

### Preferido: `System.AccessToken` (sem secret manual)

| Variável             | Origem                               | Uso                                                                                                        |
| -------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `System.AccessToken` | Token OAuth do job (pré-definido)    | Push de tag e commit via Git, quando `persistCredentials: true` e o Build Service tem permissão de escrita |
| `SYSTEM_ACCESSTOKEN` | Mapeamento `env:` no step de release | Disponibiliza o token aos processos filhos / scripts                                                       |

Não é necessário criar Variable Group para o fluxo padrão documentado aqui, desde que as [permissões do Build Service](#permissoes-para-tags-e-releases) estejam corretas.

Documentação: [Job access tokens](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/access-tokens), [Git commands](https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/git-commands).

### Alternativa: PAT (Personal Access Token)

Use quando a política da organização **impede** que o Build Service tenha `Contribute` / `Create tag`, ou quando o remote não aceita o token do sistema.

1. Crie um PAT com escopo **Code (Read & Write)** (ou o mínimo equivalente na sua org).
2. Guarde como **secret variable** na pipeline ou em um **Variable Group** (ex.: nome `GIT_CREDENTIALS`).
3. Passe ao Semantic Release no formato documentado:

| Variável          | Formato                                                                   | Uso                                                                                                         |
| ----------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `GIT_CREDENTIALS` | `<username>:<password>` com cada parte **URL-encoded** (não encode o `:`) | Auth Git do semantic-release ([CI configuration](https://semantic-release.org/docs/usage/ci-configuration)) |

Exemplo de valor (conceitual): `azdo:<PAT_URL_ENCODED>`.

No [`azure-pipelines.yml`](../azure-pipelines.yml), o mapeamento `GIT_CREDENTIALS: $(GIT_CREDENTIALS)` está comentado — descomente se a org exigir PAT.

### O que não se aplica no Azure (neste fluxo)

| GitHub Actions         | Azure Pipelines (este guia)                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `secrets.GITHUB_TOKEN` | Não existe; use `System.AccessToken` ou PAT                         |
| `GH_TOKEN`             | Não necessário sem `@semantic-release/github`                       |
| `permissions:` no YAML | Permissões são do **Build Service** no repositório (UI de Security) |

---

## Permissões para tags e releases

O Semantic Release precisa **push** no Azure Repos (commit do `CHANGELOG.md` + tag `vX.Y.Z`).

### 1. Identificar a identidade correta

O token `System.AccessToken` representa uma de duas identidades, conforme as settings da organização/projeto ([Job access tokens](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/access-tokens)):

| Setting _Limit job authorization scope to current project_ | Identidade a configurar                    |
| ---------------------------------------------------------- | ------------------------------------------ |
| **Habilitada** (comum)                                     | `{NomeDoProjeto} Build Service ({Org})`    |
| **Desabilitada**                                           | `Project Collection Build Service ({Org})` |

**Não** selecione o grupo _Project Collection Build Service Accounts_ — selecione a identidade de **usuário** do Build Service do projeto (ou da collection), conforme a tabela.

### 2. Conceder permissões no repositório

Em **Project Settings → Repositories → [seu repo] → Security** (ou _Git repositories_ para todos):

| Permissão         | Estado                       | Motivo                                    |
| ----------------- | ---------------------------- | ----------------------------------------- |
| **Read**          | Allow                        | Clone / fetch                             |
| **Contribute**    | Allow                        | Push do commit do CHANGELOG               |
| **Create tag**    | Allow                        | Tag `vX.Y.Z`                              |
| **Create branch** | Allow (se a política exigir) | Alguns fluxos de push com branch policies |

Por padrão o Build Service **lê** o repo, mas **não** faz push — sem `Contribute` + `Create tag`, o release falha na autenticação ou no push.

Referência: [Run Git commands in a script](https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/git-commands).

### 3. “Releases” no Azure DevOps

Neste guia, **release** = tag Git + `CHANGELOG.md` (mesma fonte de verdade do ADR-011).

Não é obrigatório criar um _Release Pipeline_ clássico nem publicar no Azure Artifacts. Se a equipe precisar da versão como variável de pipeline para stages seguintes, pode avaliar o plugin comunitário `semantic-release-ado` (opcional; **não** usado neste demo).

---

## Como configurar o Semantic Release no Azure DevOps

### Plugins (migração)

Neste repo (GitHub), [`release.config.cjs`](../release.config.cjs) inclui `@semantic-release/github`.

**Na migração para Azure Repos**, remova esse plugin. Configuração adaptada (exemplo — **não** altere o arquivo vivo deste demo sem desligar o GitHub Actions):

```js
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
```

Também remova a dependência `@semantic-release/github` do `package.json` na migração.

Se a config **não** for lida (working directory errado), o semantic-release carrega os **plugins default**, incluindo `@semantic-release/github` e `@semantic-release/npm` — isso quebra no Azure. Garanta que o step rode na raiz do repositório (`$(System.DefaultWorkingDirectory)` / pasta do checkout).

### Checklist técnico no pipeline

1. `checkout` com `fetchDepth: 0` e `persistCredentials: true`
2. Node 22 + `npm ci`
3. `git config user.name` e `user.email`
4. `npm run release` com `SYSTEM_ACCESSTOKEN: $(System.AccessToken)` (ou `GIT_CREDENTIALS` com PAT)
5. Build Service com Contribute + Create tag
6. Branch de release = `main` (igual a `release.config`)
7. Mensagem de commit com `[skip ci]` (já no plugin git)

### Validação antes do primeiro release

```bash
npm run release:dry-run
```

Dry-run local (`--dry-run --no-ci`) valida analyzer/notes **sem** publicar. No Azure, prefira um run com dry-run no YAML só em branch de teste, se a política da equipe permitir.

---

## Checklist de migração GitHub → Azure DevOps

Use esta lista ao portar um projeto (ou este demo) para Azure Repos + Pipelines.

### Repositório e código

- [ ] Código no **Azure Repos** (import ou mirror)
- [ ] Manter Husky, Commitlint, lint-staged, Conventional Commits (sem mudança)
- [ ] Copiar [`azure-pipelines.yml`](../azure-pipelines.yml) para a raiz (ou ajustar paths)
- [ ] Remover `@semantic-release/github` de `release.config.cjs` e do `package.json`
- [ ] Confirmar `branches: ['main']` (ou renomear para a branch padrão da org)
- [ ] Remover ou arquivar `.github/workflows/` se o GitHub deixar de ser o CI

### Azure DevOps — projeto

- [ ] Criar/pipeline YAML apontando para `azure-pipelines.yml`
- [ ] Agent pool com imagem Linux compatível (`ubuntu-latest` ou self-hosted equivalente)
- [ ] Verificar _Limit job authorization scope_ e anotar a identidade do Build Service
- [ ] Em Repos → Security: Allow **Contribute**, **Create tag**, **Read** para essa identidade
- [ ] Se PAT for obrigatório: Variable Group / secret `GIT_CREDENTIALS` + descomentar no YAML
- [ ] Confirmar que **não** há shallow fetch forçado na UI da pipeline que sobrescreva o YAML (o `fetchDepth: 0` no YAML tem prioridade quando explícito)

### Triggers e políticas

- [ ] CI em push/PR conforme necessidade (YAML já inclui `trigger` + `pr`)
- [ ] Branch policy de Build Validation na `main` (opcional, recomendado)
- [ ] Entender que `[skip ci]` **não** pula builds de validação de PR no merge commit — só pipelines disparadas pelo push CI

### Validação

- [ ] Rodar stage CI em feature branch (lint / test / build)
- [ ] `npm run release:dry-run` localmente com a config sem GitHub
- [ ] Merge na `main` com um commit `fix:` ou `feat:` e verificar tag + CHANGELOG
- [ ] Confirmar que o commit `chore(release): … [skip ci]` **não** reentra na pipeline

### Documentação da equipe

- [ ] Atualizar README interno (CI = Azure Pipelines)
- [ ] Registrar PAT rotation (se usado) e quem administra permissões do Build Service

---

## Principais diferenças: GitHub Actions × Azure Pipelines

| Conceito                | GitHub Actions                          | Azure Pipelines                                                            |
| ----------------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| Unidade de orquestração | Workflows (arquivos separados)          | Um YAML com **stages** / jobs                                              |
| CI + Release            | `ci.yml` + `release.yml`                | Stages `CI` + `Release` no mesmo arquivo                                   |
| Runner                  | `runs-on: ubuntu-latest`                | `pool.vmImage: ubuntu-latest`                                              |
| Node setup              | `actions/setup-node@v4`                 | `UseNode@1` (não `NodeTool@0`)                                             |
| Cache npm               | `cache: npm` na action                  | `Cache@2` + `npm_config_cache`                                             |
| Permissões de escrita   | `permissions:` no YAML + `GITHUB_TOKEN` | Security do repo + identidade Build Service                                |
| Token padrão            | `secrets.GITHUB_TOKEN`                  | `System.AccessToken`                                                       |
| Histórico Git           | `fetch-depth: 0`                        | `fetchDepth: 0` (default shallow = 1)                                      |
| Credenciais Git no job  | `persist-credentials`                   | `persistCredentials: true`                                                 |
| Skip de loop            | `if: "!contains(…, '[skip ci]')"`       | Skip **nativo** da pipeline se a mensagem tiver `[skip ci]` (ou variantes) |
| GitHub Release          | `@semantic-release/github`              | Não aplicável em Azure Repos; usar tags + CHANGELOG                        |
| PR builds               | `on: pull_request`                      | `pr:` no YAML e/ou Branch Policies (Build Validation)                      |

---

## Cuidados comuns

### Autenticação e push

- Sem `persistCredentials: true`, o `git push` do Semantic Release falha mesmo com token no ambiente.
- Sem `Contribute` / `Create tag` no Build Service, o erro costuma ser _GenericContribute_ / _Authentication failed_.
- Confirme a identidade (**Project** vs **Collection** Build Service) conforme _job authorization scope_.

### PAT

- Preferir `System.AccessToken` (sem rotação de PAT pessoal).
- Se usar PAT: escopo mínimo, secret variable, `GIT_CREDENTIALS` URL-encoded, política de rotação.
- Não commitar PAT no YAML nem em Variable Groups sem marcar como secret.

### Checkout e histórico

- **Sempre** `fetchDepth: 0` no job de release (e idealmente documentar na UI que shallow fetch não deve conflitar).
- `fetchTags` pode ser necessário em cenários avançados; com `fetchDepth: 0` o histórico e as tags costumam bastar para o analyzer.

### `[skip ci]`

Variantes oficiais (Azure Repos, GitHub, Bitbucket): `[skip ci]`, `[ci skip]`, `[skip azp]`, `***NO_CI***`, etc. — ver [Skipping CI](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/azure-repos-git).

Limitações:

- Builds de **Build Validation** em PR usam o merge commit e **não** respeitam `[skip ci]` da mesma forma que o CI de push.
- Após merge na `main`, o CI de push na target branch **roda** mesmo se commits mesclados tinham `[skip ci]` — o que importa para o loop é o commit **novo** do release, que carrega `[skip ci]` na mensagem.

### Config e working directory

- Rode `npm run release` na raiz onde está `release.config.cjs`.
- Config ausente → plugins default (GitHub + npm) → falha no Azure.

### Chrome / testes

- Se o agente self-hosted não tiver Chrome, instale-o ou defina `CHROME_BIN` explicitamente.
- O step de resolve no YAML falha de forma clara se o browser não existir.

### Outros

- Não cachear `node_modules` com `npm ci`.
- Não usar tasks depreciadas (`NodeTool@0`).
- Classic Release Pipelines não substituem este fluxo de versionamento Git.

---

## Inventário: o que permanece igual

Tooling local e SemVer — independentes do host de CI:

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

App Angular, ESLint e Prettier permanecem iguais. Scripts `release` / `release:dry-run` permanecem.

## Inventário: o que muda na migração real

| Arquivo                                            | Mudança                                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`.github/workflows/*.yml`](../.github/workflows/) | Substituídos pelos stages em [`azure-pipelines.yml`](../azure-pipelines.yml) |
| [`release.config.cjs`](../release.config.cjs)      | Remover `@semantic-release/github`                                           |
| `package.json` / lockfile                          | Remover dep `@semantic-release/github`                                       |
| Docs / ADRs internos                               | CI canônico = Azure Pipelines                                                |

**Neste repositório de demo:** os workflows GitHub e o plugin GitHub **permanecem** (implementação ativa). O [`azure-pipelines.yml`](../azure-pipelines.yml) é só referência.

---

## Correspondência de etapas

```text
GitHub ci.yml                    Azure (stage CI)
─────────────────                ────────────────
checkout                         checkout: self
setup Node 22                    UseNode@1 (22.x)
cache npm                        Cache@2 + npm_config_cache
npm ci                           npm ci
npm run lint                     npm run lint
Chrome + npm test (headless)     Resolve Chrome + npm test
npm run build                    npm run build

GitHub release.yml               Azure (stage Release, só main)
─────────────────                ─────────────────────────────
fetch-depth: 0                   fetchDepth: 0
persist-credentials              persistCredentials: true
GITHUB_TOKEN                     System.AccessToken (+ Build Service)
npm run release                  npm run release
[skip ci] no if do job           skip nativo da pipeline
```

---

## Relacionados

- [github-actions.md](./github-actions.md) — implementação ativa neste demo
- [semantic-release.md](./semantic-release.md)
- [architecture.md](./architecture.md)
- [ADR-013](../.ai/DECISIONS.md) — Azure como documentação de referência

## Links oficiais

- [Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [YAML schema — steps.checkout](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/steps-checkout)
- [Run Git commands in a script](https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/git-commands)
- [Job access tokens](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/access-tokens)
- [UseNode@1](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/use-node-v1)
- [Pipeline caching (npm)](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching)
- [Skipping CI for individual pushes](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/azure-repos-git)
- [semantic-release — CI configuration](https://semantic-release.org/docs/usage/ci-configuration)
