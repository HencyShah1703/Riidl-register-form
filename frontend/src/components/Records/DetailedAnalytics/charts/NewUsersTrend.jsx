import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '360px', display: 'flex', flexDirection: 'column', flex: '1 1 500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          New Visitor Registrations Over Time
        </h4>
        <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2px', background: '#f8fafc' }}>
          <button
            onClick={() => setViewType('monthly')}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: viewType === 'monthly' ? 'var(--primary)' : 'transparent',
              color: viewType === 'monthly' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewType('yearly')}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: viewType === 'yearly' ? 'var(--primary)' : 'transparent',
              color: viewType === 'yearly' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Yearly
          </button>
        </div>
      </div>
      
      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No new registrations recorded in the selected period.
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              />
              <YAxis 
                allowDecimals={false} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 12 }}
                itemStyle={{ color: 'var(--primary)', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="New Visitors"
                stroke="var(--primary)"
                strokeWidth={3}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                dot={{ r: 3, stroke: 'var(--primary)', strokeWidth: 1, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
