import { jsonResponse, readJson, requireAdmin } from './auth.js';

const BOOLEAN_FIELDS = new Set(['completed', 'is_favorite', 'is_secret', 'read_by_gf']);
const JSON_FIELDS = new Set(['options', 'image_urls']);

function serializeRow(row, table) {
  if (!row) return row;
  const result = { ...row };
  for (const field of BOOLEAN_FIELDS) {
    if (field in result) result[field] = Boolean(result[field]);
  }
  for (const field of JSON_FIELDS) {
    if ((field === 'image_urls' || (field === 'options' && table === 'quiz_questions')) && typeof result[field] === 'string') {
      try {
        result[field] = JSON.parse(result[field]);
      } catch {
        result[field] = [];
      }
    }
  }
  return result;
}

function toDatabaseValue(field, value) {
  if (BOOLEAN_FIELDS.has(field)) return value ? 1 : 0;
  if (JSON_FIELDS.has(field)) return JSON.stringify(value);
  return value;
}

export function createCollectionHandler({ table, columns, orderBy = 'id', descending = false, publicPost = false, defaults = {} }) {
  const allowed = new Set(columns);

  return async function handleCollection(request, env) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (method === 'GET') {
      const direction = descending ? 'DESC' : 'ASC';
      const { results = [] } = await env.DB.prepare(`SELECT * FROM ${table} ORDER BY ${orderBy} ${direction}`).all();
      return jsonResponse(results.map((row) => serializeRow(row, table)));
    }

    if ((method === 'POST' && !publicPost) || method === 'PUT' || method === 'DELETE') {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
    }

    if (method === 'POST') {
      const body = await readJson(request);
      if (!body || typeof body !== 'object' || Array.isArray(body)) return jsonResponse({ error: 'Invalid request body.' }, 400);
      const values = { ...defaults };
      for (const [key, value] of Object.entries(body)) {
        if (allowed.has(key) && key !== 'id' && value !== undefined) values[key] = value;
      }
      const fields = Object.keys(values);
      if (!fields.length) return jsonResponse({ error: 'No valid fields provided.' }, 400);
      const placeholders = fields.map(() => '?').join(', ');
      const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      const row = await env.DB.prepare(sql).bind(...fields.map((field) => toDatabaseValue(field, values[field]))).first();
      return jsonResponse(serializeRow(row, table), 201);
    }

    if (method === 'PUT') {
      const body = await readJson(request);
      const id = Number(body?.id);
      if (!Number.isInteger(id) || id < 1) return jsonResponse({ error: 'A valid id is required.' }, 400);
      const updates = Object.entries(body).filter(([key, value]) => key !== 'id' && allowed.has(key) && value !== undefined);
      if (!updates.length) return jsonResponse({ error: 'No valid fields provided.' }, 400);
      const assignments = updates.map(([key]) => `${key} = ?`).join(', ');
      const values = updates.map(([key, value]) => toDatabaseValue(key, value));
      const row = await env.DB.prepare(`UPDATE ${table} SET ${assignments} WHERE id = ? RETURNING *`)
        .bind(...values, id)
        .first();
      return row ? jsonResponse(serializeRow(row, table)) : jsonResponse({ error: 'Record not found.' }, 404);
    }

    if (method === 'DELETE') {
      const id = Number(url.searchParams.get('id'));
      if (!Number.isInteger(id) || id < 1) return jsonResponse({ error: 'A valid id is required.' }, 400);
      await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST, PUT, DELETE' });
  };
}