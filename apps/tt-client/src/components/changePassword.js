'use client'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import AuthLayout from '@/components/authLayout';

export default function ChangePassword({ firstResponse, recoveryToken, email }) {
    const [isReady, setIsReady] = useState(true);
    const [inputs, setInputs] = useState({});
    const [formError, setFormError] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.id]: e.target.value
        })
    }

    const checkKeyPress = (e) => {
        const { key, keyCode } = e;
        if (keyCode === 13) {
          handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (inputs.password !== inputs.confirm) {
            setFormError(true);
            return;
        }
        setFormError(false);
        setIsReady(false);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/change`, {
            email: email,
            new_password: inputs.password,
            recovery_token: recoveryToken
        })
        .then(res => {
            setOpen(true);
            setTimeout(() => {
                router.push('/login');
            }, 5000);
        })
        .catch(err => {
            console.log(err.response.data);
        })
        .finally(() => {
            setIsReady(true);
        });
    }


    return (
        <AuthLayout>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={() => setOpen(false)}
                message='Password changed successfully! You will be redirected to the login page.'
            />
            <Card sx={{ minWidth: 275, maxWidth: '80vw', width: 550, minHeight: 440, my: 3 }}>
                {!isReady && (<CardContent>
                    <Box sx={
                        {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 400
                    }}>
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
                    autoComplete='off'
                    id='activation-form'
                    onKeyDown={checkKeyPress}
                    >
                        <Box sx={{my: 3}}>
                            <Typography variant="h5" component="div">
                                {firstResponse?.title}
                            </Typography>
                            <Typography variant="body2" component="div" color='gray'>
                                {firstResponse?.message}
                            </Typography>
                        </Box>
                        <Box>
                            <TextField
                            required
                            id='password'
                            label='Password'
                            type='password'
                            value={inputs?.password}
                            onChange={handleChange}
                            error={formError}
                            />
                            <TextField
                            required
                            id='confirm'
                            label='Confirm Password'
                            type='password'
                            value={inputs?.confirm}
                            onChange={handleChange}
                            error={formError}
                            helperText={formError && 'Passwords do not match'}
                            />
                        </Box>
                        <Button variant='contained' color='primary' sx={{my: 3, py: 1 }} onClick={handleSubmit}>Save</Button>
                    </Box>
                </CardContent>)}
            </Card>
        </AuthLayout>
    );
}