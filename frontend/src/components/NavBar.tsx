"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NavBar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-30 w-full p-6 flex justify-between items-center text-gray-800"
    >
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Planesia</span>
      </Link>

      <div className="space-x-8">
        <Link href="/#features" className="hover:text-pink-600 transition-colors duration-300">Features</Link>
        <Link href="/#how-it-works" className="hover:text-pink-600 transition-colors duration-300">How it Works</Link>
        <Link href="/#testimonials" className="hover:text-pink-600 transition-colors duration-300">Testimonials</Link>
        <Link href="/creds" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg">
          Sign In
        </Link>
      </div>
    </motion.nav>
  );
}