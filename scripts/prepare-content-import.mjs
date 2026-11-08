import { readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const collections = {
  'love-story-timeline': {
    table: 'timeline_events',
    fields: ['id', 'title', 'event_date', 'description', 'location', 'image_url', 'order_index'],
  },
  'love-story-reasons': {
    table: 'love_reasons',
    fields: ['id', 'reason', 'category', 'order_index'],
  },
  'love-story-gallery': {
    table: 'gallery_memories',
    fields: ['id', 'title', 'caption', 'image_url', 'date_taken', 'is_favorite', 'order_index'],
  },
  'love-story-notes': {
    table: 'love_notes',
    fields: ['id', 'title', 'content', 'is_secret', 'unlock_code', 'created_at', 'read_by_gf'],
  },
  'love-story-bucketlist': {
    table: 'bucket_list',
    fields: ['id', 'title', 'category', 'completed', 'completed_date', 'target_date'],
  },
  'love-story-quiz': {
    table: 'quiz_questions',
    fields: ['id', 'question', 'options', 'correct_index', 'explanation'],
  },
};

function quote(value) {
  if (value === null || value === undefined || value === '') return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `'${text.replace(/'/g, "''")}'`;
}

const backupPath = process.argv[2];
if (!backupPath) {
  console.error('Usage: node scripts/prepare-content-import.mjs <backup.json>');
  process.exit(1);
}

const backup = JSON.parse(await readFile(path.resolve(backupPath), 'utf8'));
const statements = [];
let imported = 0;

for (const [storageKey, config] of Object.entries(collections)) {
  if (!backup[storageKey]) continue;
  const records = JSON.parse(backup[storageKey]);
  if (!Array.isArray(records)) throw new Error(`Expected an array for ${storageKey}.`);

  const usedIds = new Set();
  let nextId = records.reduce((max, record) => Math.max(max, Number(record?.id) || 0), 0) + 1;

  for (const record of records) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      throw new Error(`Expected object records in ${storageKey}.`);
    }
    let id = Number(record.id);
    if (!Number.isInteger(id) || id < 1 || usedIds.has(id)) {
      while (usedIds.has(nextId)) nextId += 1;
      id = nextId;
      nextId += 1;
    }
    usedIds.add(id);
    const fields = config.fields.filter((field) => record[field] !== undefined);
    if (!fields.includes('id')) fields.unshift('id');
    const values = fields.map((field) => quote(field === 'id' ? id : record[field]));
    statements.push(`INSERT OR IGNORE INTO ${config.table} (${fields.join(', ')}) VALUES (${values.join(', ')});`);
    imported += 1;
  }
}

if (!imported) throw new Error('No supported content collections were found in the backup.');

const outputPath = path.join(os.tmpdir(), 'love-site-content-import.sql');
await writeFile(outputPath, `${statements.join('\n')}\n`, { encoding: 'utf8', mode: 0o600 });
console.log(`Prepared ${imported} records in ${outputPath}`);
console.log('This SQL file is outside the repository and can contain private love letters.');