import React, { useState } from 'react';
import {
  createTheme, ThemeProvider, Avatar, Button, CssBaseline,
  TextField, Box, Typography, Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from '../../services/api';
import {setIdSetor, login} from '../../services/auth';

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

  let [sector, setSector] = useState("")
  let [password, setPassword] = useState("")

  async function handleSubmit() {
    await api.post("/api/login", {nome: sector})
    .then(res => {
      if (res.data.status === 200) {
        login(res.data.token)
        setIdSetor(res.data.login.id)
        window.location.href="/"
      } else {
        alert("não conectou")
      }
    })
  }

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
            value={sector}
            onChange={e => setSector(e.target.value)}
            onKeyDown={e => e.key === "Enter" ? alert("dei enter"):null}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
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
            onClick={() => handleSubmit()}
          >
            Login
          </Button>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}