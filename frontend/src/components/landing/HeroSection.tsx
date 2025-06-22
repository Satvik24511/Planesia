"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
  planesiaTextBackgroundImage: string;
}

export default function HeroSection({ planesiaTextBackgroundImage }: HeroSectionProps) {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <section className="relative h-[calc(100vh-6rem)] flex items-center justify-center text-center p-8 overflow-hidden">
      <Image
        src={planesiaTextBackgroundImage}
        alt="Decorative background element for Planesia text"
        width={800}
        height={300}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-[60%] z-20 scale-125 md:scale-100 opacity-60 pointer-events-none"
        priority
      />

      <div className="relative z-20 max-w-4xl mx-auto">
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-gray-700 text-6xl md:text-7xl lg:text-[100px] font-normal leading-tight tracking-normal"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Planesia
        </motion.h1>

        <motion.p
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...textVariants.visible.transition, delay: 0.2 }}
          className="text-black text-3xl md:text-4xl lg:text-[45px] font-normal leading-tight tracking-normal mt-4 mb-10"
          style={{ fontFamily: 'Italianno, cursive' }}
        >
          where events take flight
        </motion.p>

        <motion.p
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...textVariants.visible.transition, delay: 0.4 }}
          className="text-gray-600 text-xl md:text-2xl max-w-2xl mx-auto mb-12"
        >
          Seamlessly organize, discover, and join unforgettable events. From intimate gatherings to grand celebrations, your journey begins here.
        </motion.p>

        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <Link href="/creds" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-block">
            Start Your Event Journey
          </Link>
        </motion.div>
      </div>
    </section>
  );
}