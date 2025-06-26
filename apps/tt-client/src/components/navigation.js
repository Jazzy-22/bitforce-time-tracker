'use client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { Collapse } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import Cookies from 'universal-cookie';
import { usePathname, useRouter } from 'next/navigation';

function Navigation({ header, children }) {
    const drawerWidth = 240;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [anchorElNot, setAnchorElNot] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [access, setAccess] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [open, setOpen] = useState(false);
    const cookies = new Cookies();
    const router = useRouter();
    const pathname = usePathname();
  
    const handleOpenNotMenu = (event) => {
      setAnchorElNot(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
    const handleCloseNotMenu = () => {
      setAnchorElNot(null);
    };
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
    const handleDrawerClose = () => {
      setIsClosing(true);
      setMobileOpen(false);
    };
    const handleClick = () => {
      setOpen(!open);
    };

    const handleDrawerTransitionEnd = () => {
      setIsClosing(false);
    };

    const handleDrawerToggle = () => {
      if (!isClosing) {
        setMobileOpen(!mobileOpen);
      }
    };

    const handleLogout = () => {
      cookies.remove('user');
      router.push('/login');
    };

    useEffect(() => {
      const c = cookies.get('user');
      if (!c) {
        router.push('/login');
      } else {
        setAccess(c.access);
      }
    }, []);

    useEffect(() => {
      if (access) {
        setIsReady(true);
        if (pathname.substring(0,6) == '/users') {
          setOpen(true);
        }
      }
    }, [access]);

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      {access?.includes('VTT') && (<List>
          <ListItem key='time-tracker' disablePadding>
            <ListItemButton href='/time-tracker' selected={pathname == '/time-tracker' ? true : false }>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary={'Time Tracker'} />
            </ListItemButton>
          </ListItem>
          <ListItem key='timesheet' disablePadding>
            <ListItemButton href='/timesheet' selected={pathname == '/timesheet' ? true : false }>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary={'Timesheet'} />
            </ListItemButton>
          </ListItem>
          <ListItem key='time-off' disablePadding>
            <ListItemButton href='/time-off' selected={pathname == '/time-off' ? true : false }>
              <ListItemIcon>
                <ErrorOutlineIcon />
              </ListItemIcon>
              <ListItemText primary={'Time Off'} />
            </ListItemButton>
          </ListItem>
      </List>)}
      {access?.includes('VU' || 'VP' || 'VR' || 'VT' || 'VJ') && access?.includes('vtt') && (<Divider />)}
      <List>
          {access?.includes('VU' || 'VP' || 'VR' || 'VT') && (<>
          <ListItem key='users' disablePadding>
            <ListItemButton selected={pathname.substring(0,6) == '/users' ? true : false } onClick={handleClick}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary={'Users'} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List>
                    <ListItem key='profiles'>
                        <ListItemButton href='/users/profiles' selected={pathname == '/users/profiles' ? true : false }>
                            <ListItemText inset primary={'Profiles'} primaryTypographyProps={{fontSize: '14px' }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='roles'>
                        <ListItemButton href='/users/roles' selected={pathname == '/users/roles' ? true : false }>
                            <ListItemText inset primary={'Roles'} primaryTypographyProps={{fontSize: '14px'}} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='teams'>
                        <ListItemButton href='/users/teams' selected={pathname == '/users/teams' ? true : false }>
                            <ListItemText inset primary={'Teams'} primaryTypographyProps={{fontSize: '14px'}} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='users'>
                        <ListItemButton href='/users/users' selected={pathname == '/users/users' ? true : false }>
                            <ListItemText inset primary={'Users'} primaryTypographyProps={{fontSize: '14px'}} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Collapse>
          </>)}
          {access?.includes('VJ') && (<ListItem key='projects' disablePadding>
            <ListItemButton href='/projects' selected={pathname.substring(0,9) == '/projects' ? true : false }>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary='Projects' />
            </ListItemButton>
          </ListItem>)}
      </List>
    </div>
  );

  return (
    <>
    {isReady && (<>
            <AppBar position="fixed" color='white' style={{width: '100vw', height: '64px', padding: 0, margin: 0, zIndex: 1201 }}>
            <Toolbar sx={{ height: '100%' }}>
                <Box sx={{ flexGrow: 1, height: '100%', py: 0, my: 0 }}>
                  <Box sx={{ flexGrow: 0, display: {xs: 'none', md: 'flex', height: '100%', alignItems: 'center' } }}>
                      <Image src="/logos/bitforce.svg" alt="TimeTrack by BitForce" width={46} height={46} />
                  </Box>
                  <Box sx={{ flexGrow: 0, display: {xs: 'flex', md: 'none', height: '100%', alignItems: 'center' } }}>
                      <Image src="/logos/bitforce.svg" alt="TimeTrack by BitForce" width={46} height={46} onClick={handleDrawerToggle} />
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open notifications">
                    <IconButton onClick={handleOpenNotMenu} sx={{ p: 0, mx:1.5 }}>
                        <NotificationsIcon fontSize='large' color='grey' className='m-2' />
                    </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElNot}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElNot)}
                    onClose={handleCloseNotMenu}
                    >
                    <MenuItem onClick={handleCloseNotMenu}>
                        <Typography textAlign="center">No new notifications</Typography>
                    </MenuItem>
                    </Menu>
                    <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        {//<Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                        }
                        <PersonIcon fontSize='large' color='grey' className='m-2' />
                    </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                      <MenuItem key='profile' onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Profile</Typography>
                      </MenuItem>
                      <MenuItem key='logout' onClick={handleLogout}>
                        <Typography textAlign="center">Logout</Typography>
                      </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>

    <Box sx={{ display: 'flex' }}>

      {access && (<Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>)}
      <Box
        component="main"
        sx={{ display: 'flex', width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', flexDirection: 'column', padding: { xs: 2, sm: 3 } }}
      >
        <Box sx={{ flexGrow: 0 }}>
          <Toolbar sx={{ height: '64px' }}/>
          {header}
        </Box>
        <Box sx={{ flexGrow: 1, sm: { m: 0, p: 0 } }}>{children}</Box>
      </Box>
    </Box>
    </>)}
    </>
  );
}

export default Navigation;
