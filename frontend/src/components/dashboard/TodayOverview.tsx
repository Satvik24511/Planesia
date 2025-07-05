"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Zap, Moon } from 'lucide-react';
import Image from 'next/image';
import type { User } from '@/types/user.type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY


interface TodayOverviewProps {
  user: User | null;
}

const TodayOverview : React.FC<TodayOverviewProps> = ({user}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [eventsToday, setEventsToday] = useState<EventToday[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [errorWeather, setErrorWeather] = useState<string | null>(null);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);

  const desertImage = '/desert-bg.png';

interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface MainWeatherData {
    temp: number;
    [key: string]: any;
}

interface SysData {
    sunrise: number;
    sunset: number;
    [key: string]: any;
}

interface WeatherData {
    dt: number;
    sys: SysData;
    main: MainWeatherData;
    weather: Weather[];
    [key: string]: any;
}

interface EventToday {
    _id: string;
    title: string;
    date: string;
    [key: string]: any;
}

const getWeatherIcon = (iconCode: string, isDayTime: boolean): React.ElementType => {
    switch (iconCode) {
        case '01d':
        case '01n':
            return isDayTime ? Sun : Moon;
        case '02d':
        case '02n':
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            return Cloud;
        case '09d':
        case '09n':
        case '10d':
        case '10n':
            return CloudRain;
        case '11d':
        case '11n':
            return Zap;
        case '13d':
        case '13n':
            return CloudSnow;
        case '50d':
        case '50n':
            return Wind;
        default:
            return Cloud;
    }
};

  useEffect(() => {
    interface FetchWeatherResponse {
      dt: number;
      sys: SysData;
      main: MainWeatherData;
      weather: Weather[];
      [key: string]: any;
    }

    const fetchWeather = async (lat: number, lon: number): Promise<void> => {
      setIsLoadingWeather(true);
      setErrorWeather(null);
      try {
        const response: Response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }
        const data: FetchWeatherResponse = await response.json();
        setWeatherData(data);
      } catch (err: any) {
        console.error('Failed to fetch weather:', err);
        setErrorWeather('Failed to load weather data. Please try again.');
      } finally {
        setIsLoadingWeather(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation failed:', err);
          setErrorWeather('Geolocation denied or failed. Cannot fetch local weather.');
          setIsLoadingWeather(false);
          fetchWeather(28.7041, 77.1025);
        }
      );
    } else {
      setErrorWeather('Geolocation not supported by your browser.');
      setIsLoadingWeather(false);
      fetchWeather(28.7041, 77.1025);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      setErrorEvents(null);
      try {
        const response = await fetch(`${API_BASE_URL}/events/today`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Events API error: ${response.statusText}`);
        }
        const data = await response.json();
        setEventsToday(data.events);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setErrorEvents(
          err instanceof Error ? err.message : 'Failed to load events. Please try again.'
        );
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const isDayTime = !!weatherData && weatherData.dt > weatherData.sys.sunrise && weatherData.dt < weatherData.sys.sunset ? true : false;
  const WeatherIconComponent = weatherData ? getWeatherIcon(weatherData.weather[0].icon, isDayTime) : Cloud;

  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-8">
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 bg-white bg-opacity-70 rounded-2xl shadow-md">
        <div>
          <h2 className="text-lg text-gray-500 font-semibold uppercase mb-2">TODAY</h2>
          <p className="text-gray-700 text-5xl sm:text-6xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {format(currentDate, 'EEEE')}
          </p>
          <p className="text-gray-700 text-8xl sm:text-9xl font-bold mb-2 leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
            {format(currentDate, 'dd')}
          </p>
          <p className="text-gray-700 text-4xl sm:text-5xl font-medium mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
            {format(currentDate, 'MMM yyyy').toUpperCase()}
          </p>
        </div>

        <div>
          <h3 className="text-lg text-gray-500 font-semibold uppercase mb-4">EVENTS</h3>
          {isLoadingEvents ? (
            <div className="text-gray-600 text-xl">Loading events...</div>
          ) : errorEvents ? (
            <div className="text-red-500 text-xl">Error: {errorEvents}</div>
          ) : eventsToday.length === 0 ? (
            <div className="flex items-center space-x-3 text-gray-600 text-xl">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span>No events today</span>
            </div>
          ) : (
            <div className="space-y-4">
              {eventsToday.map(event => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-r from-orange-100 to-pink-100 p-4 rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-800 text-xl font-semibold">{event.title}</p>
                      <p className="text-gray-600 text-sm">{format(new Date(event.date), 'hh:mm a')}</p>
                    </div>
                  </div>
                  <span className="text-orange-500 font-medium text-sm"><a href={`/dashboard/event/${event._id}`}>View Details</a></span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-gradient-to-br from-orange-200 to-pink-200 rounded-2xl shadow-md flex flex-col justify-end items-center p-6 overflow-hidden lg:h-auto h-64">
        <div className="absolute top-20 right-17 flex items-start space-x-3 py-2 px-4 z-10 scale-150">
          {isLoadingWeather ? (
            <span className="text-gray-700 text-xl">Loading...</span>
          ) : errorWeather ? (
            <span className="text-red-600 text-xl">{errorWeather}</span>
          ) : weatherData ? (
            <>
              <WeatherIconComponent size={80} className="text-white drop-shadow-lg" />
              <div>
                <p className="text-white text-5xl font-bold leading-none drop-shadow-lg">{Math.round(weatherData.main.temp)}°c</p>
                <p className="text-white text-lg font-medium drop-shadow-lg">{weatherData.weather[0].description}</p>
              </div>
            </>
          ) : (
            <span className="text-gray-700 text-xl">No weather data</span>
          )}
        </div>

        <Image
          src={desertImage}
          alt="Planesia Desert Landscape"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 rounded-2xl z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-orange-300/40 to-transparent z-10 rounded-2xl"></div>
      </div>
    </div>
  );
}

export default TodayOverview;