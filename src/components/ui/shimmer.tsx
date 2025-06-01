import React from "react";

/**
 * Shimmer loading skeleton for list items.
 */
export function Shimmer() {
  return (
    <div aria-label="Loading..." className="flex flex-col gap-4 mb-8 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="h-5 w-40 bg-gray-300 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded ml-2" />
        </div>
      ))}
    </div>
  );
} 