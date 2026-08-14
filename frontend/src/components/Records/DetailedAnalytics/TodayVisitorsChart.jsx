import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#f59e0b', '#ef4444']; // Amber for New, Red for Already Registered

export default function TodayVisitorsChart({ todayData }) {
  const { total, new: newCount, returning: returningCount } = todayData;

  const chartData = [
    { name: 'New Visitors', value: newCount },
    { name: 'Already Registered Visitors', value: returningCount }
  ].filter(d => d.value > 0);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '320px', display: 'flex', flexDirection: 'column', flex: '1 1 300px' }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        Today's Visitor Composition
      </h4>
      
      {total === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No visitors recorded today yet.
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%', height: '240px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
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
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Centered label inside donut */}
          <div style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', lineHeight: 1 }}>
              {total}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Visitors
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
