"use client";

import React, { useEffect, useState, useCallback } from 'react'; 
import { useRouter } from 'next/navigation';
import EventDetails from '@/components/dashboard/EventDetails'; 
import { motion } from 'framer-motion';
import type { User } from '@/types/user.type'; 



interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string; 
  location: string;
  capacity: number;
  ticket_price: number;
  imageUrls: string[];
  contact_info: string;
  tickets_sold: number;
  attendee_list: string[]; 
  owner: User;
  createdAt: string;
  updatedAt: string;
}

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = params;
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 404) {
        setError('Event not found.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to fetch event details.');
        if (res.status === 401 || res.status === 403) {
          router.push('/');
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setEvent(data.event);
      setLoading(false);

    } catch (err: any) {
      console.error('Error fetching event:', err);
      setError('Network error or server unavailable.');
      setLoading(false);
    }
  }, [id, router]); 

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {

        setCurrentUser(null);
        return;
      }

      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchEvent();
      fetchCurrentUser();
    }
  }, [id, fetchEvent, fetchCurrentUser]);

  const handleEventUpdated = () => {
    fetchEvent(); 
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 to-pink-300/60 z-10" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/60 z-15" aria-hidden="true"></div>
        <div className="relative z-20 text-xl font-semibold text-gray-700">Loading Event Details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 to-pink-300/60 z-10" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/60 z-15" aria-hidden="true"></div>
        <div className="relative z-20 text-xl font-semibold text-red-500 text-center">
          Error: {error}
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 to-pink-300/60 z-10" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/60 z-15" aria-hidden="true"></div>
        <div className="relative z-20 text-xl font-semibold text-gray-700 text-center">
          Event data could not be loaded.
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 to-pink-300/60 z-10" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/60 z-15" aria-hidden="true"></div>

      <EventDetails
        event={event}
        currentUser={currentUser} 
        onEventUpdated={handleEventUpdated} 
      />
    </div>
  );
}