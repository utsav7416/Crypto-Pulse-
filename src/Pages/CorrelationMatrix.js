import React, { useState, useEffect } from 'react';
import * as ss from 'simple-statistics';

const CoinList = (currency, perPage = 10) =>
  `/api/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true`;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    animation: 'fadeIn 1s ease-in-out',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#0d0303b'
  },
  card: {
    border: '2px solid #ddd',
    borderRadius: 12,
    padding: 30,
    maxWidth: '95%',
    backgroundColor: '#dcb9fa',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a202c'
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 1.7,
    marginBottom: 18,
    color: '#2d3748',
    fontWeight: 600
  },
  list: {
    fontSize: 17,
    lineHeight: 1.7,
    marginBottom: 24,
    color: '#2d3748',
    paddingLeft: 22
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center'
  },
  headerCell: {
    padding: '12px 16px',
    fontSize: 15,
    color: '#2d3748',
    backgroundColor: '#edf2f7',
    textAlign: 'left',
    fontWeight: 700
  },
  assetCell: {
    padding: '12px 16px',
    fontSize: 15,
    fontWeight: 700,
    color: '#1a202c',
    textAlign: 'left',
    backgroundColor: '#f7fafc'
  },
  cell: {
    padding: '12px 16px',
    fontSize: 14,
    color: '#1a202c',
    minWidth: 60,
    height: 40,
    borderRadius: 4
  },
  volSection: {
    backgroundColor: '#f0e6ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 24,
    border: '1px solid #b794f4'
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
    color: '#1a202c'
  },
  smallTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15
  },
  cardInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  infoCard: {
    flex: 1,
    border: '1px solid #444',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    backgroundColor: '#1a202c',
    color: '#f7fafc'
  },
  lastInfoCard: {
    marginRight: 0
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    lineHeight: 1.5
  }
};

