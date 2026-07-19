'use strict';

/**
 * Camada de apresentação do commit-msg.
 * Toda UX (cores, emojis, textos, layout) vive neste arquivo.
 */

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function detectColor() {
  if (process.env.NO_COLOR !== undefined) {
    return false;
  }
  if (process.env.FORCE_COLOR !== undefined) {
    return true;
  }
  return Boolean(process.stderr.isTTY || process.stdout.isTTY);
}

const STYLE = {
  useColor: detectColor(),
  useEmojis: true,
};

const DOCS_PATH = 'docs/conventional-commits.md';
const COMMIT_FORMAT = 'tipo(escopo opcional): descrição';

const EXAMPLES = {
  feat: 'feat: add home page shell',
  fix: 'fix(home): correct typo in title',
  docs: 'docs: describe conventional commits workflow',
  chore: 'chore: setup husky hooks',
};

const RULE_HELP = {
  'type-enum': {
    problem: 'O tipo do commit não é permitido.',
    tip: 'Escolha um dos tipos aceitos e reescreva a mensagem.',
  },
  'type-empty': {
    problem: 'A mensagem está fora do formato Conventional Commits.',
    tip: 'Comece com um tipo válido, seguido de dois-pontos e a descrição.',
  },
  'subject-empty': {
    problem: 'A descrição do commit está vazia.',
    tip: 'Inclua uma descrição curta após o tipo, por exemplo: feat: add login page.',
  },
};

const DEFAULT_HELP = {
  problem: 'A mensagem não segue Conventional Commits.',
  tip: 'Ajuste o formato e tente novamente.',
};

function color(code, text) {
  if (!STYLE.useColor) {
    return text;
  }
  return `${code}${text}${ANSI.reset}`;
}

function emoji(symbol) {
  return STYLE.useEmojis ? `${symbol}  ` : '';
}

function separator() {
  return color(ANSI.dim, '────────────────────────────────────────');
}

function section(title, bodyLines) {
  const label = color(ANSI.cyan + ANSI.bold, title);
  const body = bodyLines.map((line) => `  ${line}`).join('\n');
  return `  ${label}\n${body}`;
}

const RULE_PRIORITY = ['type-enum', 'type-empty', 'subject-empty'];

function resolveHelp(ruleIds = []) {
  for (const id of RULE_PRIORITY) {
    if (ruleIds.includes(id) && RULE_HELP[id]) {
      return RULE_HELP[id];
    }
  }
  for (const id of ruleIds) {
    if (RULE_HELP[id]) {
      return RULE_HELP[id];
    }
  }
  return DEFAULT_HELP;
}

function formatTypes(types = []) {
  if (!types.length) {
    return '(nenhum tipo configurado)';
  }
  const joined = types.join(', ');
  if (joined.length <= 48) {
    return joined;
  }
  const mid = Math.ceil(types.length / 2);
  return `${types.slice(0, mid).join(', ')},\n  ${types.slice(mid).join(', ')}`;
}

function formatErrorReport({ ruleIds = [], types = [] } = {}) {
  const help = resolveHelp(ruleIds);
  const bullet = STYLE.useEmojis ? '•' : '-';
  const exampleLines = Object.values(EXAMPLES).map(
    (example) => color(ANSI.dim, `${bullet} ${example}`),
  );

  const lines = [
    '',
    separator(),
    `  ${emoji('✖')}${color(ANSI.red + ANSI.bold, 'Commit rejeitado')}`,
    separator(),
    '',
    section('Problema', [help.problem]),
    '',
    section('Como corrigir', [
      help.tip,
      `Use o formato: ${color(ANSI.white + ANSI.bold, COMMIT_FORMAT)}`,
      `Exemplo: ${color(ANSI.green, EXAMPLES.feat)}`,
    ]),
    '',
    section('Tipos aceitos', [color(ANSI.yellow, formatTypes(types))]),
    '',
    section('Exemplos', exampleLines),
    '',
    section('Documentação', [color(ANSI.cyan, DOCS_PATH)]),
    separator(),
    '',
  ];

  return lines.join('\n');
}

function printErrorReport(opts) {
  console.error(formatErrorReport(opts));
}

module.exports = {
  DOCS_PATH,
  COMMIT_FORMAT,
  EXAMPLES,
  RULE_HELP,
  DEFAULT_HELP,
  STYLE,
  resolveHelp,
  formatErrorReport,
  printErrorReport,
};
