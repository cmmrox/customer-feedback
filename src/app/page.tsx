'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [selectedRating, setSelectedRating] = useState<'good' | 'not_satisfied' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRatingSelect = async (rating: 'good' | 'not_satisfied') => {
    if (isSubmitting) return; // Prevent double-clicks
    
    setSelectedRating(rating);
    setIsSubmitting(true);
    setError(null);

    try {
      // Map rating to API format
      const overallRating = rating === 'good' ? 'GOOD' : 'NOT_SATISFIED';
      
      // Create feedback record
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ overallRating }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create feedback' }));
        throw new Error(errorData.error || 'Failed to create feedback');
      }

      const data = await response.json();
      const feedbackId = data.feedbackId;

      // Navigate with feedbackId as query parameter
      if (rating === 'good') {
        router.push(`/rate-staff?feedbackId=${feedbackId}`);
      } else {
        router.push(`/dissatisfaction-reasons?feedbackId=${feedbackId}`);
      }
    } catch (error) {
      console.error('Error creating feedback:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
      setIsSubmitting(false);
      setSelectedRating(null);
    }
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

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center max-w-md">
          {error}
        </div>
      )}

      {/* Rating Buttons */}
      <div className="flex gap-16 mt-8">
        {/* Good Rating Button */}
        <button
          onClick={() => handleRatingSelect('good')}
          disabled={isSubmitting}
          className={`flex flex-col items-center transform active:scale-95 hover:scale-105 ${
            selectedRating === 'good' ? 'scale-110' : ''
          } transition-all duration-200 ease-in-out ${
            isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
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

        {/* Bad Button */}
        <button
          onClick={() => handleRatingSelect('not_satisfied')}
          disabled={isSubmitting}
          className={`flex flex-col items-center transform active:scale-95 hover:scale-105 ${
            selectedRating === 'not_satisfied' ? 'scale-110' : ''
          } transition-all duration-200 ease-in-out ${
            isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div className="bg-white rounded-full p-4 mb-2 shadow-lg hover:shadow-xl transition-shadow">
            <Image
              src="/emojis/not-satisfied.png"
              alt="Bad Rating"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <span className="text-xl font-semibold">Bad</span>
        </button>
      </div>
    </div>
  );
}
