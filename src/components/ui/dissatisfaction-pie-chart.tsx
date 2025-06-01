import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React from 'react';

/**
 * Props for DissatisfactionPieChart
 */
export interface DissatisfactionReasonData {
  reason: string;
  value: number;
}

export interface DissatisfactionPieChartProps {
  data: DissatisfactionReasonData[];
}

const COLORS = [
  '#EF4444', // red-500
  '#F59E42', // orange-400
  '#FBBF24', // yellow-400
  '#10B981', // green-500
  '#3B82F6', // blue-500
  '#6366F1', // indigo-500
];

/**
 * Renders a pie chart for dissatisfaction reasons using Recharts.
 */
export function DissatisfactionPieChart({ data }: DissatisfactionPieChartProps) {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="reason"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={40}
            paddingAngle={6}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} reports`} />
          <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontSize: '14px', marginTop: '8px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 