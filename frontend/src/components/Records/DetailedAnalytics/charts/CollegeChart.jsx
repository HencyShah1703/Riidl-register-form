import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

export default function CollegeChart({ data }) {
  // Filter ONLY Somaiya / SVU related institutes data
  const isSomaiyaInstitute = (name) => {
    if (!name) return false;
    const n = name.toLowerCase().trim();
    if (n === 'other' || n === 'none') return false;
    return (
      n.includes('somaiya') ||
      n.includes('svu') ||
      n.includes('riidl') ||
      n.includes('shantilal')
    );
  };

  const svuColleges = (data || []).filter(item => isSomaiyaInstitute(item.name));
  const hasData = svuColleges.length > 0 && svuColleges.some(d => d.value > 0);
  const chartHeight = Math.max(180, Math.min(300, svuColleges.length * 28));

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          New Visitors by SVU Institutes
        </h4>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Somaiya Institutes Only
        </span>
      </div>
      
      {!hasData ? (
        <div style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No SVU institute registrations in this period.
        </div>
      ) : (
        <div style={{ width: '100%', maxHeight: '250px', overflowY: 'auto' }}>
          <div style={{ width: '100%', height: `${chartHeight}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={svuColleges}
                layout="vertical"
                margin={{ top: 5, right: 15, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={170} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--text-secondary)', fontWeight: 500 }}
                />
                <Bar 
                  dataKey="value" 
                  name="New Registrations"
                  fill="var(--primary)" 
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                  activeBar={false}
                  style={{ pointerEvents: 'none' }}
                >
                  <LabelList dataKey="value" position="right" style={{ fill: 'var(--text-secondary)', fontSize: 9, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
