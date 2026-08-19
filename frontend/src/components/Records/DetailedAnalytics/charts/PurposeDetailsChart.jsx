import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

function MiniDetailCard({ title, data, nameLabel, valueLabel, color }) {
  const hasData = data && data.length > 0;

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', flex: '1 1 calc(33.3% - 0.5rem)', minWidth: '280px', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        {title}
      </h5>

      {!hasData ? (
        <div style={{ minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No specific details recorded.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {/* Horizontal Bar Chart */}
          <div style={{ width: '100%', height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 15, left: -30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 8 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={130}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 8, fill: 'var(--text-secondary)' }}
                />
                <Bar dataKey="value" fill={color} radius={[0, 3, 3, 0]} barSize={9} activeBar={false} style={{ pointerEvents: 'none' }}>
                  <LabelList dataKey="value" position="right" style={{ fill: 'var(--text-secondary)', fontSize: 8, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PurposeDetailsChart({ data }) {
  const { toMeet, otherCollege, otherVisitorType } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <h4 style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        Detailed Purpose Breakdown
      </h4>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
        <MiniDetailCard
          title="To Meet Someone (Person / Team)"
          data={toMeet}
          nameLabel="Person / Team"
          valueLabel="Visits"
          color="#3b82f6"
        />
        <MiniDetailCard
          title="External Colleges"
          data={otherCollege}
          nameLabel="External College"
          valueLabel="Visits"
          color="#f59e0b"
        />
        <MiniDetailCard
          title="Other Visitor Categories"
          data={otherVisitorType}
          nameLabel="Visitor Type"
          valueLabel="Visits"
          color="#8b5cf6"
        />
      </div>
    </div>
  );
}
