'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading, router]);

  const handleDeleteAllUsers = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.deleteAllUsers();
      setSuccess('All users deleted successfully.');
      setConfirmDelete(false);
      setTimeout(async () => {
        await logout();
        router.push('/');
      }, 2000);
    } catch (err: unknown) {
      setError(
        (err as { message?: string }).message ||
          'Failed. You may not have admin privileges.',
      );
      setConfirmDelete(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading)
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <nav className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent"
          >
            Masar
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Admin Panel</h1>
            <p className="text-sm text-zinc-400">Manage the platform</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {success}
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-red-400 font-semibold mb-4">⚠️ Danger Zone</h2>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <h3 className="font-medium mb-1">Delete All Users</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Permanently delete all user accounts. Cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteAllUsers}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${confirmDelete ? 'bg-red-500 text-white border-red-500' : 'text-red-400 border-red-500 hover:bg-red-500 hover:text-white'}`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : confirmDelete ? (
                  'Confirm Delete'
                ) : (
                  'Delete All Users'
                )}
              </button>
              {confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-sm text-zinc-500 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-zinc-500 mt-4">
          Only admin users can perform these actions.
        </p>
      </main>
    </div>
  );
}
