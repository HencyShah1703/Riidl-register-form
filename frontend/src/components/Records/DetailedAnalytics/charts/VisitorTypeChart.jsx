import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#A20202', '#6b7280'];

const STANDARD_ROLES = [
  'Student',
  'Startup',
  'Faculty',
  'Somaiya Management',
  'VC & Angel investors'
];

export default function VisitorTypeChart({ data }) {
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const standardSet = new Set(STANDARD_ROLES.map(r => r.toLowerCase().trim()));
    let otherValue = 0;
    const result = [];
    
    data.forEach(item => {
      const name = item.name || '';
      const cleanName = name.toLowerCase().trim();
      if (cleanName && standardSet.has(cleanName)) {
        result.push(item);
      } else if (cleanName) {
        otherValue += item.value;
      }
    });
    
    if (otherValue > 0) {
      result.push({ name: 'Other', value: otherValue });
    }
    
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
        New Visitors by Category ("I Am")
      </h4>
      
      {!hasData ? (
        <div style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No category data available.
        </div>
      ) : (
        <div style={{ width: '100%', height: '170px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="30%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
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
                  maxHeight: '150px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
