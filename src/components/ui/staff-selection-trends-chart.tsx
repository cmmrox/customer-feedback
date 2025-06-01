import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import React from 'react';

export interface SelectionTrend {
  month: string;
  [staffName: string]: string | number;
}

export interface StaffSelectionTrendsChartProps {
  data: SelectionTrend[];
  staffNames: string[];
}

/**
 * Renders a line chart of staff selection trends over time using Recharts.
 * @param data - Array of selection trend objects (one per month)
 * @param staffNames - Array of staff member names to plot
 */
export function StaffSelectionTrendsChart({ data, staffNames }: StaffSelectionTrendsChartProps) {
  const colors = ['#2563eb', '#f59e42', '#10b981', '#ef4444', '#a21caf'];
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {staffNames.map((name, idx) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={colors[idx % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
} 