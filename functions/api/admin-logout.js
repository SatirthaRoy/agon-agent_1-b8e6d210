import { cookieHeader, jsonResponse } from '../_lib/auth.js';

export function onRequestPost({ request }) {
  return jsonResponse({ success: true }, 200, { 'Set-Cookie': cookieHeader('', request.url, 0) });
}