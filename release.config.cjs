/**
 * Configuração do Semantic Release (API atual — array `plugins`).
 *
 * Não usar o formato legado por step no topo do arquivo
 * (`analyzeCommits`, `generateNotes`, `prepare`, `publish`).
 *
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  // Branch de release: só cria versão a partir de pushes em `main`.
  // Tag format padrão: v${version} (ex.: v1.2.0).
  branches: ['main'],

  // Ordem importa: cada plugin roda nos lifecycle hooks que implementa.
  // prepare (changelog → git) sempre termina antes de publish (github).
  plugins: [
    // Decide major / minor / patch (ou sem release) a partir dos Conventional Commits
    // desde a última tag. Preset padrão: angular (feat→minor, fix→patch, BREAKING→major).
    '@semantic-release/commit-analyzer',

    // Gera o markdown das release notes (entrada do CHANGELOG e da GitHub Release).
    '@semantic-release/release-notes-generator',

    // prepare: escreve/atualiza o CHANGELOG.md na raiz.
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],

    // publish: cria a tag Git (vX.Y.Z) e a GitHub Release com as notes.
    // Requer GITHUB_TOKEN / GH_TOKEN no CI (Fase 3).
    '@semantic-release/github',

    // prepare: commit + push dos assets após o changelog estar atualizado.
    // [skip ci] evita loop de pipeline no commit de release.
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
