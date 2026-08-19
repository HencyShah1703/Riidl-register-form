import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList } from 'recharts';

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
  const hasData = data && data.length > 0;

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        New vs Returning Visitors by Purpose
      </h4>

      {!hasData ? (
        <div style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No purpose ratio breakdown available for this period.
        </div>
      ) : (
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 15, right: 5, left: -30, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="purpose" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 9, fill: 'var(--text-secondary)' }}
                interval={0}
                tickFormatter={shortenPurpose}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                allowDecimals={false} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={24} 
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
              />
              <Bar 
                dataKey="new" 
                name="New Visitors" 
                stackId="a" 
                fill="#3b82f6" 
                barSize={16}
                activeBar={false}
                style={{ pointerEvents: 'none' }}
              >
                <LabelList dataKey="new" position="inside" formatter={renderBarLabel} style={{ fill: '#ffffff', fontSize: 9, fontWeight: 700 }} />
              </Bar>
              <Bar 
                dataKey="returning" 
                name="Returning Visitors" 
                stackId="a" 
                fill="#10b981" 
                radius={[3, 3, 0, 0]}
                barSize={16}
                activeBar={false}
                style={{ pointerEvents: 'none' }}
              >
                <LabelList dataKey="returning" position="inside" formatter={renderBarLabel} style={{ fill: '#ffffff', fontSize: 9, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
