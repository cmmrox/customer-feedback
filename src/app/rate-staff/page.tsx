'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import React from 'react';

interface StaffMember {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
}

function StaffShimmer() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 w-full min-h-[110px] animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex flex-col items-start flex-grow gap-2">
        <div className="w-32 h-5 bg-gray-200 rounded" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function RateStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [feedbackId] = useState(() => uuidv4());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submittingStaffId, setSubmittingStaffId] = useState<string | null>(null);
  const router = useRouter();
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch staff members
        const staffResponse = await fetch('/api/staff');
        if (!staffResponse.ok) throw new Error('Failed to fetch staff');
        const staffData = await staffResponse.json();
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  
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

  const handleStaffSelect = async (staffId: string) => {
    if (submittingStaffId) return; // Prevent double submit
    setSubmittingStaffId(staffId);
    setSelectedStaff(staffId);
    try {
      const response = await fetch('/api/feedback-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackId,
          staffId
        }),
      });

      if (!response.ok) throw new Error('Failed to submit staff selection');
      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting staff selection:', error);
      setSubmittingStaffId(null); // Allow retry
    }
  };

  return (
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center p-0">
      <div className="w-full max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-1">Please rate our service staff</h1>
        <p className="text-md text-center mb-8">Tap a face to rate the team members you interacted with</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => <StaffShimmer key={idx} />)
            : staff.map((staffMember) => (
                <button
                  key={staffMember.id}
                  className={`bg-white rounded-xl shadow-md p-6 flex items-center gap-4 w-full transition-transform min-h-[110px] ${selectedStaff === staffMember.id ? 'scale-105 ring-2 ring-yellow-500' : ''} ${!!submittingStaffId ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={() => handleStaffSelect(staffMember.id)}
                  disabled={!!submittingStaffId}
                >
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={staffMember.imageUrl || '/placeholder-staff.png'}
                      alt={staffMember.name}
                      fill
                      className="rounded-full object-cover border border-gray-200"
                    />
                    {submittingStaffId === staffMember.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-full">
                        <svg className="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start flex-grow">
                    <span className="font-bold text-lg mb-1">{staffMember.name}</span>
                    <span className="flex items-center text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 01-8 0M12 14v7m-7-7a7 7 0 0114 0v7H5v-7z" /></svg>
                      {staffMember.position || 'Cashier'}
                    </span>
                  </div>
                </button>
              ))}
        </div>
      </div>
    </div>
  );
} 