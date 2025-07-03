import { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTripStore } from '@/store/tripStore';
import { Trip } from '@/types';
import TripForm from './TripForm';
import TripCard from './TripCard';
import TripDetail from './TripDetail';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'trips' | 'create' | 'detail'>('trips');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const { user, logout } = useAuth();
  const { trips, loading, fetchTrips } = useTripStore();

  useEffect(() => {
    if (user) {
      fetchTrips(user.uid);
    }
  }, [user, fetchTrips]);

  const handleTripCreated = () => {
    setActiveView('trips');
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setActiveView('detail');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (activeView === 'detail' && selectedTrip) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <TripDetail 
          trip={selectedTrip} 
          onBack={() => setActiveView('trips')} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Wanderly</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'trips' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Your Trips</h2>
                <p className="text-gray-600 mt-2">Plan and manage your travel adventures</p>
              </div>
              <button
                onClick={() => setActiveView('create')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Trip
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
                <button
                  onClick={() => setActiveView('create')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onView={handleViewTrip}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeView === 'create' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Create New Trip</h2>
                <p className="text-gray-600 mt-2">Let AI help you plan the perfect vacation</p>
              </div>
              <button
                onClick={() => setActiveView('trips')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Trips
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              <TripForm onSuccess={handleTripCreated} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}