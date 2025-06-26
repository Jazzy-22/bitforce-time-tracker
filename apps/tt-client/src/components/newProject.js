import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function NewProject({ open, onClose, onSuccess }) {
  const [firstLoad, setFirstLoad] = useState(false);
  const [inputs, setInputs] = useState({});
  const [invalidName, setInvalidName] = useState(false);
  const [invalidKey, setInvalidKey] = useState(false);
  const [invalidAccount, setInvalidAccount] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState([]);
  
  
  const handleChange = (e) => {
    if (e.target.id == undefined) {
        setInputs({ ...inputs, account_id: e.target.value })
    } else {
        setInputs({ ...inputs, [e.target.id]: e.target.value });
    }
  }
  const checkKeyPress = (e) => {
      if (e.key === 'Enter') {
      handleSubmit();
      }
  }

  const handleClose = () => {
    setInputs({});
    setInvalidName(false);
    setInvalidKey(false);
    setInvalidAccount(false);
    onClose();
  }

  const handleSubmit = () => {
    if (!inputs?.account_id) {
        setInvalidAccount(true);
    } else {
        setInvalidAccount(false);
    }
    if (!inputs?.name) {
        setInvalidName(true);
    } else {
        setInvalidName(false);
    }
    if (!inputs?.key) {
        setInvalidKey(true);
    } else {
        setInvalidKey(false);
    }
    if (!inputs?.account_id || !inputs?.name || !inputs?.key) return;
    setSpinner(true);
    const dto = inputs;
    dto.status_id = status.filter(st => st.level = Math.min(...status.map(s => s.level)))[0].id;
    axios.post(process.env.NEXT_PUBLIC_API_URL + '/projects', dto)
    .then((res) => {
        if (res.data.status === 'error') {
            console.error(res.data.message);
        } else {
            handleClose();
            onSuccess(res.data);
        }
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        setSpinner(false);
    });
  }

  useEffect(() => {
    setFirstLoad(true);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      axios.get(process.env.NEXT_PUBLIC_API_URL + '/accounts/all/project')
      .then((res) => {
        setAccounts(res.data.data.accounts);
        setStatus(res.data.data.status);
        })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setSpinner(false);
      });
    }
  }, [firstLoad]);

  return (
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
            <Box
                component='form'
                sx={{
                    '& .MuiTextField-root': { my: 1, width: '100%' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
                noValidate
                autoComplete='off'
                onKeyDown={checkKeyPress}
            >
                <Box sx={{my: 2}}>
                    <Typography variant="h5" component="div">
                        New Project
                    </Typography>
                </Box>
                {spinner && <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><CircularProgress /></Box>}
                {!spinner && (<Box>
                    <FormControl fullWidth>
                        <InputLabel id="account">Account</InputLabel>
                        <Select
                        labelId="account"
                        id="account"
                        value={inputs?.account}
                        label="Account"
                        onChange={handleChange}
                        error={invalidAccount}
                        helperText={invalidAccount ? 'Please select an account' : '' }
                        required
                        >
                        {accounts?.map(account => (
                            <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <TextField
                    required
                    id='name'
                    label='Name'
                    type='text'
                    value={inputs?.name}
                    onChange={handleChange}
                    error={invalidName}
                    helperText={invalidName ? 'Please enter a name for your project' : '' }
                    />
                    <TextField
                    required
                    id='key'
                    label='Key'
                    type='key'
                    
                    value={inputs?.key}
                    onChange={handleChange}
                    inputProps={{ maxLength: 8 }}
                    error={invalidKey}
                    helperText={invalidKey ? 'Please enter a key for you project ' : '' }
                    />
                </Box>)}
                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
                    <Button variant='outlined' color='error' sx={{my: 3, py: 1 }} onClick={handleClose} disabled={spinner}>Cancel</Button>
                    <Button variant='contained' color='primary' sx={{my: 3, py: 1 }} onClick={handleSubmit} disabled={spinner}>Save</Button>
                </Box>
            </Box>
        </Box>
      </Modal>
  );
}
