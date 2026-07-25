import fs from 'fs';

const fileContent = fs.readFileSync('src/data/sampleProblems.ts', 'utf8');

// Find start of INITIAL_PROBLEMS
const startIndex = fileContent.indexOf('export const INITIAL_PROBLEMS: Problem[] = [');
const endIndex = fileContent.indexOf('export const INITIAL_BADGES');

const problemsSection = fileContent.substring(startIndex, endIndex);

// Parse objects
const idRegex = /id:\s*['"]([^'"]+)['"]/g;
const titleRegex = /title:\s*['"]([^'"]+)['"]/g;
const categoryRegex = /category:\s*['"]([^'"]+)['"]/g;

const ids = [...problemsSection.matchAll(idRegex)].map(m => m[1]);
const titles = [...problemsSection.matchAll(titleRegex)].map(m => m[1]);

console.log(`Found ${ids.length} IDs and ${titles.length} Titles`);

const uniqueTitles = new Map();
const duplicates = [];

titles.forEach((t, index) => {
  const normTitle = t.replace(/[^a-zA-X0-9가-힣]/g, '').toLowerCase();
  if (uniqueTitles.has(normTitle)) {
    duplicates.push({
      originalIndex: index,
      title: t,
      id: ids[index],
      firstSeen: uniqueTitles.get(normTitle)
    });
  } else {
    uniqueTitles.set(normTitle, { index, title: t, id: ids[index] });
  }
});

console.log('--- EXACT OR NORMALIZED TITLE DUPLICATES ---');
console.log(duplicates);
