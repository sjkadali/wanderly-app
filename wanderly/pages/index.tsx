import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';
import AuthForm from '@/components/AuthForm';
import { MapPin, Sparkles, Clock, DollarSign } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) return <Dashboard />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section with Auth Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          {/* Left: Hero Content */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Plan Your Perfect Trip in Minutes
            </h1>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed font-medium">
              Let AI generate personalized itineraries, discover hidden gems, and explore destinations like never before.
            </p>
            <div className="space-y-5">
              <div className="flex gap-4">
                <Sparkles className="w-7 h-7 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg font-medium">AI-powered itineraries tailored to your interests</p>
              </div>
              <div className="flex gap-4">
                <Clock className="w-7 h-7 text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg font-medium">Save hours of research with instant travel guides</p>
              </div>
              <div className="flex gap-4">
                <DollarSign className="w-7 h-7 text-pink-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg font-medium">Budget-friendly planning for every traveler</p>
              </div>
            </div>
          </div>

          {/* Right: Auth Form */}
          <div className="flex justify-center">
            <AuthForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-shadow">
            <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Itineraries</h3>
            <p className="text-gray-600">
              Get AI-generated day-by-day plans based on your interests and budget.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 text-center hover:shadow-xl transition-shadow">
            <Clock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Guides</h3>
            <p className="text-gray-600">
              Skip hours of research. Get complete destination info in seconds.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-8 text-center hover:shadow-xl transition-shadow">
            <DollarSign className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">All Budgets</h3>
            <p className="text-gray-600">
              Plan for any budget with cost estimates and money-saving tips.
            </p>
          </div>
        </div>

        {/* What You Can Do Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What You Can Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Generate Custom Itineraries</h3>
                <p className="mt-2 text-gray-600">Create personalized day-by-day travel plans tailored to your interests.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-500 text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Discover Destinations</h3>
                <p className="mt-2 text-gray-600">Learn about must-see attractions, local cuisine, and travel tips.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-pink-500 text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Real Photos</h3>
                <p className="mt-2 text-gray-600">See stunning images of places and local food from around the world.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-500 text-white font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Save Your Trips</h3>
                <p className="mt-2 text-gray-600">Store and manage all your trip plans in one secure place.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}