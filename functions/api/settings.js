import { jsonResponse, readJson, requireAdmin } from '../_lib/auth.js';

const JSON_FIELDS = new Set(['enabled_components', 'section_order']);
const ALLOWED_FIELDS = new Set([
  'partner_name', 'user_name', 'hero_title', 'hero_subtitle', 'romantic_quote',
  'anniversary_date', 'theme_id', 'primary_color', 'font_style', 'secret_code',
  'bg_music_url', 'enabled_components', 'section_order',
]);

function parseSettings(row) {
  if (!row) return null;
  const settings = { ...row };
  delete settings.master_pin;
  for (const field of JSON_FIELDS) {
    try {
      settings[field] = JSON.parse(settings[field]);
    } catch {
      settings[field] = field === 'section_order' ? [] : {};
    }
  }
  return settings;
}

export async function onRequestGet({ env }) {
  const row = await env.DB.prepare('SELECT * FROM site_settings WHERE id = 1').first();
  return jsonResponse(parseSettings(row));
}

export async function onRequestPut({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  return saveSettings(request, env);
}

export async function onRequestPost({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  return saveSettings(request, env);
}

async function saveSettings(request, env) {
  const body = await readJson(request);
  if (!body || typeof body !== 'object' || Array.isArray(body)) return jsonResponse({ error: 'Invalid request body.' }, 400);
  const updates = Object.entries(body).filter(([key, value]) => ALLOWED_FIELDS.has(key) && value !== undefined);
  if (!updates.length) return jsonResponse({ error: 'No valid settings provided.' }, 400);

  const values = updates.map(([key, value]) => JSON_FIELDS.has(key) ? JSON.stringify(value) : value);
  values.push(new Date().toISOString());
  const assignments = updates.map(([key]) => `${key} = ?`).join(', ');
  await env.DB.prepare(`UPDATE site_settings SET ${assignments}, updated_at = ? WHERE id = 1`).bind(...values).run();
  const row = await env.DB.prepare('SELECT * FROM site_settings WHERE id = 1').first();
  return jsonResponse(parseSettings(row));
}