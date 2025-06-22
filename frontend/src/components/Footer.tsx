import React from 'react';

import Link from 'next/link';

import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer
        className="bg-gray-800 text-white py-12"
      >
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h3
            className="text-2xl font-bold mb-6"
          >
            Connect with the Developer
          </h3>
          <div
            className="flex justify-center space-x-6 mb-8"
          >
            <a
              href="https://github.com/Satvik24511" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="GitHub Profile"
            >
              <Github className="w-8 h-8" />
            </a>
            <a
              href="https://www.linkedin.com/in/stvkmittal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-8 h-8" />
            </a>
          </div>
        </div>
      </footer>
  );
}