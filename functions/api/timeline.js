import { createCollectionHandler } from '../_lib/collections.js';

export const onRequest = ({ request, env }) => createCollectionHandler({
  table: 'timeline_events',
  columns: ['title', 'event_date', 'description', 'location', 'image_url', 'image_urls', 'order_index'],
  orderBy: 'order_index',
})(request, env);