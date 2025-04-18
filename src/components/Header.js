import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Divider, makeStyles } from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  Mood as MoodIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon
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
    letterSpacing: 1,
    marginBottom: theme.spacing(1),
    background: 'transparent',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
    '&:hover': { color: '#2b2bf3' }
  },
  navItem: {
    margin: theme.spacing(1, 0),
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.15)',
      color: '#FFD700',
      transform: 'translateX(4px)',
      '& $icon': { color: '#FFD700' },
    }
  },
  activeItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.22)',
    borderLeft: '4px solid #FFD700',
    color: '#FFD700',
    '& $icon': { color: '#FFD700' }
  },
  icon: { color: '#FFD700', minWidth: 36 },
  itemText: { fontWeight: 700, fontSize: '1.05rem' },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: theme.spacing(2),
    background: 'transparent'
  },
  footerLinks: { marginBottom: theme.spacing(1) },
  footerLink: {
    color: '#FFD700',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '0.92rem',
    padding: theme.spacing(0.5, 0),
    transition: 'color 0.2s, transform 0.2s',
    '&:hover': { color: '#fff700', transform: 'translateX(3px)' }
  },
  copyright: {
    fontSize: '0.8rem',
    opacity: 0.85,
    textAlign: 'center',
    marginTop: theme.spacing(1),
    color: '#fff'
  }
}));

export default function Sidebar() {
  const classes = useStyles();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);
  useEffect(() => { setShowSidebar(location.pathname === '/'); }, [location.pathname]);
  if (!showSidebar) return null;
  return (
    <Drawer className={classes.drawer} variant='permanent' anchor='left' classes={{ paper: classes.drawerPaper }}>
      <Typography variant='h6' className={classes.logo} component={Link} to='/' style={{ textDecoration: 'none' }}>Crypto Pulse</Typography>
      <Divider style={{ backgroundColor: 'rgba(255, 215, 0, 0.3)' }} />
      <List>
        <ListItem button className={`${classes.navItem} ${location.pathname === '/' ? classes.activeItem : ''}`} component={Link} to='/'>
          <ListItemIcon className={classes.icon}><DashboardIcon /></ListItemIcon>
          <ListItemText primary='Dashboard' classes={{ primary: classes.itemText }} />
        </ListItem>
        <ListItem button className={`${classes.navItem} ${location.pathname === '/mood' ? classes.activeItem : ''}`} component={Link} to='/mood'>
          <ListItemIcon className={classes.icon}><MoodIcon /></ListItemIcon>
          <ListItemText primary='Mood Analysis' classes={{ primary: classes.itemText }} />
        </ListItem>
      </List>
      <Box className={classes.footer}>
        <Divider style={{ backgroundColor: 'rgba(255, 215, 0, 0.3)', marginBottom: '12px' }} />
        <Box className={classes.footerLinks}>
          <Link to='/about-us' className={classes.footerLink}><InfoIcon fontSize='small' style={{ marginRight: 8 }} />About Us</Link>
          <Link to='/terms-of-service' className={classes.footerLink}><DescriptionIcon fontSize='small' style={{ marginRight: 8 }} />Terms of Service</Link>
          <Link to='/disclaimer' className={classes.footerLink}><WarningIcon fontSize='small' style={{ marginRight: 8 }} />Disclaimer</Link>
        </Box>
        <Typography variant='body2' className={classes.copyright}>&copy; 2025 Crypto Pulse. All rights reserved.</Typography>
      </Box>
    </Drawer>
  );
}
