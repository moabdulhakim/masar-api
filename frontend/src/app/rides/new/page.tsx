'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function NewRidePage() {
  const [startLat, setStartLat] = useState('');
  const [startLng, setStartLng] = useState('');
  const [endLat, setEndLat] = useState('');
  const [endLng, setEndLng] = useState('');
  const [cost, setCost] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createRide({
        startLocation: { lat: parseFloat(startLat), lng: parseFloat(startLng) },
        endLocation: { lat: parseFloat(endLat), lng: parseFloat(endLng) },
        cost: parseFloat(cost),
      });
      router.push('/rides');
    } catch (err: unknown) {
      const error = err as { message?: string | string[] };
      setError(
        Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message || 'Failed to create ride',
      );
    } finally {
      setLoading(false);
    }
  };

  const setRandom = (type: 'start' | 'end') => {
    const lat = (31.9 + Math.random() * 0.2).toFixed(6);
    const lng = (35.9 + Math.random() * 0.2).toFixed(6);
    if (type === 'start') {
      setStartLat(lat);
      setStartLng(lng);
    } else {
      setEndLat(lat);
      setEndLng(lng);
    }
  };

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
          <Link
            href="/rides"
            className="px-4 py-2 text-sm border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
          >
            Back to Rides
          </Link>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6 py-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <h1 className="text-xl font-semibold mb-1">Request a Ride</h1>
          <p className="text-sm text-zinc-400 mb-6">
            Enter pickup and dropoff locations
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Pickup</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRandom('start')}
                  className="text-xs text-violet-400 hover:underline"
                >
                  Random
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  value={startLat}
                  onChange={(e) => setStartLat(e.target.value)}
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Latitude"
                  required
                />
                <input
                  type="number"
                  step="any"
                  value={startLng}
                  onChange={(e) => setStartLng(e.target.value)}
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Longitude"
                  required
                />
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">Dropoff</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRandom('end')}
                  className="text-xs text-violet-400 hover:underline"
                >
                  Random
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  value={endLat}
                  onChange={(e) => setEndLat(e.target.value)}
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Latitude"
                  required
                />
                <input
                  type="number"
                  step="any"
                  value={endLng}
                  onChange={(e) => setEndLng(e.target.value)}
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                  placeholder="Longitude"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                placeholder="15.00"
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
                'Request Ride'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
