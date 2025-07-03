import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

export const generateItinerary = async (
  destination: string,
  duration: number,
  interests: string[],
  budget: string
) => {
  //const model = genAI.getModel({ model: 'gemini-2.5-flash' });

  const prompt = `Create a detailed ${duration}-day vacation itinerary for ${destination}. 
  Budget level: ${budget}
  Interests: ${interests.join(', ')}
  
  Please provide:
  1. Daily activities with specific recommendations
  2. Estimated costs for each activity
  3. Restaurant recommendations
  4. Transportation tips
  5. Best times to visit attractions
  
  Format the response as a structured itinerary with clear day-by-day breakdown.`;

  try {
    const response = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    let fullText = '';
    for await (const chunk of response) {
      fullText += chunk.text;
    }
   return fullText
 }
 catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary');
  }
};

export const getDestinationInfo = async (destination: string) => {
  //const model = genAI.models.({ model: 'gemini-pro' });

  const prompt = `Provide comprehensive travel information for ${destination} including:
  1. Best time to visit (weather, seasons)
  2. Must-see attractions
  3. Local cuisine highlights
  4. Cultural tips and etiquette
  5. Transportation options
  6. Average costs for accommodation and meals
  7. Safety considerations
  
  Keep it concise but informative.`;

  try {
    const response = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    let fullText = '';
    for await (const chunk of response) {
      fullText += chunk.text;
    }
    return fullText;
  } catch (error) {
    console.error('Error getting destination info:', error);
    throw new Error('Failed to get destination information');
  }
};