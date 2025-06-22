"use client"; 

import React, { useState } from "react";
import SignInPage from "@/components/SignInPage";
import SignUpPage from "@/components/SignUpPage";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Creds() {
  const [isSignIn, setIsSignIn] = useState(true);

  const switchToSignUp = () => {
    setIsSignIn(false);
  };

  const switchToSignIn = () => {
    setIsSignIn(true);
  };

  const mainBackgroundImage = '/planesiaBG.png'; 

  const planesiaTextBackgroundImage = '/image.svg';

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${mainBackgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '30% 50%', 
          backgroundSize: '235%',
        }}
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 to-pink-300/60 z-10" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/60 z-15" aria-hidden="true"></div>
      
      <div className="relative z-20 flex w-full max-w-7xl h-[750px] items-center justify-center">
        <div className="relative flex-1 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-16 text-center">

          <Image
            src={planesiaTextBackgroundImage}
            alt="Decorative background element for Planesia text"
            width={600}
            height={200}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[67%] z-10 scale-150"
            priority
          />
          

          <h1
            className="text-gray-700 text-7xl sm:text-8xl md:text-8xl lg:text-[140px] font-khmer font-normal leading-tight tracking-normal text-center relative z-10"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Planesia
          </h1>
          
          <p
            className="text-black text-3xl sm:text-4xl lg:text-[50px] font-italiano font-normal leading-tight tracking-normal text-center relative z-10"
            style={{ fontFamily: 'Italianno, cursive' }}
          >
            where events take flight
          </p>

          
        </div>

        <div className="flex-1 flex items-center justify-center h-full px-6 sm:px-8 lg:px-16">
          <AnimatePresence mode="wait" initial={false}>
            {isSignIn ? (
              <SignInPage onSwitchToSignUp={switchToSignUp} />
            ) : (
              <SignUpPage onSwitchToSignIn={switchToSignIn} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
