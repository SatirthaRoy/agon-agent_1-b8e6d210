import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../types';
import { HelpCircle, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { notifyContentUpdated } from '../../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection, writeAdminCollection, deleteAdminCollection } from '../../lib/adminDataStorage';

export const QuizEditorTab: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQ, setEditingQ] = useState<Partial<QuizQuestion> | null>(null);

  const fetchQuiz = async () => {
    try {
      const data = await readAdminCollection<QuizQuestion>(STORAGE_KEYS.quiz, '/api/quiz');
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQ) return;

    try {
      const isNew = !editingQ.id;
      await writeAdminCollection<QuizQuestion>(
        STORAGE_KEYS.quiz,
        '/api/quiz',
        {
          ...editingQ,
          id: editingQ.id ?? 0,
        } as QuizQuestion,
        isNew ? 'POST' : 'PUT',
      );

      setEditingQ(null);
      await fetchQuiz();
      notifyContentUpdated('quiz');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete quiz question?')) return;
    try {
      await deleteAdminCollection<QuizQuestion>(STORAGE_KEYS.quiz, '/api/quiz', id);
      await fetchQuiz();
      notifyContentUpdated('quiz');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-pink-500" />
          <span>Manage Couple Knowledge Quiz ({questions.length})</span>
        </h3>

        <button
          onClick={() =>
            setEditingQ({
              question: '',
              options: ['', '', '', ''],
              correct_index: 0,
              explanation: '',
            })
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {editingQ && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-pink-50/80 dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-rose-950 dark:text-rose-100">
              {editingQ.id ? 'Edit Question' : 'Add New Question'}
            </h4>
            <button type="button" onClick={() => setEditingQ(null)}>
              <X className="w-5 h-5 text-rose-500" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Question</label>
              <input
                type="text"
                required
                value={editingQ.question || ''}
                onChange={(e) => setEditingQ({ ...editingQ, question: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-1">
                  <label className="text-xs font-semibold flex items-center justify-between">
                    <span>Option {idx + 1}</span>
                    <input
                      type="radio"
                      name="correct_index"
                      checked={editingQ.correct_index === idx}
                      onChange={() => setEditingQ({ ...editingQ, correct_index: idx })}
                    />
                  </label>
                  <input
                    type="text"
                    required
                    value={editingQ.options?.[idx] || ''}
                    onChange={(e) => {
                      const opts = [...(editingQ.options || ['', '', '', ''])];
                      opts[idx] = e.target.value;
                      setEditingQ({ ...editingQ, options: opts });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Explanation / Cute Feedback</label>
              <textarea
                rows={2}
                value={editingQ.explanation || ''}
                onChange={(e) => setEditingQ({ ...editingQ, explanation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md">
            Save Question
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-rose-500 text-sm">Loading trivia...</div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 rounded-2xl bg-white dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 flex items-start justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-bold text-pink-600 bg-pink-100 dark:bg-rose-900 px-2 py-0.5 rounded-full">
                  Question #{idx + 1}
                </span>
                <h4 className="font-bold text-base text-rose-950 dark:text-rose-100 mt-1">{q.question}</h4>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setEditingQ(q)} className="p-2 rounded-lg bg-pink-100 text-pink-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg bg-rose-100 text-rose-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
