'use strict';

/**
 * Orquestra a validação do commit-msg via Commitlint
 * e delega a UX para commit-msg-presentation.js.
 */

const path = require('path');
const { spawnSync } = require('child_process');
const { printErrorReport } = require('./commit-msg-presentation');

function getAcceptedTypes() {
  const config = require(path.join(__dirname, '..', 'commitlint.config.js'));
  const typeEnum = config.rules && config.rules['type-enum'];
  if (Array.isArray(typeEnum) && Array.isArray(typeEnum[2])) {
    return typeEnum[2];
  }
  return [];
}

function extractRuleIds(output) {
  const ids = new Set();
  const regex = /\[([a-z0-9-]+)\]/gi;
  let match;
  while ((match = regex.exec(output)) !== null) {
    ids.add(match[1]);
  }
  return [...ids];
}

function main() {
  const msgFile = process.argv[2];

  if (!msgFile) {
    printErrorReport({
      ruleIds: [],
      types: getAcceptedTypes(),
    });
    process.exit(1);
  }

  const result = spawnSync(
    'npx',
    ['--no', '--', 'commitlint', '--edit', msgFile],
    {
      encoding: 'utf8',
      env: process.env,
    },
  );

  if (result.status === 0) {
    process.exit(0);
  }

  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  const ruleIds = extractRuleIds(output);
  const types = getAcceptedTypes();

  printErrorReport({ ruleIds, types });
  process.exit(typeof result.status === 'number' ? result.status : 1);
}

main();