const CorrelationMatrix = () => {
  const [correlationData, setCorrelationData] = useState({ matrix: [], assets: [] });
  const [volatilityData, setVolatilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(CoinList('usd', 10));
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        const priceMap = {};
        data.forEach(coin => {
          if (coin.sparkline_in_7d?.price) {
            priceMap[coin.symbol.toUpperCase()] = coin.sparkline_in_7d.price;
          }
        });

        const { matrix, assets } = generateCorrelationMatrix(priceMap);
        setCorrelationData({ matrix, assets });
        setVolatilityData(calculateVolatilityMetrics(priceMap));
      } catch (err) {
        console.error('Error fetching correlation data:', err);
        setError('Failed to fetch correlation data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateVolatilityMetrics = (priceMap) => {
    const results = [];
    let btcAnnualVol = 0;
    const btcPrices = priceMap['BTC'];
    if (btcPrices && btcPrices.length > 5) {
      const btcReturns = [];
      for (let i = 1; i < btcPrices.length; i++) {
        btcReturns.push(btcPrices[i] / btcPrices[i - 1] - 1);
      }
      btcAnnualVol = ss.standardDeviation(btcReturns) * Math.sqrt(365);
    }

    Object.keys(priceMap).forEach(asset => {
      const prices = priceMap[asset];
      if (prices && prices.length > 5) {
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
          returns.push(prices[i] / prices[i - 1] - 1);
        }
        const dailyVol = ss.standardDeviation(returns);
        const annualVol = dailyVol * Math.sqrt(365);

        let peak = prices[0], maxDrawdown = 0;
        for (let i = 1; i < prices.length; i++) {
          if (prices[i] > peak) peak = prices[i];
          const dd = (peak - prices[i]) / peak;
          if (dd > maxDrawdown) maxDrawdown = dd;
        }

        const sorted = [...returns].sort((a, b) => a - b);
        const valueAtRisk = Math.abs(sorted[Math.floor(sorted.length * 0.05)]);

        const volRatio = btcAnnualVol > 0 ? (annualVol / btcAnnualVol) : 0;
        let riskCategory = 'Low';
        if (volRatio > 1.5) riskCategory = 'High';
        else if (volRatio > 1) riskCategory = 'Medium';

        results.push({
          asset,
          volatility: parseFloat((dailyVol * 100).toFixed(2)),
          annualizedVol: parseFloat((annualVol * 100).toFixed(2)),
          maxDrawdown: parseFloat((maxDrawdown * 100).toFixed(2)),
          valueAtRisk: parseFloat((valueAtRisk * 100).toFixed(2)),
          volatilityRatio: parseFloat(volRatio.toFixed(2)),
          riskCategory
        });
      }
    });
    return results.sort((a, b) => b.volatilityRatio - a.volatilityRatio);
  };

  const calculateCorrelation = (p1, p2) => {
    if (!p1 || !p2 || p1.length < 2 || p2.length < 2) return 0;
    const len = Math.min(p1.length, p2.length);
    const r1 = [], r2 = [];
    for (let i = 1; i < len; i++) {
      r1.push(p1[i] / p1[i - 1] - 1);
      r2.push(p2[i] / p2[i - 1] - 1);
    }
    return ss.sampleCorrelation(r1, r2);
  };

  const generateCorrelationMatrix = (priceMap) => {
    const assets = Object.keys(priceMap);
    return {
      assets,
      matrix: assets.map((a, i) =>
        assets.map((b, j) => (i === j ? 1 : calculateCorrelation(priceMap[a], priceMap[b])))
      )
    };
  };

  if (loading) return (
    <div style={styles.container}>
      <div style={{
        width:50, height:50,
        border:'5px solid #eee',
        borderTop:'5px solid #333',
        borderRadius:'50%',
        animation:'spin 1s linear infinite'
      }} />
    </div>
  );
  if (error) return (
    <div style={styles.container}>
      <p style={{ color:'red', fontSize:16, fontWeight:700 }}>{error}</p>
    </div>
  );

  const { matrix, assets } = correlationData;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📊 Cryptocurrency Correlation Matrix</h2>
        <p style={styles.paragraph}>Correlation is a statistical measure that expresses the extent to which two variables move in relation to each other. In cryptocurrency markets, correlation helps investors understand how the price of one cryptocurrency tends to change when another cryptocurrency's price changes.</p>
        <p style={styles.paragraph}><strong>Correlation Coefficients:</strong><br />+1: Perfect positive correlation<br />0: No correlation<br />-1: Perfect negative correlation</p>
        <p style={styles.paragraph}>In practice, most cryptocurrency pairs show positive correlation to some degree, with Bitcoin often influencing the broader market. Patterns can shift over time and during different conditions.</p>
        <ul style={styles.list}>
          <li><strong>Diversification:</strong> Select assets with low correlation to reduce portfolio risk.</li>
          <li><strong>Pairs Trading:</strong> Trade divergences expecting reversion.</li>
          <li><strong>Relative Strength:</strong> Compare correlated asset performance.</li>
          <li><strong>Sentiment:</strong> Correlation shifts may signal market dynamics.</li>
        </ul>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.headerCell}>Asset</th>
                {assets.map(a => <th key={a} style={styles.headerCell}>{a}</th>)}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i} style={{ animation:`fadeIn 1s ease ${i*0.1}s both` }}>
                  <td style={styles.assetCell}>{assets[i]}</td>
                  {row.map((v,j) => (
                    <td key={j} style={{
                      ...styles.cell,
                      backgroundColor: (v>0.8?'#2f855a':v>0.5?'#48bb78':v>0?'#9ae6b4':v===0?'#edf2f7':v>-0.5?'#90cdf4':v>-0.8?'#63b3ed':'#2b6cb0'),
                      fontWeight:700
                    }}>{i===j?'-':v.toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.volSection}>
          {/* Info cards above volatility table */}
          <div style={styles.cardInfoContainer}>
            <div style={styles.infoCard}>
              <div style={styles.infoTitle}>↻ Arithmetic Returns & Annualization</div>
              <div style={styles.infoText}>
                Returns = (pₜ / pₜ₋₁) - 1<br/>
                Daily σ = stddev(returns)<br/>
                Annual σ = daily σ × √365
              </div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoTitle}>⚖️ Value at Risk (VaR)</div>
              <div style={styles.infoText}>
                Historical 95% VaR = absolute 5th percentile of sorted daily returns
              </div>
            </div>
            <div style={{ ...styles.infoCard, ...styles.lastInfoCard }}>
              <div style={styles.infoTitle}>📉 Max Drawdown</div>
              <div style={styles.infoText}>
                Peak‑to‑trough decline = max((peak_before_t - pₜ) / peak_before_t)
              </div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Volatility Risk Analysis</h3>
          <table style={styles.smallTable}>
            <thead>
              <tr style={{ backgroundColor:'#805ad5' }}>
                {['Asset','Daily Vol (%)','Annual Vol (%)','Max Drawdown (%)','Value at Risk (%)','Vol/BTC Ratio','Risk Category'].map((h,i) => (
                  <th key={i} style={{
                    ...styles.headerCell,
                    padding:'10px 12px',
                    color:'#f7fafc',
                    backgroundColor:'#805ad5',
                    fontWeight:700,
                    borderTopLeftRadius: i===0?6:0,
                    borderTopRightRadius: i===6?6:0
                  }}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {volatilityData.map((d,i) => (
                <tr key={i} style={{ backgroundColor:i%2===0?'#f8f4ff':'#ede4ff' }}>
                  {[d.asset, d.volatility+'%', d.annualizedVol+'%', d.maxDrawdown+'%', d.valueAtRisk+'%', d.volatilityRatio, d.riskCategory].map((val,j) => (
                    <td key={j} style={{
                      ...styles.cell,
                      fontWeight: j===6?700:600,
                      color: j===6?'#fff':styles.cell.color,
                      backgroundColor: j===6
                        ? (d.riskCategory==='High'   ? '#e53e3e'
                           : d.riskCategory==='Medium'? '#dd6b20'
                           : '#38a169')
                        : undefined
                    }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;
