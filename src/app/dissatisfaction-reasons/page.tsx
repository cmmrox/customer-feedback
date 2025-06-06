"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Shimmer } from "@/components/ui/shimmer";

interface DissatisfactionReason {
  id: string;
  description: string;
  category: { name: string };
}

export default function DissatisfactionReasonsPage() {
  const [reasons, setReasons] = useState<DissatisfactionReason[]>([]);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackId] = useState<string>(() => uuidv4());
  const router = useRouter();
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
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

  return (
    <div className="min-h-screen bg-[#FFB800] flex flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-xl shadow-lg p-8 bg-[#FFB800]">
        <h1 className="text-3xl font-bold text-center mb-2">We&apos;re sorry to hear that.<br />What went wrong?</h1>
        <p className="text-center mb-6 text-sm">Please select all that apply. Your feedback helps us improve.</p>
        {loading ? (
          <Shimmer />
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 mb-8">
              {reasons.map((reason) => (
                <label key={reason.id} className="flex items-center gap-3 cursor-pointer text-lg font-medium">
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={() => setSelectedReason(reason.id)}
                    className="w-6 h-6 accent-black"
                    required
                  />
                  {reason.description}
                  <span className="ml-2 text-xs text-gray-600">({reason.category.name})</span>
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