import { MapPin, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  user?: { email?: string };
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm border-b border-blue-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <MapPin className="w-10 h-10 text-white drop-shadow" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">Wanderly</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user?.email ? (
              <>
                <span className="text-white/90 font-medium">{user.email}</span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold shadow"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                )}
              </>
            ) : (
              <Link href="/">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold shadow cursor-pointer">
                  <LogIn className="w-5 h-5" />
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}