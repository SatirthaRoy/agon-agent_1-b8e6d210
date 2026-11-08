import { createCollectionHandler } from '../_lib/collections.js';

export const onRequest = ({ request, env }) => createCollectionHandler({
  table: 'quiz_questions',
  columns: ['question', 'options', 'correct_index', 'explanation'],
  orderBy: 'id',
})(request, env);