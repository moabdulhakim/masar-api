'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { VehicleType } from '@/lib/types';

export default function DriverRegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.CAR);
  const [driverLicenseId, setDriverLicenseId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createDriver({
        name,
        phone,
        email,
        password,
        vehicleType,
        driverLicenseId,
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      const error = err as { message?: string | string[] };
      setError(
        Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message || 'Registration failed',
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2">Welcome to the Team!</h1>
          <p className="text-sm text-zinc-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <nav className="border-b border-zinc-800 fixed top-0 left-0 right-0 bg-[#0a0a0c]/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent"
          >
            Masar
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-sm border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
          >
            Back
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-10 px-4">
        <div className="max-w-sm mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto rounded-lg bg-amber-500/15 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-amber-500"
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
            <h1 className="text-xl font-semibold mb-1">Become a Driver</h1>
            <p className="text-sm text-zinc-400">Join our network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                placeholder="+1234567890"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Vehicle Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(VehicleType).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setVehicleType(type)}
                    className={`p-3 rounded-lg border text-sm font-medium capitalize transition ${vehicleType === type ? 'border-violet-500 bg-violet-500/15 text-violet-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Driver License ID
              </label>
              <input
                type="text"
                value={driverLicenseId}
                onChange={(e) => setDriverLicenseId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                placeholder="DL-123456789"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-lg text-sm font-medium transition flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Register'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-zinc-400">
            Already a driver?{' '}
            <Link href="/login" className="text-violet-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
