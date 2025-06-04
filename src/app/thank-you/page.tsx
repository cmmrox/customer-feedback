'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ThankYouPage() {

  const router = useRouter();
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(() => {
        router.push('/');
      }, 5000);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFB800]">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-white p-6 mb-8 shadow-md">
          <Image
            src="/logo.png"
            alt="Piyasena Super Logo"
            width={140}
            height={140}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Thank you for your feedback!</h1>
        <p className="text-md text-center mb-12 max-w-md">We appreciate your time and hope to see you again soon.</p>
        <div className="mt-8 text-xl font-semibold">Piyasena Super</div>
      </div>
    </div>
  );
} 