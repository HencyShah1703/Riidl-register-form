import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';

const STANDARD_PURPOSES = [
  'To Meet Someone',
  'Internship',
  'For Program/Event',
  'For Training / Workshop / Research',
  'For Facility Tour',
  'For Research Meetup',
  'For using the instrument',
  'Other'
];

const shortenPurpose = (purpose) => {
  if (!purpose) return '';
  switch (purpose) {
    case 'To Meet Someone': return 'Meet Someone';
    case 'Internship': return 'Internship';
    case 'For Program/Event': return 'Event/Program';
    case 'For Training / Workshop / Research': return 'Training/Workshop';
    case 'For Facility Tour': return 'Facility Tour';
    case 'For Research Meetup': return 'Research Meetup';
    case 'For using the instrument': return 'Instrument Use';
    case 'Other': return 'Other';
    default: return purpose.length > 15 ? purpose.substring(0, 12) + '...' : purpose;
  }
};

const renderBarLabel = (value) => (value > 0 ? value : '');

export default function VisitorRatioBreakdownChart({ data }) {
  const chartData = React.useMemo(() => {
    if (!data) return [];

    // The backend already returns data with { purpose, new, returning } objects
    // for all standard purposes + Other. Use it directly but ensure all categories exist.
    const map = new Map();

    // Initialize all standard purposes
    STANDARD_PURPOSES.forEach(p => {
      map.set(p, { purpose: p, new: 0, returning: 0 });
    });

    // Merge incoming data
    data.forEach(item => {
      const purp = item.purpose || 'Other';
      // Check if it matches a standard purpose (case-insensitive)
      const match = STANDARD_PURPOSES.find(sp => sp.toLowerCase().trim() === purp.toLowerCase().trim());
      if (match) {
        const existing = map.get(match);
        map.set(match, {
          purpose: match,
          new: existing.new + (item.new || 0),
          returning: existing.returning + (item.returning || 0)
        });
      } else {
        // Non-standard purpose goes to Other
        const existing = map.get('Other');
        map.set('Other', {
          purpose: 'Other',
          new: existing.new + (item.new || 0),
          returning: existing.returning + (item.returning || 0)
        });
      }
    });

    // Return in standard order
    return STANDARD_PURPOSES.map(p => map.get(p));
  }, [data]);

  const hasData = chartData && chartData.length > 0 && chartData.some(d => (d.new > 0 || d.returning > 0));

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        New vs Returning Visitors by Purpose
      </h4>

      {!hasData ? (
        <div style={{ minHeight: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No purpose ratio breakdown available for this period.
        </div>
      ) : (
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barCategoryGap="8%"
              margin={{ top: 15, right: 10, left: -20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="purpose" 
                tickLine={false} 
                axisLine={{ stroke: '#000000', strokeWidth: 1 }} 
                tick={{ fontSize: 9, fill: '#0f172a', fontWeight: 600 }}
                interval={0}
                tickFormatter={shortenPurpose}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                allowDecimals={false} 
                tickLine={false} 
                axisLine={{ stroke: '#000000', strokeWidth: 1 }} 
                tick={{ fontSize: 10, fill: '#0f172a', fontWeight: 600 }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={26} 
                iconType="circle"
                iconSize={8}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontWeight: 700, fontSize: '0.78rem' }}>
                    {value}
                  </span>
                )}
                wrapperStyle={{ paddingTop: '4px' }}
              />
              <Bar 
                dataKey="new" 
                name="New Visitors" 
                stackId="a" 
                fill="#3b82f6" 
                barSize={21}
                activeBar={false}
                style={{ pointerEvents: 'none' }}
              >
                <LabelList dataKey="new" position="inside" formatter={renderBarLabel} style={{ fill: '#ffffff', fontSize: 9.5, fontWeight: 800 }} />
              </Bar>
              <Bar 
                dataKey="returning" 
                name="Returning Visitors" 
                stackId="a" 
                fill="#10b981" 
                radius={[2, 2, 0, 0]}
                barSize={21}
                activeBar={false}
                style={{ pointerEvents: 'none' }}
              >
                <LabelList dataKey="returning" position="inside" formatter={renderBarLabel} style={{ fill: '#ffffff', fontSize: 9.5, fontWeight: 800 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
