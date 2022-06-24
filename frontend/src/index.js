import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#E8927C' },
    secondary: { main: '#000000' }
  }
})

ReactDOM.render(
  <ThemeProvider theme={theme}>
      <Routes />
  </ThemeProvider>,
  document.getElementById('root')
);