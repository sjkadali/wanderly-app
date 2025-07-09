import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <MapPin className="w-16 h-16 text-blue-500 mb-4" />
      <h1 className="text-5xl font-extrabold text-blue-700 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <span className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow">
          Go Home
        </span>
      </Link>
    </div>
  );
}