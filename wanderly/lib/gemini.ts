import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

// Cache for storing responses to avoid duplicate API calls
const responseCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper function to create cache key
const createCacheKey = (destination: string, duration?: number, interests?: string[], budget?: string) => {
  return `${destination}_${duration || ''}_${interests?.join(',') || ''}_${budget || ''}`;
};

// Helper function to check if cache is valid
const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Retry mechanism with exponential backoff
const retryWithBackoff = async (fn: Function, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const generateItinerary = async (
  destination: string,
  duration: number,
  interests: string[],
  budget: string
) => {
  // Check cache first
  const cacheKey = createCacheKey(destination, duration, interests, budget);
  const cached = responseCache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    console.log('Returning cached itinerary');
    return cached.data;
  }

  const prompt = `Create a detailed ${duration}-day vacation itinerary for ${destination}. 
  Budget level: ${budget}
  Interests: ${interests.join(', ')}
  
  Please provide:
  1. Daily activities with specific recommendations
  2. Estimated costs for each activity
  3. Restaurant recommendations
  4. Transportation tips
  5. Best times to visit attractions
  
  Format the response as a structured itinerary with clear day-by-day breakdown starting with "Day 1:", "Day 2:", etc.`;

  const generateContent = async () => {
    const response = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    let fullText = '';
    for await (const chunk of response) {
      fullText += chunk.text;
    }
    return fullText;
  };

  try {
    const result = await retryWithBackoff(generateContent);
    
    // Cache the result
    responseCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    // Clean old cache entries periodically
    if (responseCache.size > 50) {
      cleanCache();
    }
    
    return result;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary. Please try again.');
  }
};

export const getDestinationInfo = async (destination: string) => {
  // Check cache first
  const cacheKey = createCacheKey(destination);
  const cached = responseCache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    console.log('Returning cached destination info');
    return cached.data;
  }

  const prompt = `Provide comprehensive travel information for ${destination}:

## Best time to visit
Weather, seasons, peak/off-peak periods

## Must-see attractions
Top 5-7 attractions with brief descriptions

## Local cuisine highlights
Must-try dishes and where to find them

## Cultural tips and etiquette
Important customs and social norms

## Transportation options
Getting around the city/region

## Average costs
Accommodation and meal price ranges

## Safety considerations
Key safety tips for travelers

Format: Use ## headings for each section as shown above.`;

  const generateContent = async () => {
    const response = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    let fullText = '';
    for await (const chunk of response) {
      fullText += chunk.text;
    }
    return fullText;
  };

  try {
    const result = await retryWithBackoff(generateContent);
    
    // Cache the result
    responseCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    // Clean old cache entries periodically
    if (responseCache.size > 50) {
      cleanCache();
    }
    
    return result;
  } catch (error) {
    console.error('Error getting destination info:', error);
    throw new Error('Failed to get destination information. Please try again.');
  }
};

// Clean expired cache entries
const cleanCache = () => {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (!isCacheValid(value.timestamp)) {
      responseCache.delete(key);
    }
  }
  console.log(`Cache cleaned. Current size: ${responseCache.size}`);
};

// Clear cache manually if needed
export const clearCache = () => {
  responseCache.clear();
  console.log('Cache cleared');
};

// Get cache stats for debugging
export const getCacheStats = () => {
  return {
    size: responseCache.size,
    keys: Array.from(responseCache.keys()),
  };
};