'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isAuthenticated, userId, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading)
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
          <div className="flex items-center gap-4">
            <Link
              href="/rides"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Rides
            </Link>
            <Link
              href="/sessions"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Sessions
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

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-zinc-400">
            User:{' '}
            <span className="text-violet-400 font-mono">
              {userId?.slice(0, 8)}...
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm text-zinc-500 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium">Active</span>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm text-zinc-500 mb-1">Location</p>
            <span className="font-medium">Online</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm text-zinc-500 mb-1">Rating</p>
            <span className="font-medium">5.0 ⭐</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm text-zinc-500 mb-1">Role</p>
            <span className="font-medium">Rider</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/rides/new"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center mb-3">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Request a Ride</h3>
            <p className="text-sm text-zinc-400">Book a new ride</p>
          </Link>

          <Link
            href="/rides"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-1">View All Rides</h3>
            <p className="text-sm text-zinc-400">Browse rides</p>
          </Link>

          <Link
            href="/driver/register"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Become a Driver</h3>
            <p className="text-sm text-zinc-400">Start earning</p>
          </Link>
        </div>

        <Link
          href="/sessions"
          className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500"
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
            <div>
              <h3 className="font-medium">Active Sessions</h3>
              <p className="text-sm text-zinc-400">Manage logins</p>
            </div>
          </div>
          <svg
            className="w-5 h-5 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </main>
    </div>
  );
}
