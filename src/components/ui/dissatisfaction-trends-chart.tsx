import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import React from 'react';

export interface DissatisfactionTrendData {
  month: string;
  count: number;
}

export interface DissatisfactionTrendsChartProps {
  data: DissatisfactionTrendData[];
}

/**
 * Renders a line chart of dissatisfaction trends over time using Recharts.
 * @param data - Array of dissatisfaction trend objects (one per month)
 */
export function DissatisfactionTrendsChart({ data }: DissatisfactionTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#EF4444"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Dissatisfaction Count"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

