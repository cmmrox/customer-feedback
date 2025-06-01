import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import React from 'react';

export interface StaffSelection {
  id: string;
  name: string;
  count: number;
}

export interface StaffBarChartProps {
  data: StaffSelection[];
}

/**
 * Renders a bar chart of staff selections using Recharts.
 * @param data - Array of staff selection objects
 */
export function StaffBarChart({ data }: StaffBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
} 