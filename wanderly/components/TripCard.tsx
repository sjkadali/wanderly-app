import { useState } from 'react';
import { MapPin, Calendar, DollarSign, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/types';
import { useTripStore } from '@/store/tripStore';

interface TripCardProps {
  trip: Trip;
  onView: (trip: Trip) => void;
}

export default function TripCard({ trip, onView }: TripCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTrip } = useTripStore();

  const handleDelete = async () => {
    if (!trip.id || !confirm('Are you sure you want to delete this trip?')) return;
    
    setIsDeleting(true);
    try {
      await deleteTrip(trip.id);
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-7 hover:shadow-2xl transition-shadow duration-300 overflow-hidden group">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-white opacity-70 pointer-events-none rounded-2xl" />
      <div className="relative z-10 flex justify-between items-start mb-5">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 drop-shadow-sm">
            <MapPin className="w-7 h-7 text-blue-500" />
            {trip.destination}
          </h3>
          <div className="flex items-center gap-5 mt-3 text-base text-gray-600 font-medium">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              {format(trip.startDate, 'MMM dd')} - {format(trip.endDate, 'MMM dd')}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
              {trip.duration} days
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold shadow ${getBudgetColor(trip.budget)}`}>
            <DollarSign className="w-4 h-4" />
            {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}
          </span>
        </div>
      </div>

      <div className="mb-5 relative z-10">
        <div className="flex flex-wrap gap-2">
          {trip.interests.slice(0, 3).map((interest) => (
            <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium shadow-sm">
              {interest}
            </span>
          ))}
          {trip.interests.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{trip.interests.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 relative z-10">
        <button
          onClick={() => onView(trip)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
        >
          <Eye className="w-5 h-5" />
          View Details
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}