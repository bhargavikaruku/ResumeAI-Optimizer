import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface ScoreChartProps {
  score: number;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ score }) => {
  const data = [
    { name: 'Match', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  let color = '#ef4444'; // Red-500
  if (score >= 50) color = '#eab308'; // Yellow-500
  if (score >= 75) color = '#22c55e'; // Green-500

  const COLORS = [color, '#e2e8f0']; // Color + Slate-200

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
            <Label
              value={`${score}%`}
              position="center"
              fill={COLORS[0]}
              className="text-4xl font-bold"
              style={{ fontSize: '2.5rem', fontWeight: 'bold' }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 w-full text-center">
        <p className="text-slate-500 text-sm font-medium">ATS Match Score</p>
      </div>
    </div>
  );
};