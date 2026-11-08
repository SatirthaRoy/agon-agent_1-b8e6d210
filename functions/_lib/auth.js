const encoder = new TextEncoder();
const COOKIE_NAME = 'love_admin_session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export function cookieHeader(value, requestUrl, maxAge = SESSION_SECONDS) {
  const secure = new URL(requestUrl).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export async function createAdminSession(env) {
  if (!env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be set to a random value of at least 32 characters.');
  }
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expiresAt);
  return `${payload}.${await sign(payload, env.ADMIN_SESSION_SECRET)}`;
}

export async function isAdminRequest(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const value = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!value || !env.ADMIN_SESSION_SECRET) return false;

  const [expiresAt, signature, extra] = value.split('.');
  if (!expiresAt || !signature || extra || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;

  try {
    return constantTimeEqual(signature, await sign(expiresAt, env.ADMIN_SESSION_SECRET));
  } catch {
    return false;
  }
}

export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function requireAdmin(request, env) {
  if (!(await isAdminRequest(request, env))) {
    return jsonResponse({ error: 'Admin login required.' }, 401);
  }
  return null;
}