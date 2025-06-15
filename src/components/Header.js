import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Divider, makeStyles } from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  Mood as MoodIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Timeline as CorrelationIcon,
  TrendingUp as TrendingUpIcon
} from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: { width: drawerWidth, flexShrink: 0 },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#111',
    borderRight: '2px solid #FFD700',
    color: '#fff',
    boxShadow: 'none',
  },
  logo: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 800,
    fontSize: '1.5rem',
    color: '#0e0be0',
    textAlign: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textDecoration: 'none',
  },
  navItem: {
    margin: theme.spacing(1, 0),
    borderRadius: 8,
    transition: 'all 0.2s ease',
    '&:hover': { backgroundColor: 'rgba(255,215,0,0.15)', transform: 'translateX(4px)' },
  },
  activeItem: {
    backgroundColor: 'rgba(255,215,0,0.22)',
    borderLeft: '4px solid #FFD700',
  },
  icon: { color: '#FFD700', minWidth: 36 },
  itemText: { fontWeight: 700, fontSize: '1.05rem' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: theme.spacing(2) },
  footerLink: { color: '#FFD700', textDecoration: 'none', display: 'flex', alignItems: 'center', marginBottom: theme.spacing(1) },
  copyright: { fontSize: '0.8rem', opacity: 0.85, textAlign: 'center', marginTop: theme.spacing(1) }
}));

export default function Sidebar() {
  const classes = useStyles();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    setShowSidebar(location.pathname === '/');
  }, [location.pathname]);

  if (!showSidebar) return null;

  return (
    <Drawer variant="permanent" anchor="left" classes={{ paper: classes.drawerPaper }} style={{ width: drawerWidth }}>
      <Typography variant="h6" className={classes.logo} component={Link} to="/">Crypto Pulse</Typography>
      <Divider style={{ backgroundColor: 'rgba(255,215,0,0.3)' }} />
      <List>
        <ListItem button component={Link} to="/" className={`${classes.navItem} ${location.pathname === '/' ? classes.activeItem : ''}`}>        
          <ListItemIcon className={classes.icon}><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" classes={{ primary: classes.itemText }} />
        </ListItem>
        <ListItem button component={Link} to="/mood" className={`${classes.navItem} ${location.pathname === '/mood' ? classes.activeItem : ''}`}>        
          <ListItemIcon className={classes.icon}><MoodIcon /></ListItemIcon>
          <ListItemText primary="Mood Analysis" classes={{ primary: classes.itemText }} />
        </ListItem>
        <ListItem button component={Link} to="/correlation" className={`${classes.navItem} ${location.pathname === '/correlation' ? classes.activeItem : ''}`}>        
          <ListItemIcon className={classes.icon}><CorrelationIcon /></ListItemIcon>
          <ListItemText primary="Correlation Matrix & Volatility" classes={{ primary: classes.itemText }} />
        </ListItem>
      </List>
      <Box className={classes.footer}>
        <Divider style={{ backgroundColor: 'rgba(255,215,0,0.3)', marginBottom: 12 }} />
        <Box>
          <Link to="/about-us" className={classes.footerLink}><InfoIcon fontSize="small" style={{ marginRight: 8 }} />About Us</Link>
          <Link to="/terms-of-service" className={classes.footerLink}><DescriptionIcon fontSize="small" style={{ marginRight: 8 }} />Terms of Service</Link>
          <Link to="/disclaimer" className={classes.footerLink}><WarningIcon fontSize="small" style={{ marginRight: 8 }} />Disclaimer</Link>
        </Box>
        <Typography variant="body2" className={classes.copyright}>&copy; 2025 Crypto Pulse. All rights reserved.</Typography>
      </Box>
    </Drawer>
  );
}
