# Conventional Commits

**Status:** Ativo (validado pelo Commitlint no hook `commit-msg`)

## Objetivo

Padronizar mensagens de commit para alimentar Semantic Release e o CHANGELOG automático.

## Convenção

Formato:

```text
<type>(<scope opcional>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos permitidos

Lista fechada validada por [`commitlint.config.js`](../commitlint.config.js):

| Tipo       | Uso                                 | Impacto no versionamento (típico) |
| ---------- | ----------------------------------- | --------------------------------- |
| `feat`     | Nova funcionalidade                 | MINOR                             |
| `fix`      | Correção de bug                     | PATCH                             |
| `docs`     | Documentação                        | — (sem release, em geral)         |
| `style`    | Formatação                          | —                                 |
| `refactor` | Refatoração sem mudar comportamento | —                                 |
| `perf`     | Performance                         | PATCH (conforme config)           |
| `test`     | Testes                              | —                                 |
| `build`    | Build / deps                        | —                                 |
| `ci`       | CI                                  | —                                 |
| `chore`    | Manutenção                          | —                                 |
| `revert`   | Reverter commit anterior            | —                                 |

Breaking change: `BREAKING CHANGE:` no rodapé ou `!` após o type (`feat!: ...`) → MAJOR.

### Exemplos

```text
feat: add home page shell
fix: correct app title in header
docs: describe conventional commits workflow
style: format home page css
revert: undo last change
feat!: change release branch policy
```

## Como usar neste repo

1. Escreva a mensagem no formato Conventional Commits com um dos tipos da tabela.
2. No `git commit`, o hook Husky `commit-msg` roda o Commitlint.
3. Mensagens fora do padrão (ou com type não listado) são rejeitadas.

Detalhes: [commitlint.md](./commitlint.md).

## Relacionados

- [semantic-versioning.md](./semantic-versioning.md)
- [commitlint.md](./commitlint.md)
- [husky.md](./husky.md)
- [semantic-release.md](./semantic-release.md)

## Links oficiais

- [Conventional Commits](https://www.conventionalcommits.org/)
