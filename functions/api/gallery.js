import { createCollectionHandler } from '../_lib/collections.js';

export const onRequest = ({ request, env }) => createCollectionHandler({
  table: 'gallery_memories',
  columns: ['title', 'caption', 'image_url', 'date_taken', 'is_favorite', 'order_index'],
  orderBy: 'order_index',
})(request, env);