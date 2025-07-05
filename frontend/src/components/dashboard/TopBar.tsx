"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, Search, X, User as UserIcon, Settings, LogOut, CalendarDays, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useRouter } from 'next/navigation';
import type { User } from '@/types/user.type';
import type { DashboardView } from '@/types/dashboard.type';

type Event = {
    _id: string;
    title: string;
    description: string;
    date: string;
    owner: User;
    location: string;
    capacity: number;
    ticket_price: number;
    imageUrls: string[];
    contact_info: string;
    tickets_sold: number;
    attendee_list: User[];
}


export interface TopBarProps {
  onSidebarToggle: (open: boolean) => void;
  isSidebarOpen: boolean;
  user: User | null;
  activeView: DashboardView; 
  toggleView: (view: DashboardView) => void; 
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function TopBar({ user, onSidebarToggle, isSidebarOpen, activeView, toggleView }: TopBarProps) { 

  const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const fetchAllUserEvents = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/allEvents`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                  router.push('/creds');
                  console.error('Authentication error: Token invalid or expired.');
                }
                throw new Error(`Failed to fetch all events: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success && Array.isArray(data.events)) {
                setAllEvents(data.events);
            } else {
                setAllEvents([]);
            }
        } catch (error) {
            console.error('Error fetching all events:', error);
            setAllEvents([]);
        }
    }, [router]); 

    useEffect(() => {
        fetchAllUserEvents();
    }, [fetchAllUserEvents]);


    useEffect(() => {
        if (!searchQuery) {
            setFilteredEvents([]);
            setIsSearchActive(false);
            return;
        }

        const handler = setTimeout(() => {
            const lowercasedQuery = searchQuery.toLowerCase();
            const results = allEvents.filter(event =>
                event.title.toLowerCase().includes(lowercasedQuery) ||
                event.description.toLowerCase().includes(lowercasedQuery) ||
                event.location.toLowerCase().includes(lowercasedQuery) ||
                (event.owner && event.owner.name.toLowerCase().includes(lowercasedQuery))
            );
            setFilteredEvents(results);
            setIsSearchActive(results.length > 0 || searchQuery.length > 0); 
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, allEvents]);

    useEffect(() => {
        const handleClickOutsideSearch = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideSearch);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearch);
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideSidebar = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isSidebarOpen) {
                onSidebarToggle(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutsideSidebar);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideSidebar);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSidebar);
        };
    }, [isSidebarOpen, onSidebarToggle]);


    return (
        <div className="flex items-center justify-between mb-4 relative z-40">
            <button
                onClick={() => onSidebarToggle(!isSidebarOpen)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Toggle sidebar"
            >
                <Menu size={28} className="text-gray-600" />
            </button>

            <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
                <input
                    type="text"
                    placeholder="Search events"
                    className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchActive(true)} 
                    onBlur={() => setTimeout(() => !searchRef.current?.contains(document.activeElement) && setIsSearchActive(false), 100)}
                />
                <Search size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <AnimatePresence>
                    {isSearchActive && searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"
                        >
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <Link
                                        href={`/dashboard/event/${event._id}`}
                                        key={event._id}
                                        className="flex items-center p-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200"
                                        onClick={() => {
                                            setIsSearchActive(false);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center mr-3">
                                            <span className="text-orange-700 font-bold text-sm">{event.title.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-base">{event.title}</p>
                                            <p className="text-gray-600 text-sm">{event.location}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-4 text-gray-500 text-center">No events found for "{searchQuery}"</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold">
                    {user ? user.name.charAt(0).toUpperCase() : <UserIcon size={24} />}
            </div>

            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => onSidebarToggle(false)}
                        />

                        <motion.div
                            ref={sidebarRef}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>Planesia</h2>
                                <button
                                    onClick={() => onSidebarToggle(false)}
                                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                    aria-label="Close sidebar"
                                >
                                    <X size={28} className="text-gray-600" />
                                </button>
                            </div>

                            <nav className="flex flex-col space-y-4 flex-1">
                                <button 
                                    onClick={() => { toggleView('today' as DashboardView); onSidebarToggle(false); }}
                                    className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-orange-100 transition-colors w-full text-left
                                    ${activeView === 'today' as DashboardView ? 'bg-orange-100 text-orange-700 font-semibold' : ''}`}
                                >
                                    <LayoutDashboard size={20} />
                                    <span className="font-medium">Dashboard</span>
                                </button>
                                <button 
                                    onClick={() => { toggleView('calendar'); onSidebarToggle(false); }}
                                    className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-orange-100 transition-colors w-full text-left
                                    ${activeView === 'calendar' ? 'bg-orange-100 text-orange-700 font-semibold' : ''}`}
                                >
                                    <CalendarDays size={20} />
                                    <span className="font-medium">Calendar</span>
                                </button>
                                <Link href="/profile" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-orange-100 transition-colors" onClick={() => onSidebarToggle(false)}>
                                    <UserIcon size={20} />
                                    <span className="font-medium">Profile</span>
                                </Link>
                            </nav>

                            <div className="mt-auto pt-6 border-t border-gray-200">
                                <button className="flex items-center space-x-3 p-3 w-full rounded-lg text-red-600 hover:bg-red-100 transition-colors" onClick={() => {
                                    fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
                                    router.push('/creds');
                                    onSidebarToggle(false);
                                }}>
                                    <LogOut size={20} />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}