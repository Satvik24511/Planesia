"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CallToActionSection() {
  return (
    <section className="py-24 px-8 bg-gradient-to-t from-white/90 to-orange-100/70 relative z-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-khmer font-bold text-gray-800 mb-8"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Ready to Elevate Your Events?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-2xl mb-12"
        >
          Join Plenesia today and discover a new way to experience events.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/creds" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-full text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-block">
            Get Started Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}