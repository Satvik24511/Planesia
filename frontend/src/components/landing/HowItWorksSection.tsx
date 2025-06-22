"use client";

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: 1,
    title: 'Sign Up & Personalize',
    description: 'Create your free Planesia account and tell us your interests to get personalized event recommendations.',
  },
  {
    number: 2,
    title: 'Discover or Create',
    description: 'Browse a curated list of events or effortlessly set up your own event in minutes.',
  },
  {
    number: 3,
    title: 'Connect & Experience',
    description: 'Join events, interact with hosts, purchase tickets, and make lasting memories.',
  },
];

export default function HowItWorksSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const} },
  };

  return (
    <section id="how-it-works" className="py-20 px-8 bg-gradient-to-t from-orange-50/70 to-pink-50/70 relative z-20">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-khmer font-bold text-gray-800 mb-16"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Your Journey to Incredible Events
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 text-white text-3xl font-bold rounded-full flex items-center justify-center mb-6 shadow-md">
                {step.number}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{step.title}</h3>
              <p className="text-gray-600 text-lg">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}