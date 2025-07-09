import React, { useState } from 'react';
import type { JSX } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Info,
  Image as ImageIcon,
  Utensils,
  BedDouble,
  Plane,
  Landmark,
  Camera,
} from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '@/types';
import clsx from 'clsx'; // If not installed, run: npm install clsx

// Example fallback image (replace with real trip images if available)
const fallbackImages: Record<string, string> = {
  Paris: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  Tokyo: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  Bali: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
};

// Add more images for places and foods as needed
const placeImages: Record<string, string> = {
  Eiffel: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
  Louvre: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  Shibuya: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  Ubud: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  // Add more as needed
};

const foodImages: Record<string, string> = {
  croissant: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  sushi: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=400&q=80',
  nasi: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
  // Add more as needed
};

interface TripDetailProps {
  trip: Trip;
  onBack: () => void;
}

export default function TripDetail({ trip, onBack }: TripDetailProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'info'>('itinerary');

  const getImageForLine = (line: string) => {
    // Try to find a place or food keyword in the line
    for (const key in placeImages) {
      if (line.toLowerCase().includes(key.toLowerCase())) {
        return placeImages[key];
      }
    }
    for (const key in foodImages) {
      if (line.toLowerCase().includes(key.toLowerCase())) {
        return foodImages[key];
      }
    }
    return null;
  };

  const formatContent = (content: string) => {
    // Add icons for keywords in lines
    const iconMap: Record<string, JSX.Element> = {
      food: <Utensils className="inline w-5 h-5 text-pink-500 mr-2" />,
      restaurant: <Utensils className="inline w-5 h-5 text-pink-500 mr-2" />,
      meal: <Utensils className="inline w-5 h-5 text-pink-500 mr-2" />,
      accommodation: <BedDouble className="inline w-5 h-5 text-blue-500 mr-2" />,
      hotel: <BedDouble className="inline w-5 h-5 text-blue-500 mr-2" />,
      stay: <BedDouble className="inline w-5 h-5 text-blue-500 mr-2" />,
      flight: <Plane className="inline w-5 h-5 text-purple-500 mr-2" />,
      airport: <Plane className="inline w-5 h-5 text-purple-500 mr-2" />,
      sightseeing: <Landmark className="inline w-5 h-5 text-yellow-500 mr-2" />,
      attraction: <Landmark className="inline w-5 h-5 text-yellow-500 mr-2" />,
      tour: <Camera className="inline w-5 h-5 text-green-500 mr-2" />,
      photo: <Camera className="inline w-5 h-5 text-green-500 mr-2" />,
    };

    return content.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      let icon = null;
      for (const key in iconMap) {
        if (line.toLowerCase().includes(key)) {
          icon = iconMap[key];
          break;
        }
      }
      const imgUrl = getImageForLine(line);

      if (line.match(/^\d+\./) || line.match(/^[•\-\*]/)) {
        return (
          <div key={index} className="flex items-center gap-4 mt-4 mb-2">
            {imgUrl && (
              <img
                src={imgUrl}
                alt=""
                className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow"
              />
            )}
            <p className={clsx("font-semibold text-gray-900 flex items-center", imgUrl && "flex-1")}>
              {icon}
              {line}
            </p>
          </div>
        );
      }
      if (line.toLowerCase().includes('day ') && line.includes(':')) {
        return (
          <h3 key={index} className="text-lg font-bold text-blue-700 mt-6 mb-3 border-b border-blue-200 pb-2 flex items-center">
            {icon}
            {line}
          </h3>
        );
      }
      return (
        <div key={index} className="flex items-center gap-4 mb-2">
          {imgUrl && (
            <img
              src={imgUrl}
              alt=""
              className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow"
            />
          )}
          <p className="text-gray-700 leading-relaxed flex items-center">
            {icon}
            {line}
          </p>
        </div>
      );
    });
  };

  // Pick a beautiful image based on destination, or fallback
  const imageUrl =
    fallbackImages[trip.destination] ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Trips
      </button>

      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-64 w-full">
          <img
            src={imageUrl}
            alt={trip.destination}
            className="object-cover w-full h-full"
            style={{ filter: 'brightness(0.85)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-purple-700/30 to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-white drop-shadow" />
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">
              {trip.destination}
            </h1>
          </div>
        </div>

        {/* Header Details Card */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-50 via-purple-50 to-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl bg-white shadow-md border border-blue-100 p-5 flex flex-col items-start gap-3">
              <span className="flex items-center gap-2 text-blue-900 font-semibold">
                <Calendar className="w-5 h-5 text-purple-500" />
                Dates
              </span>
              <span className="text-gray-700">
                {format(trip.startDate, 'MMMM dd, yyyy')}<br />– {format(trip.endDate, 'MMMM dd, yyyy')}
              </span>
            </div>
            <div className="rounded-xl bg-white shadow-md border border-blue-100 p-5 flex flex-col items-start gap-3">
              <span className="flex items-center gap-2 text-blue-900 font-semibold">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                Duration
              </span>
              <span className="text-gray-700">{trip.duration} days</span>
            </div>
            <div className="rounded-xl bg-white shadow-md border border-blue-100 p-5 flex flex-col items-start gap-3">
              <span className="flex items-center gap-2 text-blue-900 font-semibold">
                <DollarSign className="w-5 h-5" />
                Budget
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-base font-semibold shadow ${trip.budget === 'low'
                ? 'bg-green-100 text-green-800'
                : trip.budget === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : trip.budget === 'high'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
              }`}>
                {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-7">
            {trip.interests.map((interest) => (
              <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium shadow-sm flex items-center gap-1">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 px-8 py-4 font-semibold text-lg transition-colors ${
                activeTab === 'itinerary'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-700'
              }`}
            >
              <Heart className="w-5 h-5" />
              Itinerary
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-8 py-4 font-semibold text-lg transition-colors ${
                activeTab === 'info'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-purple-700'
              }`}
            >
              <Info className="w-5 h-5" />
              Destination Info
            </button>
          </nav>
        </div>

        {/* Content Card */}
        <div className="p-8 bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-[300px]">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {activeTab === 'itinerary' ? (
              <>
                <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-500" />
                  Trip Itinerary
                </h2>
                {/* Each itinerary section as a card with a distinct color */}
                {trip.itinerary
                  .split(/(?=Day \d+:)/i)
                  .filter(Boolean)
                  .map((section, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-gradient-to-br from-blue-200 via-white to-purple-200 shadow-lg border border-blue-300 p-7"
                    >
                      <div className="prose max-w-none">
                        <div className="text-gray-800">{formatContent(section.trim())}</div>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-purple-500" />
                  Destination Info
                </h2>
                {(() => {
                  const matches = Array.from(
                    trip.destinationInfo.matchAll(/^##\s+([^\n]+)\n([\s\S]*?)(?=^##\s+|\Z)/gm)
                  );
                  if (!matches.length) {
                    // fallback: show all as one card if no headings found
                    return (
                      <div className="rounded-2xl bg-gradient-to-br from-pink-100 via-white to-purple-100 shadow-lg border border-purple-300 p-7 mb-4">
                        <div className="prose max-w-none">
                          <div className="text-gray-800">{formatContent(trip.destinationInfo.trim())}</div>
                        </div>
                      </div>
                    );
                  }
                  return matches.map(([, heading, content], idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-gradient-to-br from-pink-100 via-white to-purple-100 shadow-lg border border-purple-300 p-7 mb-4"
                    >
                      <h3 className="text-xl font-bold text-purple-800 mb-2">{heading}</h3>
                      <div className="prose max-w-none">
                        <div className="text-gray-800">{formatContent(content.trim())}</div>
                      </div>
                    </div>
                  ));
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}