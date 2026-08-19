import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

function MiniDetailCard({ title, data, nameLabel, valueLabel, color }) {
  const hasData = data && data.length > 0;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', minHeight: '340px', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%' }}>
      <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h5>

      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          No specific details available for this period.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          {/* Horizontal Bar Chart */}
          <div style={{ width: '100%', height: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 8, fill: 'var(--text-secondary)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: 11
                  }}
                />
                <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} barSize={10}>
                  <LabelList dataKey="value" position="right" style={{ fill: 'var(--text-secondary)', fontSize: 9, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Minimal Table */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '120px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <th style={{ padding: '0.25rem 0.5rem' }}>{nameLabel}</th>
                  <th style={{ padding: '0.25rem 0.5rem', textAlign: 'right', width: '60px' }}>{valueLabel}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.35rem 0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</td>
                    <td style={{ padding: '0.35rem 0.5rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PurposeDetailsChart({ data }) {
  const { toMeet, internship, otherCollege, otherVisitorType } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      <h4 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        Detailed Purpose Analytics
      </h4>
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', width: '100%' }}>
        <MiniDetailCard
          title="To Meet Someone (Person / Team)"
          data={toMeet}
          nameLabel="Person / Team"
          valueLabel="Visits"
          color="#3b82f6"
        />
        <MiniDetailCard
          title="Internship Mentors"
          data={internship}
          nameLabel="Mentor Name"
          valueLabel="Visits"
          color="#10b981"
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
