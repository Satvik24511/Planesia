"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, CalendarDays, PlusCircle, MapPin, ArrowLeft } from 'lucide-react'; 
import Link from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type User = {
  _id: string;
  name: string;
  email: string;
};

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  owner: User;
  location: string;
  capacity: number;
  ticket_price: number;
  imageUrls: string[];
  contact_info: string;
  tickets_sold: number;
  attendee_list: User[];
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingMyEvents, setIsLoadingMyEvents] = useState(true);
  const [isLoadingAttendingEvents, setIsLoadingAttendingEvents] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [errorMyEvents, setErrorMyEvents] = useState<string | null>(null);
  const [errorAttendingEvents, setErrorAttendingEvents] = useState<string | null>(null);

  const router = useRouter();

  const getUser = useCallback(async () => {
    setIsLoadingUser(true);
    setErrorUser(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/creds'); 
          return null;
        }
        throw new Error(`Failed to fetch user: ${res.statusText}`);
      }

      const data = await res.json();
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setErrorUser('Failed to load user data.');
      router.push('/creds'); 
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, [router, API_BASE_URL]);

  const fetchMyEvents = useCallback(async (userId: string) => {
    setIsLoadingMyEvents(true);
    setErrorMyEvents(null);
    try {
      const response = await fetch(`${API_BASE_URL}/events/myEvents`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) { 
          setMyEvents([]);
          return;
        }
        throw new Error(`Failed to fetch my events: ${response.statusText}`);
      }

      const data = await response.json();
      setMyEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching my events:', err);
      setErrorMyEvents('Failed to load your events.');
      setMyEvents([]);
    } finally {
      setIsLoadingMyEvents(false);
    }
  }, [API_BASE_URL]);

  const fetchAttendingEvents = useCallback(async (userId: string) => {
    setIsLoadingAttendingEvents(true);
    setErrorAttendingEvents(null);
    try {
      const response = await fetch(`${API_BASE_URL}/events/attending`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) { 
          setAttendingEvents([]);
          return;
        }
        throw new Error(`Failed to fetch attending events: ${response.statusText}`);
      }

      const data = await response.json();
      setAttendingEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching attending events:', err);
      setErrorAttendingEvents('Failed to load events you are attending.');
      setAttendingEvents([]);
    } finally {
      setIsLoadingAttendingEvents(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    const loadProfileData = async () => {
      const currentUser = await getUser();
      if (currentUser && currentUser._id) {
        fetchMyEvents(currentUser._id);
        fetchAttendingEvents(currentUser._id);
      }
    };
    loadProfileData();
  }, [getUser, fetchMyEvents, fetchAttendingEvents]);

  const renderEventList = (events: Event[], isLoading: boolean, error: string | null) => {
    if (isLoading) {
      return <div className="text-gray-600 text-center py-4">Loading events...</div>;
    }
    if (error) {
      return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }
    if (events.length === 0) {
      return <div className="text-gray-500 text-center py-4">No events found.</div>;
    }
    return (
      <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
        {events.map(event => (
          <Link href={`/dashboard/event/${event._id}`} key={event._id}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center space-x-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center text-orange-700 font-bold">
                <CalendarDays size={20} />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-800 text-md truncate">{event.title}</p>
                <p className="text-gray-600 text-sm flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {format(new Date(event.date), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    );
  };


  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 to-pink-300/60 z-10" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/60 z-15" aria-hidden="true"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-4xl h-[85vh] bg-white bg-opacity-70 rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col"
      >
        <div className="absolute top-6 left-6 z-30">
          <button
            onClick={() => router.back()} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center space-x-2 text-gray-600"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          My Profile
        </h1>

        {isLoadingUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-xl">Loading profile...</div>
        ) : errorUser ? (
          <div className="flex-1 flex items-center justify-center text-red-500 text-xl">Error: {errorUser}</div>
        ) : user ? (
          <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar pb-4">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center mb-6 shadow-md">
              <UserIcon size={64} className="text-orange-700 opacity-70" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">{user.name}</h2>
            <p className="text-lg text-gray-600 mb-6">{user.email}</p>


            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  My Created Events
                </h3>
                {renderEventList(myEvents, isLoadingMyEvents, errorMyEvents)}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Events I'm Attending
                </h3>
                {renderEventList(attendingEvents, isLoadingAttendingEvents, errorAttendingEvents)}
              </motion.div>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}