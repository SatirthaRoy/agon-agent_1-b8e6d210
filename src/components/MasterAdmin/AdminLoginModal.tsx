import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { setIsAdmin } = useAuth();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAdmin(true);
        onClose();
      } else {
        setErrorMsg(data.error || 'Incorrect Master PIN');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to reach the admin login service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-rose-950 p-6 sm:p-8 rounded-3xl max-w-md w-full border border-pink-200 dark:border-rose-800 shadow-2xl space-y-6 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 hover:scale-110 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-extrabold text-rose-950 dark:text-rose-100">Master Admin Login</h3>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
            Enter your Master PIN to customize the entire website, components, and themes!
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="space-y-1">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Master PIN"
              className="w-full px-4 py-3 rounded-2xl bg-pink-50 dark:bg-rose-900/50 border border-pink-300 dark:border-rose-700 text-center font-bold text-xl tracking-widest text-rose-900 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {errorMsg && <p className="text-xs font-semibold text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            {loading ? 'Unlocking...' : 'Unlock Admin Dashboard 💕'}
          </button>
        </form>

        <div className="pt-2 border-t border-pink-100 dark:border-rose-900">
          <p className="text-[11px] text-rose-500/80">
            Only the site owner should know this PIN.
          </p>
        </div>
      </div>
    </div>
  );
};
