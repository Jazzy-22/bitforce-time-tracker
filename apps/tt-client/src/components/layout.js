'use client'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Navigation from './navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

export const theme = createTheme({
    palette: {
      primary: {
        main: '#6500CD',
        light: '#6500CD',
        dark: '#6500CD',
        color: '#6500CD',
      },
      secondary: {
        main: '#02105E',
      },
      white: {
        main: '#FFFFFF',
        color: '#FFFFFF',
      },
      background: {
        default: '#02105E',
      },
      offWhite: {
        main: '#F5F5F5',
      },
      lightGray: {
        main: '#E0E0E0',
      },
    },
  });

export default function Layout({ header, children }) {
  const [firstLoad, setFirstLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();
  useEffect(() => {
    if (!cookies.get('user')) {
      router.push('/login');
    } else {
      setFirstLoad(true);
    }
  }, []);

  useEffect(() => {
    if (firstLoad) {
      const c = cookies.get('user');
      axios.defaults.headers.common['Authorization'] = `Bearer ${c.token}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/verify')
        .then(async (res) => {
          if (res.data.data.update) {
            await axios.get(process.env.NEXT_PUBLIC_API_URL + '/auth/refresh', { headers: { 'Authorization': `Bearer ${c.token}` } })
            .then(res => {
              cookies.set('user', {id: res.data.user, access: res.data.access, token: res.data.token}, { path: '/' });
            })
            .catch(() => {
              cookies.remove('user');
              router.push('/login');
            });
          }
          setIsReady(true);
        })
        .catch(() => {
          cookies.remove('user');
          router.push('/login');
        });
    }
  }, [firstLoad]);
  
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {isReady && <Navigation header={header}>{children}</Navigation>}
    </ThemeProvider>
  );
}