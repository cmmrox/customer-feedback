'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function HomePage() {
  const [selectedRating, setSelectedRating] = useState<'good' | 'not_satisfied' | null>(null);

  const handleRatingSelect = async (rating: 'good' | 'not_satisfied') => {
    setSelectedRating(rating);
    // Here we'll add the API call to save the feedback later
  };

  return (
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <div className="bg-white rounded-full p-4 mb-8">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>

      {/* Question Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          How was your visit today ?
        </h1>
        <p className="text-xl">
          We&apos;d love to hear about your shopping experience
        </p>
      </div>

      {/* Rating Buttons */}
      <div className="flex gap-16 mt-8">
        {/* Good Rating Button */}
        <button
          onClick={() => handleRatingSelect('good')}
          className={`flex flex-col items-center ${
            selectedRating === 'good' ? 'scale-110' : ''
          } transition-transform`}
        >
          <div className="bg-white rounded-full p-4 mb-2">
            <Image
              src="/emojis/good.png"
              alt="Good Rating"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <span className="text-xl font-semibold">Good</span>
        </button>

        {/* Not Satisfied Button */}
        <button
          onClick={() => handleRatingSelect('not_satisfied')}
          className={`flex flex-col items-center ${
            selectedRating === 'not_satisfied' ? 'scale-110' : ''
          } transition-transform`}
        >
          <div className="bg-white rounded-full p-4 mb-2">
            <Image
              src="/emojis/not-satisfied.png"
              alt="Not Satisfied Rating"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <span className="text-xl font-semibold">Not Satisfied</span>
        </button>
      </div>
    </div>
  );
}
