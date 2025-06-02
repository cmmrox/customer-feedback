"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import { StaffBarChart } from "@/components/ui/staff-bar-chart";
import { StaffSelectionTrendsChart } from "@/components/ui/staff-selection-trends-chart";
import { DissatisfactionPieChart } from "@/components/ui/dissatisfaction-pie-chart";
import type { StaffSelection } from "@/lib/staff-selection";

const months = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
];

// Add dummy data for dissatisfaction reports
const dissatisfactionSummary = {
  month: "June 2025",
  count: 35,
};

const dissatisfactionReasons = [
  { reason: "Long Wait Times", value: 12, trend: "decreased" },
  { reason: "Product Availability", value: 8, trend: "increased" },
  { reason: "Staff Unhelpfulness", value: 7, trend: "stable" },
  { reason: "Store Cleanliness", value: 5, trend: "decreased" },
  { reason: "Pricing Issues", value: 3, trend: "stable" },
];

// Define a type for selection trends data
interface SelectionTrend {
  month: string;
  [staffName: string]: string | number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("June 2025");
  const [staffSelections, setStaffSelections] = useState<StaffSelection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for selection trends
  const [selectionTrends, setSelectionTrends] = useState<SelectionTrend[]>([]);
  const [staffNames, setStaffNames] = useState<string[]>([]);
  const [isTrendsLoading, setIsTrendsLoading] = useState<boolean>(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  // Fetch selection trends
  const fetchSelectionTrends = useCallback(async () => {
    setIsTrendsLoading(true);
    setTrendsError(null);
    try {
      const res = await fetch("/api/staff-selection-trends");
      if (!res.ok) throw new Error("Failed to fetch selection trends");
      const { data, staffNames } = await res.json();
      setSelectionTrends(data);
      setStaffNames(staffNames);
    } catch {
      setTrendsError("Could not load selection trends");
      setSelectionTrends([]);
      setStaffNames([]);
    } finally {
      setIsTrendsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSelectionTrends();
  }, [fetchSelectionTrends]);

  useEffect(() => {
    async function fetchStaffSelections() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/staff-selections?month=${encodeURIComponent(selectedMonth)}`);
        if (!res.ok) throw new Error("Failed to fetch staff selections");
        const data = await res.json();
        setStaffSelections(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setError("Could not load staff selections");
        setStaffSelections([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStaffSelections();
  }, [selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Controls */}
      <div className="max-w-7xl mx-auto mt-6 px-4 py-4 bg-white rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex flex-col">
            <label htmlFor="month" className="text-sm font-medium text-gray-700 mb-1">Select Month:</label>
            <select
              id="month"
              className="border rounded px-3 py-2 text-sm text-gray-900 bg-white"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <button className="bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center gap-2">
            <span className="material-icons text-base">file_download</span> Export Excel
          </button>
          <button className="bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-red-700 flex items-center gap-2">
            <span className="material-icons text-base">picture_as_pdf</span> Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Monthly Staff Interaction Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Staff Member Selections */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Staff Member Selections</h3>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : staffSelections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No data for this month.</div>
            ) : (
              <table className="min-w-full text-sm mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-gray-800">STAFF NAME</th>
                    <th className="px-4 py-2 text-left text-gray-800">TIMES SELECTED</th>
                  </tr>
                </thead>
                <tbody>
                  {staffSelections.map((staff) => (
                    <tr key={staff.id} className="border-b">
                      <td className="px-4 py-2 text-gray-700">{staff.name}</td>
                      <td className="px-4 py-2 text-gray-700">{staff.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Staff Comparison (Selections) */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Staff Comparison (Selections)</h3>
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg min-h-[220px]">
              <StaffBarChart data={staffSelections} />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Comparison of total times each staff member was selected by customers this month.
            </div>
          </div>
        </div>
      </div>

      {/* Selection Trends Over Time */}
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <div className="text-blue-700 font-semibold text-sm mb-2 cursor-pointer">Selection Trends Over Time (Last 6 Months)</div>
          <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-[260px] mb-2">
            {isTrendsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : trendsError ? (
              <div className="text-center py-8 text-red-600">{trendsError}</div>
            ) : (
              <StaffSelectionTrendsChart data={selectionTrends} staffNames={staffNames} />
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            Graphical representation of staff selection trends over the past few months.
          </div>
        </div>
      </div>

      {/* Dissatisfaction Reports */}
      <div className="max-w-7xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Dissatisfaction Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-stretch">
          {/* Monthly "Not Satisfied" Count */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-1 min-h-[260px] items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="text-md font-semibold text-red-700 mb-2 text-center">Monthly &quot;Not Satisfied&quot; Count</div>
              <div className="text-6xl font-extrabold text-red-600 mb-2 text-center">{dissatisfactionSummary.count}</div>
              <div className="text-xs text-gray-500 text-center">
                Total &quot;Not Satisfied&quot; feedback received in {dissatisfactionSummary.month}.
              </div>
            </div>
          </div>
          {/* Dissatisfaction by Reason (Pie Chart) */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center flex-1 min-h-[260px]">
            <div className="text-md font-semibold text-red-700 mb-2">Dissatisfaction by Reason</div>
            <div className="flex-1 flex items-center justify-center w-full bg-gray-100 rounded-lg h-64">
              <DissatisfactionPieChart data={dissatisfactionReasons} />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Breakdown of &quot;Not Satisfied&quot; feedback by common reason categories.
            </div>
          </div>
        </div>
        {/* Recurring Issues Analysis */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-2">
          <div className="text-lg font-semibold text-red-600 mb-4">Recurring Issues Analysis</div>
          <table className="min-w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-gray-700 font-semibold tracking-wide text-xs">ISSUE/REASON CATEGORY</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold tracking-wide text-xs">FREQUENCY (THIS MONTH)</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold tracking-wide text-xs">TREND (VS. LAST MONTH)</th>
              </tr>
            </thead>
            <tbody>
              {dissatisfactionReasons.map((item, idx) => (
                <tr key={item.reason} className={idx !== dissatisfactionReasons.length - 1 ? 'border-b' : ''}>
                  <td className="px-4 py-3 text-gray-900 whitespace-nowrap font-medium">{item.reason}</td>
                  <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{item.value}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.trend === "decreased" && (
                      <span className="text-green-600 flex items-center gap-1 font-medium">
                        <span className="material-icons text-base align-middle">arrow_downward</span>
                        <span>Decreased</span>
                      </span>
                    )}
                    {item.trend === "increased" && (
                      <span className="text-red-600 flex items-center gap-1 font-medium">
                        <span className="material-icons text-base align-middle">arrow_upward</span>
                        <span>Increased</span>
                      </span>
                    )}
                    {item.trend === "stable" && (
                      <span className="text-gray-600 flex items-center gap-1 font-medium">
                        <span className="material-icons text-base align-middle">horizontal_rule</span>
                        <span>Stable</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full bg-white border-t mt-12 py-6 px-4 flex items-center justify-center text-xs text-gray-500 rounded-t-lg shadow-inner" style={{ minHeight: '56px' }}>
        <span>&copy; {new Date().getFullYear()} Customer Feedback Dashboard. All rights reserved.</span>
      </footer>
    </div>
  );
} 