import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trip } from '@/types';

interface TripStore {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  createTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  fetchTrips: (userId: string) => Promise<void>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  loading: false,
  error: null,

  createTrip: async (tripData) => {
    set({ loading: true, error: null });
    try {
      const now = new Date();
      const trip = {
        ...tripData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'trips'), trip);
      const newTrip = { ...trip, id: docRef.id };
      
      set(state => ({ 
        trips: [...state.trips, newTrip],
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create trip', loading: false });
    }
  },

  fetchTrips: async (userId) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, 'trips'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const trips = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Trip[];
      
      set({ trips, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch trips', loading: false });
    }
  },

  updateTrip: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const tripRef = doc(db, 'trips', id);
      await updateDoc(tripRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      set(state => ({
        trips: state.trips.map(trip => 
          trip.id === id ? { ...trip, ...updates } : trip
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update trip', loading: false });
    }
  },

  deleteTrip: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'trips', id));
      set(state => ({
        trips: state.trips.filter(trip => trip.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete trip', loading: false });
    }
  },

  clearError: () => set({ error: null })
}));
