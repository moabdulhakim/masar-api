'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface Ride {
  id: string;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  cost: number;
  status: string;
  driver?: { id: string };
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingRide, setAcceptingRide] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const data = await api.getRides();
      setRides(data || []);
    } catch (err: unknown) {
      setError(
        (err as { message?: string }).message || 'Failed to fetch rides',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!isAuthenticated) {
      setError('Please login to accept rides');
      return;
    }
    setAcceptingRide(rideId);
    try {
      await api.acceptRide(rideId);
      await fetchRides();
    } catch (err: unknown) {
      setError(
        (err as { message?: string }).message || 'Failed to accept ride',
      );
    } finally {
      setAcceptingRide(null);
    }
  };

  const statusColors: Record<string, string> = {
    requested: 'bg-amber-500/15 text-amber-400',
    pending: 'bg-cyan-500/15 text-cyan-400',
    arrived: 'bg-cyan-500/15 text-cyan-400',
    started: 'bg-violet-500/15 text-violet-400',
    completed: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-red-500/15 text-red-400',
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
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/rides/new"
              className="px-4 py-2 text-sm bg-violet-600 rounded-lg hover:bg-violet-700 transition"
            >
              New Ride
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Available Rides</h1>
          <p className="text-sm text-zinc-400">
            Browse and accept ride requests
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : rides.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-lg bg-violet-500/15 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-violet-500"
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
            <h2 className="text-lg font-semibold mb-2">No Rides Available</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Be the first to request a ride!
            </p>
            <Link
              href="/rides/new"
              className="inline-block px-4 py-2 text-sm bg-violet-600 rounded-lg hover:bg-violet-700 transition"
            >
              Request a Ride
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[ride.status] || statusColors.requested}`}
                  >
                    {ride.status}
                  </span>
                  <span className="text-lg font-semibold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                    ${ride.cost.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-zinc-400 font-mono text-xs">
                      {ride.startLocation.lat.toFixed(4)},{' '}
                      {ride.startLocation.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-zinc-400 font-mono text-xs">
                      {ride.endLocation.lat.toFixed(4)},{' '}
                      {ride.endLocation.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
                {ride.driver ? (
                  <div className="text-center text-sm text-zinc-500 py-2">
                    Driver Assigned
                  </div>
                ) : ride.status === 'requested' && isAuthenticated ? (
                  <button
                    onClick={() => handleAcceptRide(ride.id)}
                    disabled={acceptingRide === ride.id}
                    className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-lg text-sm font-medium transition flex items-center justify-center"
                  >
                    {acceptingRide === ride.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Accept Ride'
                    )}
                  </button>
                ) : ride.status === 'requested' ? (
                  <Link
                    href="/login"
                    className="block w-full py-2 text-center border border-zinc-700 rounded-lg text-sm hover:bg-zinc-800 transition"
                  >
                    Login to Accept
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
