import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function VisitorRatioBreakdownChart({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '360px', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%' }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        New vs Returning Visitors by Purpose
      </h4>

      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No purpose ratio breakdown available for this period.
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="purpose" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              />
              <YAxis 
                allowDecimals={false} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} 
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: 12
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Bar 
                dataKey="new" 
                name="New Visitors" 
                stackId="a" 
                fill="#3b82f6" 
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="returning" 
                name="Returning Visitors" 
                stackId="a" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
