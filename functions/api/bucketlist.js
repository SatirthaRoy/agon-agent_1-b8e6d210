import { createCollectionHandler } from '../_lib/collections.js';

export const onRequest = ({ request, env }) => createCollectionHandler({
  table: 'bucket_list',
  columns: ['title', 'category', 'completed', 'completed_date', 'target_date'],
  orderBy: 'id',
})(request, env);