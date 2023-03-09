import { styled } from '@mui/material';

export const SwitchUserContainer = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  boxShadow: theme.shadows[1],
  borderRadius: 9,
  height: '185px',
  width: '357px',

  '& .MuiTextField-root': {
    marginTop: 20,
    marginLeft: 20,
    width: 313,
  },

  '& .switchButton': {
    Minwidth: 150,
    borderRadius: 25,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
    textTransform: 'capitalize',
    color: '#fff',
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
  },
}));