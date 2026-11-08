import { createCollectionHandler } from '../_lib/collections.js';

export const onRequest = ({ request, env }) => createCollectionHandler({
  table: 'love_notes',
  columns: ['title', 'content', 'is_secret', 'unlock_code'],
  orderBy: 'created_at',
  descending: true,
})(request, env);