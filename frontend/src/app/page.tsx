'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent"
          >
            Masar
          </Link>
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/rides"
                  className="px-4 py-2 text-sm font-medium bg-violet-600 rounded-lg hover:bg-violet-700 transition"
                >
                  View Rides
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-violet-600 rounded-lg hover:bg-violet-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Your Journey,
            <br />
            <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
              Our Priority
            </span>
          </h1>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Experience seamless ride-hailing with Masar. Fast, reliable, and
            always at your service.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-medium bg-violet-600 rounded-lg hover:bg-violet-700 transition"
            >
              Start Riding
            </Link>
            <Link
              href="/driver/register"
              className="px-5 py-2.5 text-sm font-medium border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
            >
              Become a Driver
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-3">
            Why Choose Masar?
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            We make transportation simple and safe
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
              <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-zinc-400">
                Get matched with nearby drivers in seconds. No waiting, no
                hassle.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center mb-4">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Safe & Secure</h3>
              <p className="text-sm text-zinc-400">
                All drivers are verified. Track your ride in real-time for peace
                of mind.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
              <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center mb-4">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Fair Pricing</h3>
              <p className="text-sm text-zinc-400">
                Transparent pricing with no hidden fees. Pay what you see,
                always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-3">
            Quick Actions
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Get started with one click
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/rides"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center hover:border-zinc-700 transition"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-violet-500/15 flex items-center justify-center mb-3">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Browse Rides</span>
            </Link>

            <Link
              href="/rides/new"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center hover:border-zinc-700 transition"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-cyan-500/15 flex items-center justify-center mb-3">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Request Ride</span>
            </Link>

            <Link
              href="/sessions"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center hover:border-zinc-700 transition"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-green-500/15 flex items-center justify-center mb-3">
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
              <span className="text-sm font-medium">My Sessions</span>
            </Link>

            <Link
              href="/driver/register"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center hover:border-zinc-700 transition"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-amber-500/15 flex items-center justify-center mb-3">
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
              <span className="text-sm font-medium">Drive with Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-800">
        <p className="text-center text-sm text-zinc-500">
          © 2026 Masar. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
