import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

export default function CollegeChart({ data }) {
  const allColleges = data || [];
  const hasData = allColleges.length > 0 && allColleges.some(d => d.value > 0);
  const chartHeight = Math.max(240, allColleges.length * 35);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '320px', maxHeight: '450px', overflowY: 'auto', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%' }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', position: 'sticky', top: 0, background: '#ffffff', zIndex: 10, paddingBottom: '0.25rem' }}>
        New Visitors by College
      </h4>
      
      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No college data available for this period.
        </div>
      ) : (
        <div style={{ width: '100%', height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={allColleges}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={240} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 9, fill: 'var(--text-secondary)' }}
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
              <Bar 
                dataKey="value" 
                name="New Registrations"
                fill="#3b82f6" 
                radius={[0, 6, 6, 0]}
                barSize={14}
              >
                <LabelList dataKey="value" position="right" style={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
