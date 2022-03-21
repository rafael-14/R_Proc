import React, { useEffect, useState } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import {
  Button, createTheme, ThemeProvider,
  Container, Grid, Paper, Box, TextField, Toolbar
} from "@mui/material";

export default function Register() {

  const { id } = useParams();

  async function handleNotificationSuccess(processName) {
    toast.success(`Processo: ${processName} Cadastrado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => window.location.href = "/processos",
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
      onClose: () => errorMessage.startsWith('Proc') ? window.location.href = "/processos" : document.getElementById('processName').focus(),
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

  let [processName, setProcessName] = useState("")

  useEffect(() => {
    async function handleProcessName() {
      let response = await api.get(`/api/select/process/${id}`)
      setProcessName(response.data[0].nome)
    }
    handleProcessName()
  }, [])

  async function handleNewProcess() {
    if (processName !== null) {
      processName = processName.trim()
    }
    if (processName !== null && processName !== "") {
      let data = {name: processName}
      try {
        let response = await api.put(`/api/update/process/${id}`, data)
        if (response.status === 200) {
          handleNotificationSuccess(processName)
        }
      } catch (e) {
        let errorMessage = "Processo Já Cadastrado!"
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
                    id="processName"
                    required
                    label="Processo"
                    fullWidth
                    color="secondary"
                    value={processName}
                    onChange={e => setProcessName(e.target.value)}
                  />
                </Grid>
              </Grid>
              
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