"use client";

import React, { useState } from "react";
import SignInPage from "@/components/SignInPage";
import SignUpPage from "@/components/SignUpPage";
import { AnimatePresence } from "framer-motion";

export default function App() {
  const [isSignIn, setIsSignIn] = useState(true);

  const switchToSignUp = () => {
    setIsSignIn(false);
  };

  const switchToSignIn = () => {
    setIsSignIn(true);
  };

  return (
    <AnimatePresence mode="wait">
      {isSignIn ? (
        <SignInPage onSwitchToSignUp={switchToSignUp} />
      ) : (
        <SignUpPage onSwitchToSignIn={switchToSignIn} />
      )}
    </AnimatePresence>
  );
}
