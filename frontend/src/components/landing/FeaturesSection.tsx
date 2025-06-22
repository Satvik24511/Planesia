"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, MapPin, TicketCheck, Users } from 'lucide-react';

const featureItems = [
  {
    icon: CalendarCheck,
    title: 'Effortless Event Management',
    description: 'Create, manage, and promote your events with intuitive tools and a streamlined interface.',
  },
  {
    icon: MapPin,
    title: 'Discover Local Experiences',
    description: 'Explore a diverse range of events happening near you, tailored to your interests.',
  },
  {
    icon: TicketCheck,
    title: 'Seamless Ticketing',
    description: 'Handle registrations and ticket sales effortlessly, with built-in tracking and attendee lists.',
  },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const} },
  };

  return (
    <section id="features" className="py-20 px-8 bg-white bg-opacity-80 rounded-t-[50px] shadow-inner -mt-16 relative z-30">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-khmer font-bold text-gray-800 mb-16"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Unlock a World of Events
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform duration-300">
                <feature.icon size={40} strokeWidth={2} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}