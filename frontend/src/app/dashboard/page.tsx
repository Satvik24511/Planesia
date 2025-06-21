'use client';

import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";

type Event = {
    title: string;
    description: string;
    date: Date;
    owner: User;
    location: string;
    capacity: number;
    ticket_price: number;
    imageUrls: string[];
    contact_info: string;
    tickets_sold: number;
    attendee_list: User[];
}

type User = {
    name: string;
    email: string;
    eventsOwned?: Event[];
    eventsJoined?: Event[];
};

export default function DashboardPage() {
    
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
    } finally {
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
        <h1>Hi {user?.name}</h1>
    </div>
    
  );
}
