import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, MapPin, DollarSign, Heart, Loader2 } from 'lucide-react';
import { generateItinerary, getDestinationInfo } from '@/lib/gemini';
import { useTripStore } from '@/store/tripStore';
import { useAuth } from '@/hooks/useAuth';

interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string[];
  budget: 'low' | 'medium' | 'high';
}

const INTEREST_OPTIONS = [
  'Culture & History',
  'Food & Dining',
  'Adventure & Sports',
  'Nature & Wildlife',
  'Art & Museums',
  'Nightlife',
  'Shopping',
  'Relaxation & Spa',
  'Photography',
  'Local Experiences'
];

export default function TripForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TripFormData>();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { createTrip } = useTripStore();
  const { user } = useAuth();

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const duration = calculateDuration(watchedStartDate, watchedEndDate);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const onSubmit = async (data: TripFormData) => {
    if (!user || selectedInterests.length === 0) return;

    setIsGenerating(true);
    try {
      const [itinerary, destinationInfo] = await Promise.all([
        generateItinerary(data.destination, duration, selectedInterests, data.budget),
        getDestinationInfo(data.destination)
      ]);

      await createTrip({
        userId: user.uid,
        destination: data.destination,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        duration,
        interests: selectedInterests,
        budget: data.budget,
        itinerary,
        destinationInfo
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4" />
            Destination
          </label>
          <input
            {...register('destination', { required: 'Destination is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Where do you want to go?"
          />
          {errors.destination && (
            <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <input
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              End Date
            </label>
            <input
              type="date"
              {...register('endDate', { required: 'End date is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {duration > 0 && (
          <p className="text-sm text-gray-600">Trip duration: {duration} days</p>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            Budget Level
          </label>
          <select
            {...register('budget', { required: 'Budget level is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select budget level</option>
            <option value="low">Low Budget</option>
            <option value="medium">Medium Budget</option>
            <option value="high">High Budget</option>
          </select>
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Heart className="w-4 h-4" />
            Interests (select at least one)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  selectedInterests.includes(interest)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          {selectedInterests.length === 0 && (
            <p className="text-red-500 text-sm mt-1">Please select at least one interest</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating || selectedInterests.length === 0}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
        {isGenerating ? 'Generating Your Trip...' : 'Create Trip Plan'}
      </button>
    </form>
  );
}