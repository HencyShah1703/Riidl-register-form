import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981'];

export default function VisitorRatioChart({ data }) {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);

  // Custom label showing count and percentage
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="var(--text-secondary)"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '10px', fontWeight: 600 }}
      >
        {`${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '340px', display: 'flex', flexDirection: 'column', flex: '1 1 calc(50% - 0.75rem)', minWidth: '380px' }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        Visitor Ratio (New vs Returning)
      </h4>
      
      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No visitor data available for this period.
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="35%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={false}
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
                layout="vertical"
                align="right" 
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ 
                  fontSize: '11px', 
                  right: 0,
                  maxWidth: '50%',
                  overflowY: 'auto',
                  maxHeight: '200px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
