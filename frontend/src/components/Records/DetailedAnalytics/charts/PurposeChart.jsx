import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const PURPOSE_COLOR_MAP = {
  'Facility Tour': '#f59e0b',
  'Internship': '#06b6d4',
  'Other': '#ec4899',
  'Program/Event': '#8b5cf6',
  'Research Meetup': '#10b981',
  'Training / Workshop / Research': '#8b0000',
  'Using the instrument': '#2563eb',
  'To Meet Someone': '#3b82f6'
};

const FALLBACK_COLORS = ['#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6', '#10b981', '#8b0000', '#2563eb', '#64748b'];

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
    const standardValues = new Map(STANDARD_PURPOSES.map(p => [p, 0]));
    let otherValue = 0;

    data.forEach(item => {
      const name = item.name || '';
      const cleanName = name.toLowerCase().trim();
      if (cleanName && standardSet.has(cleanName)) {
        const standardPurpose = STANDARD_PURPOSES.find(p => p.toLowerCase().trim() === cleanName);
        standardValues.set(standardPurpose, standardValues.get(standardPurpose) + (Number(item.value) || 0));
      } else if (cleanName) {
        otherValue += Number(item.value) || 0;
      }
    });

    return [
      ...STANDARD_PURPOSES.map(purpose => {
        const value = standardValues.get(purpose);
        return { name: cleanDisplayName(purpose), value, chartValue: value > 0 ? value : 0.001 };
      }),
      { name: 'Other', value: otherValue, chartValue: otherValue > 0 ? otherValue : 0.001 }
    ];
  }, [data]);

  const totalVal = React.useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.value, 0);
  }, [processedData]);

  const getColor = (name, index) => {
    return PURPOSE_COLOR_MAP[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  };

  const renderCustomLabel = (props) => {
    const { cx, cy, midAngle, outerRadius, value, name, fill, index, payload } = props;
    const actualValue = payload?.value ?? value;
    const percent = totalVal > 0 ? ((actualValue / totalVal) * 100).toFixed(1) : '0.0';
    const sliceColor = fill || getColor(name, index);

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const isRight = cos >= 0;

    const sx = cx + (outerRadius + 3) * cos;
    const sy = cy + (outerRadius + 3) * sin;

    const mx = cx + (outerRadius + 12) * cos;
    const my = cy + (outerRadius + 12) * sin;

    const ex = mx + (isRight ? 12 : -12);
    const ey = my;

    const textAnchor = isRight ? 'start' : 'end';
    const tx = ex + (isRight ? 4 : -4);
    const ty = ey;

    return (
      <g style={{ pointerEvents: 'none' }}>
        <path
          d={`M ${sx},${sy} L ${mx},${my} L ${ex},${ey}`}
          stroke={sliceColor}
          strokeWidth={1.5}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2.5} fill={sliceColor} />
        <text
          x={tx}
          y={ty}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fill="#0f172a"
          style={{ fontSize: '8.5px', fontWeight: 700 }}
        >
          {`${percent}% (${actualValue})`}
        </text>
      </g>
    );
  };

  const hasData = processedData.length > 0 && processedData.some(d => d.value > 0);

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', flex: '1', width: '100%', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        New Visitors by Purpose
      </h4>
      
      {!hasData ? (
        <div style={{ minHeight: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No purpose data available.
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '260px', minWidth: 0 }}>
          {/* Left: Donut Chart with intricate leader lines */}
          <div style={{ flex: '1 1 60%', height: '100%', minWidth: 0, overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 8, bottom: 10, left: 8 }}>
                <Pie
                  data={processedData}
                  cx="42%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={1.5}
                  minAngle={1}
                  dataKey="chartValue"
                  label={renderCustomLabel}
                  labelLine={false}
                  activeShape={false}
                  style={{ pointerEvents: 'none' }}
                >
                  {processedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getColor(entry.name, index)} 
                      stroke="#ffffff" 
                      strokeWidth={2} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Vertical Separator Line */}
          <div style={{ width: '1px', height: '82%', background: '#e2e8f0', margin: '0 0.5rem', flexShrink: 0 }} />

          {/* Right: Legend */}
          <div style={{ flex: '0 0 36%', display: 'flex', flexDirection: 'column', gap: '0.45rem', overflowY: 'auto', maxHeight: '250px', paddingRight: '4px' }}>
            {processedData.map((entry, index) => {
              const color = getColor(entry.name, index);
              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <span style={{ color: color, fontSize: '0.68rem', fontWeight: 700, lineHeight: 1.2, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {entry.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
