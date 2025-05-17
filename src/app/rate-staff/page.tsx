'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Rating {
  id: string;
  name: string;
  icon: string;
}

interface StaffMember {
  id: string;
  name: string;
  imageUrl: string;
}

export default function RateStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [staffRatings, setStaffRatings] = useState<Record<string, string>>({});
  const [feedbackId] = useState(() => uuidv4());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch staff members
        const staffResponse = await fetch('/api/staff');
        if (!staffResponse.ok) throw new Error('Failed to fetch staff');
        const staffData = await staffResponse.json();
        setStaff(staffData);

        // Fetch available ratings
        const ratingsResponse = await fetch('/api/ratings');
        if (!ratingsResponse.ok) throw new Error('Failed to fetch ratings');
        const ratingsData = await ratingsResponse.json();
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRating = async (staffId: string, ratingId: string) => {
    try {
      const response = await fetch('/api/feedback-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackId,
          staffId,
          ratingId
        }),
      });

      if (!response.ok) throw new Error('Failed to submit rating');

      setStaffRatings(prev => ({
        ...prev,
        [staffId]: ratingId
      }));
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-2">Please rate our service staff</h1>
      <p className="text-lg mb-8">Tap a face to rate the team members you interacted with</p>

      <div className="w-full max-w-2xl space-y-4">
        {staff.map((staffMember) => (
          <div key={staffMember.id} className="bg-white rounded-lg p-4 flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <Image
                src={staffMember.imageUrl || '/placeholder-staff.png'}
                alt={staffMember.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="font-semibold flex-grow">{staffMember.name}</span>
            <div className="flex gap-2">
              {ratings.map((rating) => (
                <button
                  key={rating.id}
                  onClick={() => handleRating(staffMember.id, rating.id)}
                  className={`p-2 rounded-full transition-transform ${
                    staffRatings[staffMember.id] === rating.id ? 'scale-110' : ''
                  }`}
                >
                  <Image 
                    src={rating.icon} 
                    alt={rating.name} 
                    width={32} 
                    height={32}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 