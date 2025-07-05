"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'; 
import Link from 'next/link'; 
import type { User } from '@/types/user.type'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CalendarEvent {
  _id: string;
  title: string;
  date: string; 
  location?: string;
}

interface CalendarViewProps {
  user: User | null; 
}

const CalendarView: React.FC<CalendarViewProps> = ({ user }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CalendarEvent[]>([]);
  const [eventsForMonth, setEventsForMonth] = useState<CalendarEvent[]>([]); 
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);

  const generateCalendarDays = useCallback(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const firstDay = new Date(start.setDate(start.getDate() - start.getDay())); 

    const lastDay = new Date(end.setDate(end.getDate() + (6 - end.getDay())));

    return eachDayOfInterval({ start: firstDay, end: lastDay });
  }, [currentMonth]);

  const days = generateCalendarDays();

  const hasEventsOnDay = useCallback((date: Date): boolean => {
    return eventsForMonth.some(event => isSameDay(new Date(event.date), date));
  }, [eventsForMonth]);

  const fetchEventsForDate = useCallback(async (date: Date) => {
    setIsLoadingEvents(true);
    setErrorEvents(null);
    try {
      const year = format(date, 'yyyy');
      const month = format(date, 'MM');
      const day = format(date, 'dd');
      const response = await fetch(`${API_BASE_URL}/events/day/${year}/${month}/${day}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setEventsForSelectedDate([]); 
          return;
        }
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      setEventsForSelectedDate(data.events || []); 
    } catch (err) {
      console.error('Error fetching events for date:', err);
      setErrorEvents('Failed to load events for this date.');
      setEventsForSelectedDate([]);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [API_BASE_URL]); 

  const fetchEventsForMonth = useCallback(async (monthDate: Date) => {
    try {
      const year = format(monthDate, 'yyyy');
      const month = format(monthDate, 'MM');
      const response = await fetch(`${API_BASE_URL}/events/month/${year}/${month}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setEventsForMonth([]);
          return;
        }
        throw new Error(`Failed to fetch month events: ${response.statusText}`);
      }

      const data = await response.json();
      setEventsForMonth(data.events || []);
    } catch (err) {
      console.error('Error fetching events for month:', err);
      setEventsForMonth([]); 
    }
  }, [API_BASE_URL]); 

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    fetchEventsForDate(today);
    fetchEventsForMonth(today); 
  }, [fetchEventsForDate, fetchEventsForMonth]);

  useEffect(() => {
    fetchEventsForMonth(currentMonth);
    if (selectedDate && !isSameMonth(selectedDate, currentMonth)) {
      setSelectedDate(null);
      setEventsForSelectedDate([]);
    }
  }, [currentMonth, fetchEventsForMonth, selectedDate]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    fetchEventsForDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full"> 
        <div className="flex-[2] pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 mb-6 lg:mb-0">
          <div className="flex justify-between items-center mb-6">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                {format(currentMonth, 'MMM').toUpperCase()}
              </h2>
              <span className="text-2xl font-bold text-gray-600" style={{ fontFamily: 'Playfair Display, serif' }}>
                {format(currentMonth, 'yyyy')}
              </span>
            </div>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-500 uppercase mb-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const hasEvents = hasEventsOnDay(day);

              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative p-2 rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center text-lg lg:text-xl font-medium
                    ${!isCurrentMonth ? 'text-gray-400 opacity-60 cursor-not-allowed' : 'text-gray-700'}
                    ${isSelected ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-gray-100'}
                    ${isTodayDate && !isSelected ? 'border-2 border-orange-400' : ''}
                    ${hasEvents && !isSelected ? 'after:content-[""] after:absolute after:bottom-1 after:w-1.5 after:h-1.5 after:bg-pink-500 after:rounded-full' : ''}
                    transition-all duration-200
                  `}
                  disabled={!isCurrentMonth} 
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 pt-6 lg:pt-0 lg:pl-8 flex flex-col">
          <h3 className="text-lg text-gray-500 font-semibold uppercase mb-4">
            EVENTS ON {selectedDate ? format(selectedDate, 'dd MMM').toUpperCase() : 'SELECTED DATE'}
          </h3>

          {isLoadingEvents ? (
            <div className="text-gray-600 text-xl flex-grow flex items-center justify-center">Loading events...</div>
          ) : errorEvents ? (
            <div className="text-red-500 text-xl flex-grow flex items-center justify-center">Error: {errorEvents}</div>
          ) : eventsForSelectedDate.length === 0 ? (
            <div className="flex items-center space-x-3 text-gray-600 text-xl flex-grow justify-center">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span>No events on this day</span>
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100%-100px)] overflow-y-auto pr-2 custom-scrollbar flex-grow"> 
              {eventsForSelectedDate.map(event => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-r from-orange-100 to-pink-100 p-4 rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-800 text-xl font-semibold">{event.title}</p>
                      <p className="text-gray-600 text-sm">{format(new Date(event.date), 'hh:mm a')}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/event/${event._id}`} className="text-orange-500 font-medium text-sm">
                    View Details
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default CalendarView;