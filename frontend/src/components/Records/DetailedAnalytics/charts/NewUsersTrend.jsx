import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

export default function NewUsersTrend({ data }) {
  const [viewType, setViewType] = useState('monthly'); // 'monthly' or 'yearly'

  const aggregateData = () => {
    if (!data || data.length === 0) return [];

    if (viewType === 'monthly') {
      const monthMap = new Map();
      data.forEach(item => {
        let key = item.date;
        const isMmmDd = /^[A-Za-z]{3}\s\d{1,2}$/.test(item.date);
        if (isMmmDd) {
          const currentYear = new Date().getFullYear();
          const monthPart = item.date.split(' ')[0];
          key = `${monthPart} ${currentYear}`;
        }
        monthMap.set(key, (monthMap.get(key) || 0) + item.count);
      });

      return Array.from(monthMap.entries()).map(([date, count]) => ({
        date,
        count
      }));
    } else {
      const yearMap = new Map();
      data.forEach(item => {
        let yearKey = new Date().getFullYear().toString();
        const parts = item.date.split(' ');
        if (parts.length > 1) {
          const possibleYear = parts[1];
          if (possibleYear.length === 4 && !isNaN(possibleYear)) {
            yearKey = possibleYear;
          }
        }
        yearMap.set(yearKey, (yearMap.get(yearKey) || 0) + item.count);
      });

      return Array.from(yearMap.entries())
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([date, count]) => ({
          date,
          count
        }));
    }
  };

  const chartData = aggregateData();
  const hasData = chartData && chartData.length > 0 && chartData.some(d => d.count > 0);

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          New Visitor Registrations Over Time
        </h4>
        <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1px', background: '#f8fafc' }}>
          <button
            onClick={() => setViewType('monthly')}
            style={{
              padding: '0.15rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              background: viewType === 'monthly' ? 'var(--primary)' : 'transparent',
              color: viewType === 'monthly' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewType('yearly')}
            style={{
              padding: '0.15rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              background: viewType === 'yearly' ? 'var(--primary)' : 'transparent',
              color: viewType === 'yearly' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Yearly
          </button>
        </div>
      </div>
      
      {!hasData ? (
        <div style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No new registrations recorded in the selected period.
        </div>
      ) : (
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -30, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'var(--text-secondary)', fontSize: 9 }}
              />
              <YAxis 
                allowDecimals={false} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'var(--text-secondary)', fontSize: 9 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="New Visitors"
                stroke="var(--primary)"
                strokeWidth={2}
                activeDot={false}
                dot={{ r: 2.5, stroke: 'var(--primary)', strokeWidth: 1, fill: '#ffffff' }}
                style={{ pointerEvents: 'none' }}
              >
                <LabelList dataKey="count" position="top" style={{ fill: 'var(--text-secondary)', fontSize: 9, fontWeight: 700 }} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
