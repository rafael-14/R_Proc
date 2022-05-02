import React, { useState } from 'react';
import {
  createTheme, ThemeProvider, Avatar, Button, CssBaseline,
  TextField, FormControlLabel, Checkbox, Box, Typography, Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Copyright() {
  return (
    <Typography variant="body2" align="center">
      {`Virtual Jóias ${new Date().getFullYear()}.`}
    </Typography>
  );
}

export default function Login() {

  const theme = createTheme({
    palette: {
      primary: { main: '#FF7A40' },
      secondary: { main: '#000000' }
    }
  })

  let [login, setLogin] = useState("")
  let [password, setPassword] = useState("")

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar style={{ color: '#FFFFFF', backgroundColor: "#FF7A40" }}>
            <LockOutlinedIcon />
          </Avatar>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Setor"
            color="secondary"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            //type="password"
            color="secondary"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{
              background: '#FF7A40',
              color: "#FFFFFF",
            }}
          //onClick={() => handleSubmit()}
          onClick={() => console.log(password)}
          >
            Login
          </Button>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}