'use client'
import AuthLayout from '@/components/authLayout';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Alert from '@mui/material/Alert';

export default function Login() {
    const [isReady, setIsReady] = useState(false);
    const [inputs, setInputs] = useState({});
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        setInputs({...inputs, [e.target.id]: e.target.value});
    }

    const checkKeyPress = (e) => {
        const { key, keyCode } = e;
        if (keyCode === 13) {
          handleSubmit();
        }
    };

    const handleSubmit = (e) => {
        let m = false;
        let p = false;
        if (document.getElementById('email').checkValidity() == false) m = true;
        if (document.getElementById('password').checkValidity() == false) p = true;
        setInvalidEmail(m);
        setInvalidPassword(p);
        if (m || p) return;
        setIsReady(false);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, inputs)
        .then(res => {
            const cookies = new Cookies();
            cookies.set('user', {id: res.data.user, access: res.data.access, token: res.data.token}, { path: '/' });
            router.push('/projects');
        })
        .catch(err => {
            setIsReady(true);
            setError(err.response.data.message);
        });
    }
    
    useEffect(() => {
        setIsReady(true);
    }
    , []);

    return (
        <AuthLayout>
                <Card sx={{ minWidth: 275, maxWidth: '100vw', width: 550, minHeight: 440, my: 3 }}>
                    {!isReady && (<CardContent>
                        <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 400
                        }}
                        >
                            <CircularProgress />
                        </Box>
                    </CardContent>)}
                    {isReady && (<CardContent>
                        <Box
                        component='form'
                        sx={{
                            '& .MuiTextField-root': { my: 1, width: '100%' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '0, 50',
                            minHeight: 400
                        }}
                        noValidate
                        autoComplete='off'
                        onKeyDown={checkKeyPress}
                        >
                            <Box sx={{my: 3}}>
                                <Typography variant="h5" component="div">
                                    Log In
                                </Typography>
                                <Typography variant="body2" component="div" color='gray'>
                                    Tracking app
                                </Typography>
                            </Box>
                            {error && (<Alert severity="error">{error}</Alert>)}
                            <Box>
                                <TextField
                                required
                                id='email'
                                label='Email'
                                type='email'
                                value={inputs?.email}
                                onChange={handleChange}
                                error={invalidEmail}
                                helperText={invalidEmail ? 'Please enter your email' : '' }
                                />
                                <TextField
                                required
                                id='password'
                                label='Password'
                                type='password'
                                value={inputs?.password}
                                onChange={handleChange}
                                error={invalidPassword}
                                helperText={invalidPassword ? 'Please enter your password' : '' }
                                />
                            </Box>
                            <Button variant='contained' color='primary' sx={{my: 3, py: 1 }} onClick={handleSubmit}>Login</Button>
                            <Link href='/auth/reset' variant='body2' color='secondary'>Forgot password?</Link>
                    </Box>
                </CardContent>)}
                </Card>
        </AuthLayout>
    );
}