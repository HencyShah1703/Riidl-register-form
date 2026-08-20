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
  const hasData = svuColleges.length > 0;
  
  // Match the neighboring trend chart and scroll only when all rows do not fit.
  const ROW_HEIGHT = 22;
  const viewportHeight = 260;
  const innerChartHeight = Math.max(viewportHeight, svuColleges.length * ROW_HEIGHT + 30);

  const renderYAxisTick = (props) => {
    const { x, y, payload } = props;
    const val = payload?.value || '';
    const displayVal = val.length > 30 ? val.substring(0, 28) + '…' : val;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-6}
          y={3}
          textAnchor="end"
          fill="#0f172a"
          fontSize={10.5}
          fontWeight={600}
        >
          <title>{val}</title>
          {displayVal}
        </text>
      </g>
    );
  };

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          New Visitors of Somaiya University
        </h4>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Somaiya Institutes ({svuColleges.length})
        </span>
      </div>
      
      {!hasData ? (
        <div style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No SVU institute registrations in this period.
        </div>
      ) : (
        <div style={{ width: '100%', height: `${viewportHeight}px`, overflowY: 'auto', paddingRight: '2px' }}>
          <div style={{ width: '100%', height: `${innerChartHeight}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={svuColleges}
                layout="vertical"
                barCategoryGap="1px"
                margin={{ top: 10, right: 35, left: -5, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  allowDecimals={false} 
                  tickLine={false} 
                  axisLine={{ stroke: '#000000', strokeWidth: 1 }} 
                  tick={{ fontSize: 10, fill: '#0f172a', fontWeight: 600 }}
                  orientation="bottom"
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={180} 
                  interval={0}
                  tickLine={false} 
                  axisLine={{ stroke: '#000000', strokeWidth: 1 }} 
                  tick={renderYAxisTick}
                />
                <Bar 
                  dataKey="value" 
                  name="New Registrations"
                  fill="var(--primary)" 
                  radius={[0, 3, 3, 0]}
                  barSize={16}
                  activeBar={false}
                  style={{ pointerEvents: 'none' }}
                >
                  <LabelList dataKey="value" position="right" style={{ fill: '#0f172a', fontSize: 11.5, fontWeight: 800 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
