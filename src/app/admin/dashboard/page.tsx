"use client";

import { useState } from "react";
import { StaffBarChart } from "@/components/ui/staff-bar-chart";
import { StaffSelectionTrendsChart } from "@/components/ui/staff-selection-trends-chart";

const months = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
];

const reportTypes = [
  "All Reports",
  "Staff Selections",
  "Dissatisfaction",
];

const staffSelections = [
  { id: "1", name: "Alice Wonderland", count: 120 },
  { id: "2", name: "Bob The Builder", count: 95 },
  { id: "3", name: "Charlie Chaplin", count: 110 },
  { id: "4", name: "Diana Prince", count: 88 },
];

// Dummy data for selection trends
const selectionTrends = [
  { month: "Jan", Alice: 20, Bob: 15, Charlie: 10 },
  { month: "Feb", Alice: 25, Bob: 18, Charlie: 12 },
  { month: "Mar", Alice: 30, Bob: 20, Charlie: 15 },
  { month: "Apr", Alice: 28, Bob: 22, Charlie: 18 },
  { month: "May", Alice: 35, Bob: 25, Charlie: 20 },
  { month: "Jun", Alice: 40, Bob: 30, Charlie: 22 },
];
const staffNames = ["Alice", "Bob", "Charlie"];

export default function AdminDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("June 2025");
  const [reportType, setReportType] = useState("All Reports");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Controls */}
      <div className="max-w-7xl mx-auto mt-6 px-4 py-4 bg-white rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex flex-col">
            <label htmlFor="month" className="text-sm font-medium text-gray-700 mb-1">Select Month:</label>
            <select
              id="month"
              className="border rounded px-3 py-2 text-sm"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="report-type" className="text-sm font-medium text-gray-700 mb-1">Report Type:</label>
            <select
              id="report-type"
              className="border rounded px-3 py-2 text-sm"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
            <StaffSelectionTrendsChart data={selectionTrends} staffNames={staffNames} />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            Graphical representation of staff selection trends over the past few months.
          </div>
        </div>
      </div>
    </div>
  );
} 