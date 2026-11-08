import { createCollectionHandler } from '../_lib/collections.js';

export const onRequest = ({ request, env }) => createCollectionHandler({
  table: 'gf_messages',
  columns: ['sender', 'message', 'sentiment'],
  orderBy: 'created_at',
  descending: true,
  publicPost: true,
  defaults: { sender: 'Your Girlfriend', sentiment: 'heart' },
})(request, env);