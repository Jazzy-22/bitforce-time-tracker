'use client'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import AuthLayout from '@/components/authLayout';
import ChangePassword from '@/components/changePassword';

export default function ResetPassword({ params }) {
    const [firstLoad, setFirstLoad] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [firstResponse, setFirstResponse] = useState({});
    const [recoveryToken, setRecoveryToken] = useState('');
    const token = params.token;
    const searchParams = useSearchParams();
    const email = searchParams.get('id');

    useEffect(() => {
        setFirstLoad(true);
    }, []);
    useEffect(() => {
        if (!firstLoad) return;
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify/${token}/${email}`)
        .then(res => {
            setFirstResponse({title: 'Your password is ready to be reset', message: 'Please enter a new password.'});
            setRecoveryToken(res.data.recovery_token);
        })
        .catch(err => {
            setFirstResponse({title: 'We could not reset your password', message: err.response.data.message});
        })
        .finally(() => {
            setIsReady(true);
        });
    }
    , [firstLoad]);



    return (
        <>
            {!isReady && (<AuthLayout>
                <Card sx={{ minWidth: 275, maxWidth: '80vw', width: 550, minHeight: 440, my: 3 }}>
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 400
                        }}>
                            <CircularProgress />
                        </Box>
                    </CardContent>
                </Card>
            </AuthLayout>)}
            {isReady && (<ChangePassword firstResponse={firstResponse} recoveryToken={recoveryToken} email={email} />)}
        </>
    );
}