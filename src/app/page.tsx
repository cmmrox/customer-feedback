'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [selectedRating, setSelectedRating] = useState<'good' | 'not_satisfied' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRatingSelect = async (rating: 'good' | 'not_satisfied') => {
    setSelectedRating(rating);
    setIsLoading(true);
    if (rating === 'good') {
      // Simulate loading for demo, remove setTimeout if router.push is enough
      setTimeout(() => {
        router.push('/rate-staff');
        setIsLoading(false);
      }, 500);
    } else {
      // Navigate to dissatisfaction reasons page for 'not_satisfied'
      setTimeout(() => {
        router.push('/dissatisfaction-reasons');
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center justify-center p-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="w-16 h-16 border-4 border-white border-t-[#FFB800] rounded-full animate-spin mb-4"></div>
          <span className="text-xl font-semibold text-white">Loading...</span>
        </div>
      ) : (
        <>
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
              className={`flex flex-col items-center transform active:scale-95 hover:scale-105 ${
                selectedRating === 'good' ? 'scale-110' : ''
              } transition-all duration-200 ease-in-out cursor-pointer`}
            >
              <div className="bg-white rounded-full p-4 mb-2 shadow-lg hover:shadow-xl transition-shadow">
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
              className={`flex flex-col items-center transform active:scale-95 hover:scale-105 ${
                selectedRating === 'not_satisfied' ? 'scale-110' : ''
              } transition-all duration-200 ease-in-out cursor-pointer`}
            >
              <div className="bg-white rounded-full p-4 mb-2 shadow-lg hover:shadow-xl transition-shadow">
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
        </>
      )}
    </div>
  );
}
