import { cookieHeader, createAdminSession, jsonResponse, readJson } from '../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PIN) return jsonResponse({ error: 'Admin PIN is not configured in Cloudflare Pages settings.' }, 503);
  const body = await readJson(request);
  if (typeof body?.pin !== 'string' || body.pin !== env.ADMIN_PIN) {
    return jsonResponse({ authenticated: false, error: 'Incorrect Master PIN.' }, 401);
  }

  try {
    const session = await createAdminSession(env);
    return jsonResponse(
      { authenticated: true },
      200,
      { 'Set-Cookie': cookieHeader(session, request.url) },
    );
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Admin session setup failed.' }, 503);
  }
}