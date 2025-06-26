'use client'
import { Button, Box, IconButton, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import  { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";

export default function NewSession({ onSave }) {
  const [inputs, setInputs] = useState({});
  const [invalid, setInvalid] = useState({task_id: false, account_id: false, project_id: false});
  const [accounts, setAccounts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [firstLoad, setFirstLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [resetAutocomplete, setResetAutocomplete] = useState(false);
  const cookies = new Cookies();
  const user = cookies.get('user');

  useEffect(() => {
    setFirstLoad(true);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      getData();
    }
  }, [firstLoad]);

  useEffect(() => {
    if (projects) {
      setIsReady(true);
    }
  }, [projects]);

  useEffect(() => {
    if (tasks) {
      setIsReady(true);
    }
  }, [tasks]);

  const getData = () => {
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/accounts/all/project')
    .then(res => {
      setAccounts(res.data.data.accounts);
      axios.get(process.env.NEXT_PUBLIC_API_URL + '/projects')
      .then(res => {
        setProjects(res.data.data);
        setAllProjects(res.data.data);
      })
      .catch(err => console.error(err));
    })
    .catch(err => console.error(err))
  }

  const getTasks = (id) => {
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/tasks/project/' + id)
    .then(res => {
      setTasks(res.data.data);
    })
    .catch(err => console.error(err));
  }

  const handleChange = (e) => {
    if (e === 'bill') {
      const b = inputs?.billable ? false : true;
      setInputs({ ...inputs, billable: b });
      return;
    }
    const i = inputs;
    if (e.target.name === 'account_id') {
      const p = allProjects.filter(project => project.account.id === e.target.value);
      setProjects(p);
      setTasks([]);
      i.task_id = null;
    }
    if (e.target.name === 'project_id') {
      setIsReady(false);
      getTasks(e.target.value);
      i.task_id = null;
      i.account_id = projects.find(p => p.id === e.target.value).account.id;
      const p = allProjects.filter(project => project.account.id === i.account_id);
      setProjects(p);
    }
    i[e.target.name] = e.target.value;
    setInputs(i);
  }

  const handleAutocomplete = (e,v) => {
    if (v === 'Add a task') {
      console.log('Add a task');
      return;
    }
    if (!v) {
      setResetAutocomplete((prev) => !prev);
      return;
    }
    const i = inputs;
    i.task = v;
    i.task_id = v.id;
    i.taskLabel = v.title;
    i.account_id = v.project.account_id;
    i.project_id = v.project.id;
    setInputs(i);
  }

  const handleSave = () => {
    const start_date = new Date();
    const end_date = new Date();
    start_date.setHours(inputs.from.split(':')[0]);
    start_date.setMinutes(inputs.from.split(':')[1]);
    end_date.setHours(inputs.to.split(':')[0]);
    end_date.setMinutes(inputs.to.split(':')[1]);
    const i = {};
    i.start_date = start_date;
    i.end_date = end_date;
    i.task_id = inputs.task_id;
    i.billable = inputs.billable === true ? true : false;
    i.project_id = inputs.project_id;
    const member = allProjects.find(p => p.id === inputs.project_id).members.find(m => m.user_id === user.id);
    if (member) {
      i.member_id = member.id;
    } else {
      if (!user.access.includes('OJEA')) {
        console.error('User not a member of project');
        return;
      }
    }
    saveSession(i);
  }

  const saveSession = (i) => {
    axios.post(process.env.NEXT_PUBLIC_API_URL + '/sessions', i)
    .then(res => {
      setInputs({task: null, taskLabel: '', from: '', to: ''});
      setInvalid({task_id: false, account_id: false, project_id: false});
      setResetAutocomplete((prev) => !prev);
      onSave();
    })
    .catch(err => console.error(err));
  }

  const handleClick = (e) => {
    if (e.target.id === 'cancel') {
      setInputs({task: null, taskLabel: '', from: '', to: ''});
      setInvalid({task_id: false, account_id: false, project_id: false});
      setResetAutocomplete((prev) => !prev);
      return;
    }
    if (e.target.id === 'save') {
      const targets = ['task_id', 'account_id', 'project_id', 'from', 'to'];
      let invalids = {};
      targets.forEach(t => {
        if (!inputs[t]) {
          invalids[t] = true;
        } else {
          invalids[t] = false;
        }
      });
      setInvalid(invalids);

      if (Object.values(invalids).includes(true)) return;
      handleSave();
    }
  }

  const handleFrom = (e) => {
    const i = inputs;
    i.from = e.toFormat('HH:mm');
    setInputs(i);
  };

  const handleTo = (e) => {
    const i = inputs;
    i.to = e.toFormat('HH:mm');
    setInputs(i);
  };

  return (
    <>
      <Paper elevation={2} sx={{
        p: 2,
        my: 2,
        display: 'flex',
        flexDirection: 'row',
        gap: 1
      }}>
        {isReady && (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexFlow: 'row wrap', alignItems: 'center', justifyContent: 'space-between'}}>
          <Box sx={{ p: 1, width: {xs: '100%', sm: '100%', md: '33%', lg: '20%' } }}>
            <FormControl fullWidth>
              <InputLabel id="account" required error={invalid.account_id}>Account</InputLabel>
                <Select
                labelId="account"
                name="account_id"
                value={inputs?.account_id}
                label="Account"
                onChange={handleChange}
                error={invalid.account_id}
                required
                >
                  {accounts?.map(account => (
                    <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                  ))}
                </Select>
            </FormControl>
          </Box>
          <Box sx={{ p: 1, width: {xs: '100%', sm: '100%', md: '33%', lg: '20%' } }}>
            <FormControl fullWidth>
              <InputLabel id="project" required error={invalid.project_id}>Project</InputLabel>
                <Select
                labelId="project"
                name="project_id"
                value={inputs?.project_id}
                label="Project"
                onChange={handleChange}
                error={invalid.project_id}
                required
                >
                  {projects?.map(project => (
                    <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                  ))}
                </Select>
            </FormControl>
          </Box>
          <Box sx={{ p: 1, width: {xs: '100%', sm: '100%', md: '33%', lg: '20%' } }}>
            <Autocomplete
              id="task_id"
              name="task_id"
              value={inputs.task}
              inputValue={inputs.taskLabel}
              options={[...tasks, 'Add a task']}
              getOptionLabel={(option) => option.title ? option.title : option}
              key={resetAutocomplete}
              renderInput={(params) => <TextField {...params} label="Task" required error={invalid.task_id} />}
              groupBy={(option) => option === 'Add a task' ? '-----' : 'Tasks'}
              onChange={(e,v) => handleAutocomplete(e,v)}
              disabled={inputs?.project_id ? false : true}
            />
          </Box>
          <Box sx={{ p: 1, width: {xs: '100%', sm: '100%', md: '70%', lg: '25%' }, display: 'flex', justifyContent: 'space-between' }}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <Box sx={{mx: 1}}>
                <TimePicker
                  id='from'
                  name='from'
                  label='From'
                  required
                  ampm={false}
                  slotProps={{ textField: {InputLabelProps: { shrink: true }} }}
                  onChange={handleFrom}
                  />
              </Box>
              <Box sx={{mx: 1}}>
                <TimePicker
                  id='to'
                  name='to'
                  label='To'
                  required
                  ampm={false}
                  slotProps={{ textField: {InputLabelProps: { shrink: true }} }}
                  onChange={handleTo}
                  />
              </Box>
            </LocalizationProvider>
          </Box>
          <Box sx={{ p: 1, width: {xs: '100%', sm: '100%', md: '30%', lg: '15%' }, display: {xs: 'none', md: 'flex'}, justifyContent: 'space-between' }}>
            <IconButton>
              <ShoppingCartIcon onClick={() => handleChange('bill')} color={inputs?.billable ? 'primary' : 'gray'} />
            </IconButton>
            <Button variant='contained' id='save' onClick={handleClick} sx={{flexGrow: 1, ml: 2}}>+ Add</Button>
          </Box>
          <Box sx={{ p: 1, width: {xs: '100%', sm: '100%', md: '30%', lg: '15%' }, display: {xs: 'flex', md: 'none'}, flexDirection: 'column', alignItems: 'start'}}>
            <FormControlLabel
              control={<Switch checked={inputs?.billable} onClick={() => handleChange('bill')} />}
              label='Billable'
              labelPlacement='end'
              sx={{mb: 2}}
            />
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <Button variant='outlined' color='error' id='cancel' onClick={handleClick} sx={{}}>Cancel</Button>
              <Button variant='contained' id='save' onClick={handleClick} sx={{}}>Save</Button>
            </Box>
          </Box>

        </Box>)}
      </Paper>
    </>
  );
}
