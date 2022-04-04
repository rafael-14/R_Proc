import React, { useState } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, createTheme, Switch, FormGroup, ThemeProvider, FormControlLabel,
  Container, Grid, Paper, Box, TextField, Toolbar
} from "@mui/material";

export default function Register() {

  async function handleNotificationSuccess(processName) {
    toast.success(`Processo: ${processName} Cadastrado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => !manyRegisters ? window.location.href = "/processos" : setProcessName(''),
    })
  }

  async function handleNotificationError(errorMessage) {
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    }
    )
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#E8927C'
      },
      secondary: {
        main: '#000000'
      }
    }
  })

  let [processName, setProcessName] = useState(null)
  let [manyRegisters, setManyRegisters] = useState(false)

  async function handleNewProcess() {
    if (processName !== null) {
      processName = processName.trim()
    }
    if (processName !== null && processName !== "") {
      let data = {name: processName}
      try {
        let response = await api.post('/api/insert/process', data)
        if (response.status === 200) {
          handleNotificationSuccess(processName)
        }
      } catch (e) {
        let errorMessage = "Erro ao Cadastrar Processo!"
        handleNotificationError(errorMessage)
      }
    } else {
      let errorMessage = "Preencha o Nome do Processo Corretamente!"
      handleNotificationError(errorMessage)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <ToastContainer />
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
            <Grid >
              <Grid container spacing={3}>
                <Grid item xs={12} >
                  <TextField
                    required
                    label="Processo"
                    fullWidth
                    color="secondary"
                    value={processName}
                    onChange={e => setProcessName(e.target.value)}
                  />
                </Grid>
              </Grid>
              <FormGroup>
                <FormControlLabel
                  control={<Switch
                    checked={manyRegisters}
                    onChange={() => setManyRegisters(!manyRegisters)}
                  />}
                  label="Cadastrar Vários"
                />
              </FormGroup>
              <br />
              <Button variant="contained" style={{ color: '#FFFFFF' }} onClick={() => handleNewProcess()}>
                Salvar
              </Button>
              <Button
                variant="contained"
                style={{
                  background: '#D32F2F',
                  color: "#FFFFFF",
                  marginInlineStart: 15
                }}
                href="/processos"
              >
                Cancelar
              </Button>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}