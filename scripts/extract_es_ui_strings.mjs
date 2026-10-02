import { readFileSync, writeFileSync } from 'node:fs';
import ts from '../frontend/node_modules/typescript/lib/typescript.js';

const sourcePath = 'frontend/src/i18n/index.ts';
const source = readFileSync(sourcePath, 'utf8');
const file = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const values = [];

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return null;
}

function walk(node, path) {
  if (ts.isObjectLiteralExpression(node)) {
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const name = propertyName(property.name);
      if (name !== null) walk(property.initializer, [...path, name]);
    }
    return;
  }
  if (ts.isArrayLiteralExpression(node)) {
    node.elements.forEach((element, index) => walk(element, [...path, String(index)]));
    return;
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    if (node.text.trim()) values.push({ path, value: node.text });
  }
}

function visit(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'en') {
    walk(node.initializer, []);
  }
  ts.forEachChild(node, visit);
}

visit(file);
writeFileSync('scripts/es-ui-strings.json', JSON.stringify(values, null, 2) + '\n', 'utf8');
console.log(`Extracted ${values.length} English UI strings`);
