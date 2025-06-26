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

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
  drawer: { 
    width: drawerWidth, 
    flexShrink: 0,
    zIndex: 1200,
  },
  drawerPaper: {
    width: drawerWidth,
    background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 30%, #1a4d1a 60%, #10b981 100%)',
    borderRight: '2px solid rgba(16, 185, 129, 0.3)',
    color: '#ffffff',
    boxShadow: '4px 0 20px rgba(16, 185, 129, 0.2)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    top: 0,
    left: 0,
  },
  logo: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '1.8rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #10b981 50%, #ffffff 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    padding: theme.spacing(3, 2),
    marginBottom: theme.spacing(1),
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'block',
    '&:hover': {
      transform: 'scale(1.05)',
      textShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
    }
  },
  navList: {
    padding: theme.spacing(1, 2),
    flex: 1,
  },
  navItem: {
    margin: theme.spacing(0.5, 0),
    borderRadius: 16,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    backdropFilter: 'blur(5px)',
    '&:hover': { 
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      transform: 'translateX(8px) scale(1.02)',
      border: '1px solid rgba(16, 185, 129, 0.4)',
      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
    },
  },
  activeItem: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderLeft: '4px solid #10b981',
    border: '1px solid rgba(16, 185, 129, 0.5)',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
    transform: 'translateX(4px)',
  },
  icon: { 
    color: '#10b981',
    minWidth: 40,
    transition: 'all 0.3s ease',
    '& .MuiSvgIcon-root': {
      fontSize: '1.4rem',
    }
  },
  activeIcon: {
    color: '#ffffff',
    filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))',
  },
  itemText: { 
    fontWeight: 600,
    fontSize: '0.95rem',
    fontFamily: "'Inter', sans-serif",
    '& .MuiTypography-root': {
      color: '#e0e0e0',
      transition: 'color 0.3s ease',
    }
  },
  activeItemText: {
    '& .MuiTypography-root': {
      color: '#ffffff',
      fontWeight: 700,
    }
  },
  divider: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    margin: theme.spacing(2, 0),
  },
  footer: { 
    marginTop: 'auto',
    width: '100%',
    padding: theme.spacing(2),
    background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
    backdropFilter: 'blur(10px)',
  },
  footerLinks: {
    marginBottom: theme.spacing(2),
  },
  footerLink: { 
    color: '#cccccc',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0.5, 1),
    borderRadius: 8,
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      transform: 'translateX(4px)',
    },
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1),
      fontSize: '1.1rem',
    }
  },
  copyright: { 
    fontSize: '0.75rem',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: theme.spacing(1),
    color: '#999999',
    fontFamily: "'Inter', sans-serif",
  }
}));

export default function Sidebar() {
  const classes = useStyles();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const showOnRoutes = ['/', '/mood', '/correlation', '/about-us', '/terms-of-service', '/disclaimer'];
    setShowSidebar(showOnRoutes.includes(location.pathname));
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  if (!showSidebar) return null;

  return (
    <Drawer 
      variant="permanent" 
      anchor="left" 
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <Typography 
        variant="h6" 
        className={classes.logo} 
        component={Link} 
        to="/"
      >
        Crypto Pulse
      </Typography>
      
      <Divider className={classes.divider} />
      
      <List className={classes.navList}>
        <ListItem 
          button 
          component={Link} 
          to="/" 
          className={`${classes.navItem} ${isActive('/') ? classes.activeItem : ''}`}
        >        
          <ListItemIcon className={`${classes.icon} ${isActive('/') ? classes.activeIcon : ''}`}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Dashboard" 
            className={`${classes.itemText} ${isActive('/') ? classes.activeItemText : ''}`}
          />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/mood" 
          className={`${classes.navItem} ${isActive('/mood') ? classes.activeItem : ''}`}
        >        
          <ListItemIcon className={`${classes.icon} ${isActive('/mood') ? classes.activeIcon : ''}`}>
            <MoodIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Mood Analysis" 
            className={`${classes.itemText} ${isActive('/mood') ? classes.activeItemText : ''}`}
          />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/correlation" 
          className={`${classes.navItem} ${isActive('/correlation') ? classes.activeItem : ''}`}
        >        
          <ListItemIcon className={`${classes.icon} ${isActive('/correlation') ? classes.activeIcon : ''}`}>
            <CorrelationIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Correlation & Volatility" 
            className={`${classes.itemText} ${isActive('/correlation') ? classes.activeItemText : ''}`}
          />
        </ListItem>
      </List>
      
      <Box className={classes.footer}>
        <Divider className={classes.divider} />
        <Box className={classes.footerLinks}>
          <Link to="/about-us" className={classes.footerLink}>
            <InfoIcon />
            About Us
          </Link>
          <Link to="/terms-of-service" className={classes.footerLink}>
            <DescriptionIcon />
            Terms of Service
          </Link>
          <Link to="/disclaimer" className={classes.footerLink}>
            <WarningIcon />
            Disclaimer
          </Link>
        </Box>
        <Typography variant="body2" className={classes.copyright}>
          &copy; 2025 Crypto Pulse. All rights reserved.
        </Typography>
      </Box>
    </Drawer>
  );
}

export { drawerWidth };
