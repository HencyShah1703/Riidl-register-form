import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981'];

export default function VisitorRatioChart({ data }) {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);

  const totalVal = React.useMemo(() => {
    if (!data) return 0;
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  const renderCustomLabel = ({ x, y, cx, name, value }) => {
    const percent = totalVal > 0 ? ((value / totalVal) * 100).toFixed(1) : 0;
    const shortName = name === 'New Visitors' ? 'New' : 'Returning';
    return (
      <text
        x={x}
        y={y}
        fill="var(--text-primary)"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '8px', fontWeight: 600 }}
      >
        {`${shortName} ${percent}% (${value})`}
      </text>
    );
  };

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', flex: '1', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        Visitor Ratio (New vs Returning)
      </h4>
      
      {!hasData ? (
        <div style={{ minHeight: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No visitor ratio data available.
        </div>
      ) : (
        <div style={{ width: '100%', height: '130px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={3}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={true}
                activeShape={false}
                style={{ pointerEvents: 'none' }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
