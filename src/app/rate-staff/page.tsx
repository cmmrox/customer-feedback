'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface StaffMember {
  id: string;
  name: string;
  imageUrl: string;
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
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-2">Please rate our service staff</h1>
      <p className="text-lg mb-8">Tap a face to rate the team members you interacted with</p>

      <div className="w-full max-w-2xl space-y-4">
        {staff.map((staffMember) => (
          <button
            key={staffMember.id}
            className={`bg-white rounded-lg p-4 flex items-center gap-4 w-full transition-transform ${selectedStaff === staffMember.id ? 'scale-105 ring-2 ring-yellow-500' : ''}`}
            onClick={() => handleStaffSelect(staffMember.id)}
          >
            <div className="w-16 h-16 relative">
              <Image
                src={staffMember.imageUrl || '/placeholder-staff.png'}
                alt={staffMember.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="font-semibold flex-grow">{staffMember.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 