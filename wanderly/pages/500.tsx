import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Custom500() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-yellow-100 to-pink-100">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-5xl font-extrabold text-red-700 mb-4">500</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Server Error</h2>
      <p className="text-gray-600 mb-6">Oops! Something went wrong on our end.</p>
      <Link href="/">
        <span className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow">
          Go Home
        </span>
      </Link>
    </div>
  );
}