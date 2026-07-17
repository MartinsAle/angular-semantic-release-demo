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

### Tipos comuns

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

Breaking change: `BREAKING CHANGE:` no rodapé ou `!` após o type (`feat!: ...`) → MAJOR.

### Exemplos

```text
feat: add home page shell
fix: correct app title in header
docs: describe conventional commits workflow
feat!: change release branch policy
```

## Como usar neste repo

Ainda **não** há validação automática. Na próxima fase:

1. Commitlint + config Conventional Commits
2. Hook `commit-msg` via Husky

Até lá, prefira seguir os exemplos acima manualmente.

## Relacionados

- [commitlint.md](./commitlint.md)
- [husky.md](./husky.md)
- [semantic-release.md](./semantic-release.md)

## Links oficiais

- [Conventional Commits](https://www.conventionalcommits.org/)
