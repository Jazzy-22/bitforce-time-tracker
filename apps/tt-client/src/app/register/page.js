'use client'
import AuthLayout from '@/components/authLayout';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const [inputs, setInputs] = useState({})
    const [showForm, setShowForm] = useState(true);
    const [content, setContent] = useState(null);
    const [first_name, setFirstName] = useState(true);
    const [last_name, setLastName] = useState(true);
    const [email, setEmail] = useState(true);

    const spinner = () => {
        return (
            <Box sx={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400
            }}>
                <CircularProgress />
            </Box>
        )
    }

    const successMessage = (success) => {
        return (
            <Box sx={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400
            }}>
                <Typography variant='h5' component='div'>
                    {success ? 'Success' : 'Error'}
                </Typography>
                <Typography variant='body2' component='div'>
                    {success ? 
                    'You have successfully registered. Please check your email to verify your account.' : 
                    'There was an error registering your account. Please try again later.'}
                </Typography>
            </Box>
        )
    }

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
        const first_name = document.getElementById('first_name').checkValidity();
        const last_name = document.getElementById('last_name').checkValidity();
        const email = document.getElementById('email').checkValidity();
        setFirstName(first_name);
        setLastName(last_name);
        setEmail(email);
        if (!first_name || !last_name || !email) {
            return;
        }

        setShowForm(false);
        setContent(spinner);
        axios.post(process.env.NEXT_PUBLIC_API_URL + '/auth/register', inputs, { headers: { 'Content-Type': 'application/json' } })
        .then((res) => {
            if (res.data.status === 'success') {
                setContent(successMessage(true));
            } else {
                setContent(successMessage(false));
            }
        })
        .catch((err) => {
            console.log(err);
            setContent(successMessage(false));
        })
        .finally(() => {
        })
    }

    return (
        <AuthLayout>
                <Card sx={{ minWidth: 275, maxWidth: '80vw', width: 550, minHeight: 440, my: 3 }}>
                    <CardContent>
                        {showForm && (<Box
                        component='form'
                        id='register-form'
                        sx={{
                            '& .MuiTextField-root': { my: 1, width: '100%' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '0, 50',
                            minHeight: 400
                        }}
                        autoComplete='off'
                        onKeyDown={checkKeyPress}
                        >
                            <Box sx={{my: 3}}>
                                <Typography variant="h5" component="div">
                                    Sign up
                                </Typography>
                                <Typography variant="body2" component="div" color='gray'>
                                    Tracking app
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid xs={12} md={6}>
                                    <TextField
                                    required
                                    id='first_name'
                                    label='First Name'
                                    value={inputs?.first_name}
                                    onChange={handleChange}
                                    error={!first_name}
                                    />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                    id='middle_name'
                                    label='Middle Name'
                                    value={inputs?.middle_name}
                                    onChange={handleChange}
                                    />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                    required
                                    id='last_name'
                                    label='Last Name'
                                    value={inputs?.last_name}
                                    onChange={handleChange}
                                    error={!last_name}
                                    />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                    required
                                    id='email'
                                    label='Email'
                                    type='email'
                                    value={inputs?.email}
                                    onChange={handleChange}
                                    error={!email}
                                    />
                                </Grid>
                            </Grid>
                            <Button variant='contained' color='primary' sx={{my: 3, py: 1 }} onClick={handleSubmit}>Sign Up</Button>
                        </Box>)}
                        {content}
                    </CardContent>
                </Card>
        </AuthLayout>
    );
}