// src/components/dashboard/EventDetails.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, IndianRupee, Users, Clock, Mail, Info, Phone, ExternalLink, User as UserIcon } from 'lucide-react';
import type { User } from '@/types/user.type'; 


interface EventData {
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
  attendee_list: string[] | User[]; 
  createdAt: string;
  updatedAt: string;
}

interface EventDetailsProps {
  event: EventData;
  currentUser: User | null; 
  onEventUpdated: () => void; 
}

export default function EventDetails({ event: initialEvent, currentUser, onEventUpdated }: EventDetailsProps) {
  const [event, setEvent] = useState<EventData>(initialEvent); 
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  const eventDateTime = new Date(event.date);
  const formattedDate = eventDateTime.toLocaleDateString('en-IN', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDateTime.toLocaleTimeString('en-IN', { 
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const isOwner = currentUser && event.owner?._id === currentUser._id;
  const isAttending = currentUser && event.attendee_list.some(attendee => 
    (typeof attendee === 'string' ? attendee : attendee._id) === currentUser._id
  );
  const isEventFull = event.tickets_sold >= event.capacity;

  const handleJoinLeave = async () => {
    if (!currentUser) {
      setActionMessage('Please log in to join or leave events.');
      setMessageType('error');
      return;
    }

    setLoadingAction(true);
    setActionMessage(null);
    setMessageType(null);

    const action = isAttending ? 'leave' : 'join';
    const endpoint = `/api/events/${action}/${event._id}`;
    const method = action === 'join' ? 'POST' : 'POST'; 
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setActionMessage(data.message);
        setMessageType('success');
        onEventUpdated(); 
      } else {
        setActionMessage(data.message || `Failed to ${action} event.`);
        setMessageType('error');
      }
    } catch (err: any) {
      console.error(`Error ${action}ing event:`, err);
      setActionMessage('Network error or server unavailable.');
      setMessageType('error');
    } finally {
      setLoadingAction(false);
      setTimeout(() => setActionMessage(null), 3000); 
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.6 }}
      className="relative z-20 w-full max-w-4xl bg-white bg-opacity-85 rounded-3xl shadow-xl p-6 sm:p-8 overflow-hidden backdrop-blur-md border border-white/50"
    >

      {event.imageUrls && event.imageUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg group" 
        >
          <img
            src={event.imageUrls[0]}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <h1 className="absolute bottom-6 left-6 text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold drop-shadow-lg leading-tight">
            {event.title}
          </h1>
          {isOwner && (
            <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Your Event
            </span>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 text-lg leading-relaxed mb-6 font-light"
          >
            {event.description}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="space-y-4 mb-8 p-4 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-xl shadow-inner"
          >
            <motion.div variants={cardVariants} className="flex items-center text-gray-800 font-medium">
              <Calendar size={20} className="text-orange-600 mr-3 flex-shrink-0" />
              <span><span className="font-semibold">Date:</span> {formattedDate}</span>
            </motion.div>
            <motion.div variants={cardVariants} className="flex items-center text-gray-800 font-medium">
              <Clock size={20} className="text-pink-600 mr-3 flex-shrink-0" />
              <span><span className="font-semibold">Time:</span> {formattedTime}</span>
            </motion.div>
            <motion.div variants={cardVariants} className="flex items-start text-gray-800 font-medium">
              <MapPin size={20} className="text-orange-600 mr-3 flex-shrink-0 mt-1" />
              <span><span className="font-semibold">Location:</span> {event.location}</span>
            </motion.div>
            <motion.div variants={cardVariants} className="flex items-center text-gray-800 font-medium">
              <Users size={20} className="text-pink-600 mr-3 flex-shrink-0" />
              <span><span className="font-semibold">Attendees:</span> {event.tickets_sold} / {event.capacity}</span>
            </motion.div>
          </motion.div>

          {event.imageUrls && event.imageUrls.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Event Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.imageUrls.slice(1).map((url, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover="hover"
                    className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm cursor-pointer border border-gray-200"
                  >
                    <img src={url} alt={`${event.title} image ${index + 2}`} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ExternalLink size={24} className="text-white"/>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {event.attendee_list && event.attendee_list.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Attendees</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {event.attendee_list.slice(0,10).map((attendee, index) => (
                  <motion.div
                    key={index} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.05 }}
                    className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm"
                  >
                    <UserIcon size={16} className="mr-1" />
                    {typeof attendee === 'string' ? `User ${attendee.substring(0, 4)}...` : attendee.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}        
        </div>

        <div className="md:col-span-1 bg-gradient-to-br from-pink-200/95 to-orange-200/95 rounded-2xl p-6 shadow-xl border border-orange-200 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-700 mb-6 text-center border-b-2 border-orange-300 pb-3">Event Info</h3>

            <div className="space-y-5">
              <motion.div
                variants={cardVariants}
                className="flex items-center text-gray-800 bg-orange-50 p-3 rounded-lg shadow-sm"
              >
                <IndianRupee size={22} className="text-orange-600 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-bold text-lg">Price:</span>{' '}
                  <span className="text-lg">{event.ticket_price === 0 ? 'Free' : `₹${event.ticket_price.toFixed(2)}`}</span>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="flex items-start text-gray-800 bg-pink-50 p-3 rounded-lg shadow-sm"
              >
                <Info size={22} className="text-pink-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-lg block mb-1">Organizer:</span>
                  <span className="text-md font-medium">{event.owner?.name || 'N/A'}</span>
                  {event.owner?.email && (
                    <a href={`mailto:${event.owner.email}`} className="flex items-center text-sm text-blue-600 hover:underline mt-1">
                      <Mail size={16} className="mr-1" /> {event.owner.email}
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="flex items-start text-gray-800 bg-orange-50 p-3 rounded-lg shadow-sm"
              >
                <Phone size={22} className="text-orange-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-lg block mb-1">Contact:</span>
                  {event.contact_info.startsWith('http://') || event.contact_info.startsWith('https://') ? (
                    <a href={event.contact_info} target="_blank" rel="noopener noreferrer" className="flex items-center text-md text-blue-600 hover:underline">
                      <ExternalLink size={18} className="mr-1" /> {event.contact_info}
                    </a>
                  ) : (
                    <span className="text-md">{event.contact_info}</span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            {actionMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center text-sm mb-3 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}
              >
                {actionMessage}
              </motion.p>
            )}
            {isOwner ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-400 text-white font-bold py-3 rounded-xl text-lg shadow-md cursor-not-allowed"
                disabled
              >
                You own this event
              </motion.button>
            ) : isAttending ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinLeave}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingAction}
              >
                {loadingAction ? 'Leaving...' : 'Leave Event'}
              </motion.button>
            ) : isEventFull ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-400 text-white font-bold py-3 rounded-xl text-lg shadow-md cursor-not-allowed"
                disabled
              >
                Event Full
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinLeave}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingAction}
              >
                {loadingAction ? 'Joining...' : 'Join Event'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}