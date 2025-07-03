export interface Trip {
  id?: string;
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  interests: string[];
  budget: 'low' | 'medium' | 'high';
  itinerary: string;
  destinationInfo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}
