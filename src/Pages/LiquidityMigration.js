// LiquidityMigration.js
import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const formatCurrency = value =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

/**
 * Generate simulated liquidity metrics with realistic market behavior
 * @param {number} timeWindow - number of days
 * @returns {Array<{ date: string; inflow: number; outflow: number; netFlow: number }>}
 */
function calculateLiquidityMetrics(timeWindow = 7) {
  const results = [];
  const now = new Date();

  for (let i = timeWindow - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const currentDate = date.toISOString().split('T')[0];

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseAmount = isWeekend
      ? 800000 + Math.random() * 300000
      : 1200000 + Math.random() * 500000;

    const hourlyVariation = Math.sin((date.getHours() / 24) * Math.PI * 2);
    const volatilityFactor = 0.15 + Math.abs(hourlyVariation) * 0.1;
    const marketSentiment = Math.random() > 0.5 ? 1.1 : 0.9;

    const inflow = baseAmount * (1 + Math.random() * volatilityFactor) * marketSentiment;
    const outflowFactor = 0.8 + (Math.random() * 0.4 - 0.2);
    const outflow = baseAmount * (1 + Math.random() * volatilityFactor) * outflowFactor;

    const netFlow = inflow - outflow;
    const marketImpact = Math.random() > 0.95 ? netFlow * 1.5 : netFlow;

    results.push({
      date: currentDate,
      inflow: Math.max(0, inflow),
      outflow: Math.max(0, outflow),
      netFlow: marketImpact
    });
  }

  return results;
}

export default function LiquidityMigration({ timeWindow = 7 }) {
  const [metrics, setMetrics] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    setMetrics(calculateLiquidityMetrics(timeWindow));
  }, [timeWindow]);

  // Reveal animations
  useEffect(() => {
    const t1 = setTimeout(() => setShowChart(true), 100);
    const t2 = setTimeout(() => setShowTable(true), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const cardStyle = {
    backgroundColor: '#222831',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
    border: '1.5px solid #393e46'
  };

  return (
    <div
      style={{
        padding: 32,
        background:
          'radial-gradient(circle at top left, #1f2937 0%, #0f172a 100%)',
        color: '#e0e0e0',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: '100vh',
        minWidth: '320px',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      <h2
        style={{
          fontSize: '2.2rem',
          marginBottom: 16,
          fontWeight: '900',
          letterSpacing: '0.05em',
          color: '#1e90ff', // DodgerBlue for blue heading
          textAlign: 'center'
        }}
      >
        Liquidity Migration Visualizer
      </h2>
      <p
        style={{
          marginBottom: 24,
          fontSize: '1.1rem',
          fontWeight: '700',
          lineHeight: 1.5,
          color: '#a0aec0',
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          textShadow: '0 0 3px rgba(0,0,0,0.3)'
        }}
      >
        Over the last <strong style={{ color: '#00ffa3' }}>{timeWindow} days</strong>, this dashboard
        illustrates the dynamic flow of funds migrating into <em style={{ fontWeight: '900', color: '#14ffec' }}>inflow</em> and out of <em style={{ fontWeight: '900', color: '#ff6b6b' }}>outflow</em> the liquidity pool.
        The <strong style={{ color: '#f9f871' }}>net flow</strong> highlights overall migration trends, helping you understand market liquidity shifts and potential impacts on trading activity.
      </p>
      <p
        style={{
          marginBottom: 32,
          fontSize: '1rem',
          fontWeight: '600',
          lineHeight: 1.5,
          color: '#b0bec5',
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          fontStyle: 'italic',
          textShadow: '0 0 2px rgba(0,0,0,0.2)'
        }}
      >
        <strong>Implications:</strong> Significant positive net flow indicates increased liquidity entering the pool, which can enhance trading efficiency and reduce slippage. Conversely, sustained negative net flow may signal liquidity withdrawal, potentially increasing volatility and impacting market depth. Monitoring these trends helps anticipate market sentiment and informs strategic decisions.
      </p>

      {/* Chart Card */}
      <div
        style={{
          ...cardStyle,
          opacity: showChart ? 1 : 0,
          transition: 'opacity 0.7s ease-in-out'
        }}
      >
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <AreaChart
              data={metrics}
              margin={{ top: 20, right: 40, left: 0, bottom: 12 }}
            >
              <defs>
                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffa3" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#00ffa3" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3a59" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#a0aec0"
                tick={{ fill: '#a0aec0', fontSize: 13, fontWeight: '700' }}
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                stroke="#a0aec0"
                tick={{ fill: '#a0aec0', fontSize: 13, fontWeight: '700' }}
                tickFormatter={formatCurrency}
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
                width={90}
              />
              <Tooltip
                wrapperStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.7)',
                  fontWeight: '700'
                }}
                labelStyle={{ color: '#f8fafc', fontWeight: '700' }}
                itemStyle={{ color: '#f8fafc', fontWeight: '700' }}
                formatter={value => formatCurrency(value)}
              />
              <Area
                type="monotone"
                dataKey="inflow"
                stroke="#00ffa3"
                fill="url(#colorInflow)"
                name="Inflow"
                strokeWidth={3}
                activeDot={{ r: 7, strokeWidth: 3, stroke: '#00ffa3', fill: '#0ff' }}
              />
              <Area
                type="monotone"
                dataKey="outflow"
                stroke="#ff6b6b"
                fill="url(#colorOutflow)"
                name="Outflow"
                strokeWidth={3}
                activeDot={{ r: 7, strokeWidth: 3, stroke: '#ff6b6b', fill: '#ff4c4c' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Card */}
      <div
        style={{
          ...cardStyle,
          opacity: showTable ? 1 : 0,
          transition: 'opacity 0.7s ease-in-out',
          overflowX: 'auto'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 12px',
            fontSize: 15,
            userSelect: 'none'
          }}
        >
          <thead>
            <tr>
              {['Date', 'Inflow', 'Outflow', 'Net Flow'].map((label) => (
                <th
                  key={label}
                  style={{
                    borderBottom: '3px solid #334155',
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#00aaff',
                    fontWeight: '900',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    backgroundColor: '#121921',
                    boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.3)'
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#1e293b' : '#273449',
                  transition: 'background-color 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = '#334155')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor =
                    idx % 2 === 0 ? '#1e293b' : '#273449')
                }
              >
                <td
                  style={{
                    padding: '12px 16px',
                    color: '#cbd5e1',
                    fontWeight: '700'
                  }}
                >
                  {row.date}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    color: '#00ffa3',
                    fontWeight: '700'
                  }}
                >
                  {formatCurrency(row.inflow)}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    color: '#ff6b6b',
                    fontWeight: '700'
                  }}
                >
                  {formatCurrency(row.outflow)}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    color: row.netFlow >= 0 ? '#f9f871' : '#ff8787',
                    fontWeight: '900'
                  }}
                >
                  {formatCurrency(row.netFlow)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
