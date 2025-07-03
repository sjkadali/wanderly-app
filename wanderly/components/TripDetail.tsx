import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, DollarSign, Heart, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/types';

interface TripDetailProps {
  trip: Trip;
  onBack: () => void;
}

export default function TripDetail({ trip, onBack }: TripDetailProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'info'>('itinerary');

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Check for headers (lines that start with numbers or bullets)
      if (line.match(/^\d+\./) || line.match(/^[•\-\*]/)) {
        return (
          <p key={index} className="font-semibold text-gray-900 mt-4 mb-2">
            {line}
          </p>
        );
      }
      
      // Check for day headers
      if (line.toLowerCase().includes('day ') && line.includes(':')) {
        return (
          <h3 key={index} className="text-lg font-bold text-blue-700 mt-6 mb-3 border-b border-blue-200 pb-2">
            {line}
          </h3>
        );
      }
      
      return (
        <p key={index} className="text-gray-700 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Trips
      </button>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            {trip.destination}
          </h1>
          <div className="flex items-center gap-6 mt-4 text-blue-100">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(trip.startDate, 'MMMM dd, yyyy')} - {format(trip.endDate, 'MMMM dd, yyyy')}
            </span>
            <span>{trip.duration} days</span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {trip.budget} budget
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {trip.interests.map((interest) => (
              <span key={interest} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 px-6 py-4 font-medium ${
                activeTab === 'itinerary'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              Itinerary
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-6 py-4 font-medium ${
                activeTab === 'info'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Info className="w-4 h-4" />
              Destination Info
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'itinerary' ? (
            <div className="prose max-w-none">
              <div className="text-gray-800">
                {formatContent(trip.itinerary)}
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="text-gray-800">
                {formatContent(trip.destinationInfo)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}