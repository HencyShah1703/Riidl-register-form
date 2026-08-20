import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

function MiniDetailCard({ title, data, color }) {
  const hasData = data && data.length > 0;
  const count = data ? data.length : 0;

  // Keep sparse charts compact so the axes stay with the plotted bars.
  const ROW_HEIGHT = 24;
  const VISIBLE_COUNT = 7;
  const CHART_HEIGHT = VISIBLE_COUNT * ROW_HEIGHT + 80;
  const innerChartHeight = Math.max(CHART_HEIGHT, count * ROW_HEIGHT + 35);
  const viewportHeight = Math.min(innerChartHeight, CHART_HEIGHT);

  const renderYAxisTick = (props) => {
    const { x, y, payload } = props;
    const val = payload?.value || '';
    const displayVal = val.length > 25 ? val.substring(0, 23) + '…' : val;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-6}
          y={3}
          textAnchor="end"
          fill="#0f172a"
          fontSize={10}
          fontWeight={600}
        >
          <title>{val}</title>
          {displayVal}
        </text>
      </g>
    );
  };

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', flex: '1 1 calc(33.3% - 0.5rem)', minWidth: '280px', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {title}
        </h5>
        {hasData && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ({count})
          </span>
        )}
      </div>

      {!hasData ? (
        <div style={{ minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No specific details recorded.
        </div>
      ) : (
        <div style={{ width: '100%', height: `${viewportHeight}px`, overflowY: count > VISIBLE_COUNT ? 'auto' : 'hidden', overflowX: 'hidden', paddingRight: '2px' }}>
          <div style={{ width: '100%', height: `${innerChartHeight}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                barCategoryGap="1px"
                margin={{ top: 8, right: 45, left: 0, bottom: 16 }}
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
                  width={165}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: '#000000', strokeWidth: 1 }}
                  tick={renderYAxisTick}
                />
                <Bar dataKey="value" fill={color} radius={[0, 3, 3, 0]} barSize={15} activeBar={false} style={{ pointerEvents: 'none' }}>
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
          color="#3b82f6"
        />
        <MiniDetailCard
          title="External Colleges"
          data={otherCollege}
          color="#f59e0b"
        />
        <MiniDetailCard
          title="Other Visitor Categories"
          data={otherVisitorType}
          color="#8b5cf6"
        />
      </div>
    </div>
  );
}
