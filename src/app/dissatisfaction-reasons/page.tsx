"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface DissatisfactionReason {
  id: string;
  description: string;
  category: { name: string };
}

function ReasonShimmer() {
  return (
    <div className="bg-white shadow-md p-6 flex items-center gap-4 w-full animate-pulse rounded-lg">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex flex-col items-start flex-grow gap-2">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function DissatisfactionReasonsContent() {
  const [reasons, setReasons] = useState<DissatisfactionReason[]>([]);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const feedbackId = searchParams.get('feedbackId');
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

  // Redirect to homepage if feedbackId is missing
  useEffect(() => {
    if (!feedbackId) {
      router.push('/');
    }
  }, [feedbackId, router]);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await fetch("/api/dissatisfaction-reasons");
        if (!res.ok) throw new Error("Failed to fetch reasons");
        const data = await res.json();
        setReasons(data);
      } catch {
        setError("Could not load reasons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReasons();
  }, []);

  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(() => {
        router.push('/');
      }, 10000);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason || !feedbackId) return;
    setSubmitting(true);
    const res = await fetch("/api/feedback-dissatisfaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedbackId, reasonId: selectedReason }),
    });
    setSubmitting(false);
    if (res.ok) {
      router.push("/thank-you");
    } else {
      alert("Failed to submit feedback");
    }
  };

  // Don't render if feedbackId is missing (will redirect)
  if (!feedbackId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center p-0">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-1">What went wrong?</h1>
        <p className="text-md text-center mb-8">Please select all that apply. Your feedback helps us improve.</p>
        {loading ? (
          <div className="flex flex-col gap-6 mb-8">
            {Array.from({ length: 5 }).map((_, idx) => (
              <ReasonShimmer key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 mb-8">
              {reasons.map((reason) => (
                <label
                  key={reason.id}
                  className={`bg-white shadow-md p-6 flex items-center gap-4 w-full transition-transform cursor-pointer rounded-lg ${
                    selectedReason === reason.id ? 'scale-105 ring-2 ring-yellow-500' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={() => setSelectedReason(reason.id)}
                    className="w-8 h-8 accent-black flex-shrink-0"
                    required
                  />
                  <div className="flex flex-col items-start flex-grow">
                    <span className="font-bold text-xl mb-1">{reason.description}</span>
                    <span className="text-sm text-gray-600">({reason.category.name})</span>
                  </div>
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={submitting || !selectedReason}
              className="w-full py-3 rounded-full bg-black text-white text-lg font-semibold shadow-md transition hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <svg className="animate-spin h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : null}
              <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function DissatisfactionReasonsLoading() {
  return (
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center p-0">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-1">What went wrong?</h1>
        <p className="text-md text-center mb-8">Please select all that apply. Your feedback helps us improve.</p>
        <div className="flex flex-col gap-6 mb-8">
          {Array.from({ length: 5 }).map((_, idx) => (
            <ReasonShimmer key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DissatisfactionReasonsPage() {
  return (
    <Suspense fallback={<DissatisfactionReasonsLoading />}>
      <DissatisfactionReasonsContent />
    </Suspense>
  );
} 