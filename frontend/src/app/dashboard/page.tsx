"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopBar from '@/components/dashboard/TopBar';
import TodayOverview from '@/components/dashboard/TodayOverview';
import CalendarView from '@/components/dashboard/Calendar'; 
import { PlusCircle } from 'lucide-react';
import AddEventForm from '@/components/dashboard/AddEventForm';
import type { User } from '@/types/user.type';
import type { DashboardView } from '@/types/dashboard.type';


import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<DashboardView>('today' as DashboardView);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        router.push('/');
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err: any) {
        router.push('/');
        console.error('Failed to fetch user:', err);
      }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleEventCreated = () => {
    setShowAddEventForm(false);
  };


  const renderActiveView = () => {
    if (activeView === 'today' as DashboardView) {
      return <TodayOverview user={user}/>;
    } else if (activeView === 'calendar') {
      return <CalendarView user={user}/>; 
    }
    return null;
  };

  const toggleView = (view: DashboardView): void => {
    setActiveView(view);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 to-pink-300/60 z-10" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/60 z-15" aria-hidden="true"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-7xl h-[85vh] bg-white bg-opacity-70 rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col overflow-hidden"
      >

        <TopBar onSidebarToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} user={user} toggleView={toggleView} activeView={activeView}/>

        <div className="flex-1 mt-8 overflow-y-auto">
          {renderActiveView()}
        </div>
      </motion.div>

      <button onClick={() => setShowAddEventForm(true)} className="absolute bottom-8 right-8 z-50 w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110">
        <PlusCircle size={32} />
      </button>

      {showAddEventForm && (
        <AddEventForm
          onClose={() => setShowAddEventForm(false)} 
          onEventCreated={handleEventCreated} 
        />
      )}
    </div>
  );
}