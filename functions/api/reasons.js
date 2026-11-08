import { createCollectionHandler } from '../_lib/collections.js';

export const onRequest = ({ request, env }) => createCollectionHandler({
  table: 'love_reasons',
  columns: ['reason', 'category', 'order_index'],
  orderBy: 'order_index',
})(request, env);