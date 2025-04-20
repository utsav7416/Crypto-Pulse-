import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Box, Typography, Grid, Paper, Button
} from '@material-ui/core';
import {
  ArrowDownIcon, BarChart4Icon, TrendingUpIcon
} from 'lucide-react';

const initialMoodData = [
  { time: '00:00', fear: 65, greed: 35, neutral: 50 },
  { time: '04:00', fear: 55, greed: 45, neutral: 48 },
  { time: '08:00', fear: 45, greed: 55, neutral: 52 },
  { time: '12:00', fear: 35, greed: 65, neutral: 55 },
  { time: '16:00', fear: 48, greed: 52, neutral: 49 },
  { time: '20:00', fear: 58, greed: 42, neutral: 51 },
];

export default function Mood() {
  const [moodData, setMoodData] = useState(initialMoodData);
  const [currentView, setCurrentView] = useState('24h');
  const latestData = moodData[moodData.length - 1];

  const changeTimeframe = (timeframe) => {
    setCurrentView(timeframe);
    if (timeframe === '7d') {
      setMoodData(initialMoodData.map(item => ({
        ...item,
        fear: item.fear * 0.9,
        greed: item.greed * 1.1,
        neutral: item.neutral * 1.05
      })));
    } else if (timeframe === '30d') {
      setMoodData(initialMoodData.map(item => ({
        ...item,
        fear: item.fear * 0.7,
        greed: item.greed * 1.3,
        neutral: item.neutral * 0.95
      })));
    } else {
      setMoodData(initialMoodData);
    }
  };

  return (
    <Box minHeight="100vh" p={4} style={{ background: 'linear-gradient(to bottom right, #0f0f0f,rgb(8, 1, 1))' }}>
      <Box maxWidth="lg" mx="auto">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{
          fontWeight: 700,
          color: '#5090fa' 
        }}
      >
        Market Mood Analysis
      </Typography>



        <Box mt={4} mb={6} p={3} borderRadius={16} boxShadow={6} style={{ backgroundColor: 'rgba(55, 65, 81, 0.5)', backdropFilter: 'blur(6px)' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="body1" style={{ color: '#ccc' }}>
              Dynamic visualization of market sentiment indicators showing the balance between fear and greed in the crypto market.
            </Typography>
            <Box display="flex" gap={1}>
              {['24h', '7d', '30d'].map(view => (
                <Button
                  key={view}
                  variant={currentView === view ? 'contained' : 'outlined'}
                  onClick={() => changeTimeframe(view)}
                  style={{
                    color: currentView === view ? '#fff' : '#1e3a8a',
                    backgroundColor: currentView === view ? '#1e3a8a' : 'transparent',
                    borderColor: '#1e3a8a',
                    marginLeft: 8,
                  }}
                >
                  {view.toUpperCase()}
                </Button>
              ))}
            </Box>
          </Box>

          <Box height={500} width="100%" mb={5}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={moodData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }} />
                <Legend />
                <Area type="monotone" dataKey="fear" stroke="#ff4d4d" fill="#ff4d4d" fillOpacity={0.5} />
                <Area type="monotone" dataKey="greed" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.5} />
                <Area type="monotone" dataKey="neutral" stroke="#FFD700" fill="#FFD700" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={4} style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)', padding: 16, borderRadius: 12 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography style={{ color: '#ff4d4d', fontWeight: 600 }}>Fear Index</Typography>
                  <ArrowDownIcon style={{ color: '#ff4d4d' }} />
                </Box>
                <Typography variant="h5" style={{ color: '#fff' }}>{latestData.fear.toFixed(1)}%</Typography>
                <Typography variant="body2" style={{ color: '#aaa' }}>Market uncertainty</Typography>
                <Box mt={2} height={8} borderRadius={4} style={{ background: '#333' }}>
                  <Box height={8} borderRadius={4} style={{ width: `${latestData.fear}%`, background: 'linear-gradient(to right, #ff4d4d, #ff1a1a)' }} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={4} style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', padding: 16, borderRadius: 12 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography style={{ color: '#FFD700', fontWeight: 600 }}>Neutral Zone</Typography>
                  <BarChart4Icon style={{ color: '#FFD700' }} />
                </Box>
                <Typography variant="h5" style={{ color: '#fff' }}>{latestData.neutral.toFixed(1)}%</Typography>
                <Typography variant="body2" style={{ color: '#aaa' }}>Balanced sentiment</Typography>
                <Box mt={2} height={8} borderRadius={4} style={{ background: '#333' }}>
                  <Box height={8} borderRadius={4} style={{ width: `${latestData.neutral}%`, background: 'linear-gradient(to right, #FFD700, #FFC300)' }} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={4} style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: 16, borderRadius: 12 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography style={{ color: '#4CAF50', fontWeight: 600 }}>Greed Index</Typography>
                  <TrendingUpIcon style={{ color: '#4CAF50' }} />
                </Box>
                <Typography variant="h5" style={{ color: '#fff' }}>{latestData.greed.toFixed(1)}%</Typography>
                <Typography variant="body2" style={{ color: '#aaa' }}>Market optimism</Typography>
                <Box mt={2} height={8} borderRadius={4} style={{ background: '#333' }}>
                  <Box height={8} borderRadius={4} style={{ width: `${latestData.greed}%`, background: 'linear-gradient(to right, #4CAF50, #2E7D32)' }} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
