"use client";

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Planesia transformed how I find and attend local events. Its so easy to use and beautifully designed!",
    author: "Aisha Khan",
    title: "Event Enthusiast",
  },
  {
    quote: "Hosting my art exhibition was a breeze with Planesia. The ticketing system and attendee management saved me so much time.",
    author: "Rohan Sharma",
    title: "Artist & Host",
  },
  {
    quote: "I love the personalized recommendations! I've discovered so many unique experiences I wouldn't have found otherwise.",
    author: "Priya Singh",
    title: "Community Member",
  },
];

export default function TestimonialsSection() {
  const quoteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const} },
  };

  return (
    <section id="testimonials" className="py-20 px-8 bg-white bg-opacity-70 relative z-20">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-khmer font-bold text-gray-800 mb-16"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          What Our Users Say
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={quoteVariants}
              className="bg-gradient-to-br from-orange-100 to-pink-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <p className="text-gray-700 text-lg italic mb-6">"{testimonial.quote}"</p>
              <p className="font-semibold text-gray-800 text-xl mb-1">{testimonial.author}</p>
              <p className="text-gray-500 text-sm">{testimonial.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}