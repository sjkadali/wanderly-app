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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            {trip.destination}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(trip.startDate, 'MMM dd')} - {format(trip.endDate, 'MMM dd')}
            </span>
            <span>{trip.duration} days</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBudgetColor(trip.budget)}`}>
            <DollarSign className="w-3 h-3" />
            {trip.budget}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {trip.interests.slice(0, 3).map((interest) => (
            <span key={interest} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {interest}
            </span>
          ))}
          {trip.interests.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{trip.interests.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(trip)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-2 px-3 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}