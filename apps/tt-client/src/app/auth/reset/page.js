'use client'
import AuthLayout from "@/components/authLayout";
import { useEffect, useState } from "react";
import { Box, Card, CardContent, CircularProgress, TextField, Button, Typography } from "@mui/material";
import { Alert } from "@mui/material";
import axios from "axios";

export default function Reset() {
    const [isReady, setIsReady] = useState(false);
    const [inputs, setInputs] = useState({});
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [response, setResponse] = useState(null);

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
        if (document.getElementById('email').checkValidity() == false) {
            setInvalidEmail(true);
            return;
        }
        setIsReady(false);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot/${inputs.email}`)
        .then(res => {
            setIsReady(true);
            setResponse({variant: 'success', message: 'An email has been sent to you with a link to reset your password.'});
        })
        .catch(err => {
            setIsReady(true);
            setResponse({variant: 'error', message: err.response.data.message});
        });
    }

    useEffect(() => {
        setIsReady(true);
    }
    , []);

    return (
        <AuthLayout>
            <Card sx={{ minWidth: 275, maxWidth: '80vw', width: 550, minHeight: 440, my: 3 }}>
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
                                Reset your password
                            </Typography>
                            <Typography variant="body2" component="div" color='gray'>
                                Enter your email address and we will send you a link to reset your password
                            </Typography>
                        </Box>
                        {response && (<Alert severity={response?.variant}>{response?.message}</Alert>)}
                        <Box>
                            <TextField
                            required
                            id='email'
                            label='Email'
                            type='email'
                            value={inputs?.email}
                            onChange={handleChange}
                            response={invalidEmail}
                            helperText={invalidEmail ? 'Please enter a valid email' : '' }
                            />
                        </Box>
                        <Button variant='contained' color='primary' sx={{my: 3, py: 1 }} onClick={handleSubmit}>Reset</Button>
                    </Box>
                </CardContent>)}
            </Card>

        </AuthLayout>
    );
}