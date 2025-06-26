'use client'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

const theme = createTheme({
    palette: {
      background: {
        default: '#02105E',
      },
      primary: {
        main: '#6500CD',
      },
      secondary: {
        main: '#02105E',
      },
    },
  });

export default function AuthLayout({ children }) {
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Box sx={{
                    my: 3,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    }}>
                    <Image
                    src='/logos/bitforce-white.svg'
                    alt='BitForce logo'
                    width={150}
                    height={150}
                    style={{marginRight: 20}}
                    />
                    <Image
                    src='/stopwatch-outline.svg'
                    alt='stopwatch icon'
                    width={150}
                    height={150}
                    style={{marginLeft: 20}}
                    />
                </Box>
                {children}
                <Box sx={{my: 3, 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Typography variant="h5" component="div" color='lightgray'>
                        BitForce 2024
                    </Typography>
                    <Typography variant="body2" component="div" color='gray'>
                        Copyright ©
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}