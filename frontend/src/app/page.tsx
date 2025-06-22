"use client";

import React from 'react';
import NavBar from '@/components/NavBar'; 
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CallToActionSection from '@/components/landing/CallToActionSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const mainBackgroundImage = '/planesiaBG.png'; 
  const planesiaTextBackgroundImage = '/newPlanesia.png';

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${mainBackgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '30% 40%',
          backgroundSize: '250%',
        }}
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 to-pink-300/60 z-10" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/60 z-15" aria-hidden="true"></div>
      
      <div className="relative z-20">
        <NavBar /> 

        <main>
          <HeroSection planesiaTextBackgroundImage={planesiaTextBackgroundImage} />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CallToActionSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}