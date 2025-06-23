"use client";

import React from 'react';
import { Menu, Search } from 'lucide-react';

interface TopBarProps {
  onToggleView: (view: string) => void;
  activeView: string;
}

export default function TopBar({ onToggleView, activeView }: TopBarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => onToggleView(activeView === 'today' ? 'calendar' : 'today')}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        <Menu size={28} className="text-gray-600" />
      </button>
      <div className="flex-1 max-w-md mx-4 relative">
        <input
          type="text"
          placeholder="Search events"
          className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg"
        />
        <Search size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <button className="p-2 rounded-full hover:bg-gray-200 transition-colors hidden sm:block">
        <Search size={28} className="text-gray-600" />
      </button>
    </div>
  );
}