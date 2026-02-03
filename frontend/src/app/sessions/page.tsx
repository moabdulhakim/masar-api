'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) fetchSessions();
  }, [isAuthenticated, authLoading, router]);

  const fetchSessions = async () => {
    try {
      setSessions((await api.getUserSessions()) || []);
    } catch (err: unknown) {
      setError(
        (err as { message?: string }).message || 'Failed to fetch sessions',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  const getBrowser = (ua: string) =>
    ua.includes('Chrome')
      ? 'Chrome'
      : ua.includes('Firefox')
        ? 'Firefox'
        : ua.includes('Safari')
          ? 'Safari'
          : 'Browser';
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (authLoading || loading)
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

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-1">Active Sessions</h1>
        <p className="text-sm text-zinc-400 mb-8">Manage your login sessions</p>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-lg bg-green-500/15 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">No Sessions</h2>
            <p className="text-sm text-zinc-400">
              Your session data will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <div
                key={session.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-violet-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {getBrowser(session.userAgent)}
                    </span>
                    {i === 0 && (
                      <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 truncate mb-2">
                    {session.userAgent}
                  </p>
                  <div className="flex gap-4 text-xs text-zinc-400">
                    <span>{session.ipAddress}</span>
                    <span>{formatDate(session.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          <strong>Security Tip:</strong> If you see unfamiliar sessions, log out
          and change your password.
        </div>
      </main>
    </div>
  );
}
