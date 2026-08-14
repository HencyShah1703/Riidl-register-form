import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function NewUsersTrend({ data }) {
  const hasData = data && data.length > 0 && data.some(d => d.count > 0);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '360px', display: 'flex', flexDirection: 'column', flex: '1 1 500px' }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        New User Registrations Over Time
      </h4>
      
      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No new registrations recorded in the selected period.
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              />
              <YAxis 
                allowDecimals={false} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 12 }}
                itemStyle={{ color: 'var(--primary)', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="New Users"
                stroke="var(--primary)"
                strokeWidth={3}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                dot={{ r: 3, stroke: 'var(--primary)', strokeWidth: 1, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
