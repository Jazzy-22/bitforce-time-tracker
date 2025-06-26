'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { theme } from './layout';
import { useEffect, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';


function ManagerHeader({ section, title }) {
  const [icon, setIcon] = useState(null);

  const icons = {
    'Time Tracker': <AccessTimeIcon />,
    'Timesheet': <CalendarTodayIcon />,
    'Time Off': <ErrorOutlineIcon />,
    'Users': <PeopleIcon />,
    'Projects': <WorkIcon />,
  };

  useEffect(() => {
    const str = section.substring(0, (section.indexOf('/') > 0 ? section.indexOf('/')-1 : section.length));
    setIcon(icons[str]);
  }, [section]);
  
  return (
    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
      <Box sx={
        { display: 'flex', flexDirection: 'row', alignItems: 'start', gap: 1, mb: 0, color: theme.palette.white.main }
      }>
        {icon}
        <Typography variant='subtitle1'>{section}</Typography>
      </Box>
      <Typography variant='h4' sx={{ mb: 3, color: theme.palette.white.main }}>{title}</Typography>
    </Box>
  );
}

export default ManagerHeader;
