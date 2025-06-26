'use client'
import { Box, Divider, ListItem, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import  { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { DateTime } from 'luxon';
import { useState } from 'react';
import axios from 'axios';


export default function SessionItem({ session, onSave }) {
    const [edit, setEdit] = useState(false);
    const [from, setFrom] = useState(session.from);
    const [to, setTo] = useState(session.to);
    const [billable, setBillable] = useState(session.billable);
    const [duration, setDuration] = useState(session.duration);
    
    const handleFrom = (e) => {
        setFrom(e);
        setDuration(DateTime.fromISO(to).diff(DateTime.fromISO(e)).toFormat('h:mm'));
        setEdit(true);
    };

    const handleTo = (e) => {
        setTo(e);
        setDuration(DateTime.fromISO(e).diff(DateTime.fromISO(from)).toFormat('h:mm'));
        setEdit(true);
    };

    const handleBillable = (e) => {
        setBillable(!billable);
        setEdit(true);
    };

    const handleSave = () => {
        const start = DateTime.fromISO(session.date).set({hour: from.hour, minute: from.minute});
        const end = DateTime.fromISO(session.date).set({hour: to.hour, minute: to.minute});
        const s = {
            id: session.id,
            start_date: start.toISO(),
            end_date: end.toISO(),
            billable: billable,
        };
        axios.patch(process.env.NEXT_PUBLIC_API_URL + '/sessions/' + session.id, s)
        .then(res => {
            setEdit(false);
            onSave();
        })
        .catch(err => {
            console.error(err);
        });
    };
    const handleCancel = () => {
        setFrom(session.from);
        setTo(session.to);
        setBillable(session.billable);
        setDuration(session.duration);
        setEdit(false);
    };



    return (
        <ListItem sx={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}} divider>
            <Box sx={{display: 'flex', px: 1, flexGrow: 1}}>
                <Typography sx={{fontSize: 'small', fontWeight: 'bold'}}>{session.task.title}</Typography>
                <Typography sx={{fontSize: 'small', fontWeight: 'bold', px: 1}}>·</Typography>
                <Typography sx={{fontSize: 'small', color: session.color}}> {`${session.task.project.account.name} - ${session.task.project.name}`}</Typography>
            </Box>
            <Box sx={{display: 'flex', flexGrow: 0, alignItems: 'center'}}>
                <Divider orientation="vertical" flexItem sx={{mx: 1}}/>
                <ShoppingCartIcon color={billable === true ? 'primary' : 'disabled'} onClick={handleBillable} />
                <Divider orientation="vertical" flexItem sx={{mx: 1}}/>
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Box sx={{mx: 1, maxWidth: 70}}>
                            <TimePicker
                            id='from'
                            name='from'
                            label='From'
                            required
                            ampm={false}
                            slotProps={{ textField: {size: 'small', InputLabelProps: { shrink: true }} }}
                            value={from}
                            disableOpenPicker
                            onChange={handleFrom}
                            />
                        </Box>
                        <Box sx={{mx: 1, maxWidth: 70}}>
                        <TimePicker
                            id='to'
                            name='to'
                            label='To'
                            required
                            ampm={false}
                            slotProps={{ textField: {size: 'small', InputLabelProps: { shrink: true }} }}
                            value={to}
                            disableOpenPicker
                            onChange={handleTo}
                            />
                        </Box>
                    </LocalizationProvider>
                    <Typography sx={{fontSize: 'small', fontWeight: 'bold'}}>·</Typography>
                    <Typography sx={{fontSize: 'small', fontWeight: 'bold', mx: 1}}>{duration}H</Typography>
                    <Divider orientation="vertical" flexItem sx={{mx: 1}}/>
                </Box>
                {!edit && <MoreVertIcon />}
                {edit && <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <CheckCircleOutlineIcon color='success' onClick={handleSave} />
                    <HighlightOffIcon color='error' onClick={handleCancel} />
                </Box>}
            </Box>
        </ListItem>
    )
}