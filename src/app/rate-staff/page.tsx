'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface StaffMember {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
}

export default function RateStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [feedbackId] = useState(() => uuidv4());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch staff members
        const staffResponse = await fetch('/api/staff');
        if (!staffResponse.ok) throw new Error('Failed to fetch staff');
        const staffData = await staffResponse.json();
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleStaffSelect = async (staffId: string) => {
    try {
      setSelectedStaff(staffId);
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
      // Optionally handle success (e.g., show thank you message)
    } catch (error) {
      console.error('Error submitting staff selection:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center p-0">
      <div className="w-full max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-1">Please rate our service staff</h1>
        <p className="text-md text-center mb-8">Tap a face to rate the team members you interacted with</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((staffMember) => (
            <button
              key={staffMember.id}
              className={`bg-white rounded-xl shadow-md p-6 flex items-center gap-4 w-full transition-transform min-h-[110px] ${selectedStaff === staffMember.id ? 'scale-105 ring-2 ring-yellow-500' : ''}`}
              onClick={() => handleStaffSelect(staffMember.id)}
            >
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={staffMember.imageUrl || '/placeholder-staff.png'}
                  alt={staffMember.name}
                  fill
                  className="rounded-full object-cover border border-gray-200"
                />
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