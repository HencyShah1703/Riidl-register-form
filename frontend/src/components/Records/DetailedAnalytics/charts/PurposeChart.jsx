import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#A20202', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

const STANDARD_PURPOSES = [
  'To Meet Someone',
  'Internship',
  'For Program/Event',
  'For Training / Workshop / Research',
  'For Facility Tour',
  'For Research Meetup',
  'For using the instrument'
];

const cleanDisplayName = (name) => {
  if (!name) return '';
  let clean = name;
  if (name.toLowerCase().startsWith('for ')) {
    clean = name.substring(4).trim();
  }
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

export default function PurposeChart({ data }) {
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const standardSet = new Set(STANDARD_PURPOSES.map(p => p.toLowerCase().trim()));
    let otherValue = 0;
    const result = [];
    
    data.forEach(item => {
      const name = item.name || '';
      const cleanName = name.toLowerCase().trim();
      if (cleanName && standardSet.has(cleanName)) {
        result.push({
          ...item,
          name: cleanDisplayName(item.name)
        });
      } else if (cleanName) {
        otherValue += item.value;
      }
    });
    
    // Always include "Other" category as requested
    result.push({ name: 'Other', value: otherValue });
    
    return result;
  }, [data]);

  const totalVal = React.useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.value, 0);
  }, [processedData]);

  const renderCustomLabel = ({ x, y, cx, value }) => {
    const percent = totalVal > 0 ? ((value / totalVal) * 100).toFixed(1) : 0;
    return (
      <text
        x={x}
        y={y}
        fill="var(--text-primary)"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '8px', fontWeight: 700 }}
      >
        {`${percent}% (${value})`}
      </text>
    );
  };

  const hasData = processedData.length > 0 && processedData.some(d => d.value > 0);

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', flex: '1', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        New Visitors by Purpose
      </h4>
      
      {!hasData ? (
        <div style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No purpose data available.
        </div>
      ) : (
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="32%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={true}
                activeShape={false}
                style={{ pointerEvents: 'none' }}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                layout="vertical"
                align="right" 
                verticalAlign="middle"
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ 
                  fontSize: '10px', 
                  right: 0,
                  maxWidth: '55%',
                  overflowY: 'auto',
                  maxHeight: '180px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
