import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#A20202', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function PurposeChart({ data }) {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '320px', display: 'flex', flexDirection: 'column', flex: '1 1 300px' }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        New Users by Purpose
      </h4>
      
      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No demographics data available for this period.
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
                height={48} 
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: '10px', overflowY: 'auto', maxHeight: '48px', paddingRight: '5px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
