"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Info, IndianRupee, Users, Image as ImageIcon, Phone, Clock } from 'lucide-react';

interface AddEventFormProps {
  onClose: () => void;
  onEventCreated: () => void; 
} 

export default function AddEventForm({ onClose, onEventCreated }: AddEventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '', 
    eventTime: '', 
    location: '',
    capacity: '',
    ticket_price: '',
    imageUrls: [''], 
    contact_info: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageUrlInput = () => {
    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const removeImageUrlInput = (index: number) => {
    const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const filteredImageUrls = formData.imageUrls.filter(url => url.trim() !== '');

    const combinedDateTime = formData.eventDate && formData.eventTime
      ? new Date(`${formData.eventDate}T${formData.eventTime}`).toISOString()
      : '';

    const payload = {
      title: formData.title,
      description: formData.description,
      date: combinedDateTime,
      location: formData.location,
      capacity: parseInt(formData.capacity, 10),
      ticket_price: parseFloat(formData.ticket_price), 
      imageUrls: filteredImageUrls.length > 0 ? filteredImageUrls : [''], 
      contact_info: formData.contact_info,
    };

    if (!payload.title || !payload.date || !payload.location || isNaN(payload.capacity) || isNaN(payload.ticket_price) || !payload.contact_info) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Event created successfully!');
        setFormData({ title: '', description: '', eventDate: '', eventTime: '', location: '', ticket_price: '', capacity: '', imageUrls: [''], contact_info: '' });
        onEventCreated(); 
        setTimeout(onClose, 1500); 
      } else {
        setError(data.message || 'Failed to create event. Please try again.');
      }
    } catch (err: any) {
      console.error('Event creation error:', err);
      setError('Network error or server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:outline-none text-gray-800 bg-white/80";
  const labelClasses = "block text-gray-700 text-sm font-medium mb-1";
  const buttonBaseClasses = "py-2 px-4 rounded-lg transition-all duration-200";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-amber-100 bg-opacity-50 z-[10000] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Event</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className={labelClasses}>Event Title *</label>
              <div className="relative">
                <Info size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  placeholder="e.g., Summer Music Festival"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClasses}>Description *</label>
              <div className="relative">
                <Info size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClasses} pt-3 pb-2`}
                  required
                  placeholder="Tell us about your event..."
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDate" className={labelClasses}>Date *</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="eventTime" className={labelClasses}>Time *</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    id="eventTime"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className={labelClasses}>Location *</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  placeholder="e.g., Central Park, NYC"
                />
              </div>
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ticket_price" className={labelClasses}>Ticket Price *</label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    id="ticket_price"
                    name="ticket_price"
                    value={formData.ticket_price}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="capacity" className={labelClasses}>Capacity *</label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="e.g., 100"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Image URLs */}
            <div>
              <label className={labelClasses}>Image URLs (at least one) *</label>
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative mb-2 flex items-center">
                  <ImageIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url" 
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    className={inputClasses}
                    placeholder={`Image URL ${index + 1}`}
                    required={index === 0} 
                  />
                  {formData.imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrlInput(index)}
                      className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100"
                      aria-label={`Remove image URL ${index + 1}`}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageUrlInput}
                className={`${buttonBaseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300 mt-2`}
              >
                Add another Image URL
              </button>
            </div>

            {/* Contact Info */}
            <div>
              <label htmlFor="contact_info" className={labelClasses}>Contact Information *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="contact_info"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  placeholder="e.g., email@example.com or +1234567890"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-center mt-4 text-sm">{success}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-4 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}