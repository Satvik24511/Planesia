"use client";

import React from 'react';
import { motion } from 'framer-motion';

type User = {
    _id: string; 
    name: string;
    email: string;
};

interface CalendarProps {
  user: User | null;
}

const Calendar: React.FC<CalendarProps> = ({user})  => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 items-center justify-center bg-white bg-opacity-70 rounded-2xl shadow-md p-8"
    >
      <h2 className="text-3xl font-semibold text-gray-700" style={{ fontFamily: 'Playfair Display, serif' }}>
        Your Calendar Will Go Here
      </h2>
      <p className="text-gray-500 mt-4">
        This is where you'll integrate your full calendar component, displaying monthly or weekly event views.
      </p>
    </motion.div>
  );
}

export default Calendar;