import React, { useState } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, Switch, FormControlLabel, Autocomplete,
  Container, Grid, Box, TextField, Toolbar, CircularProgress
} from "@mui/material";
import Link from "next/link";

export default function CadastrarProcessos() {

  async function handleNotificationSuccess(processName) {
    toast.success(`Processo: ${processName} Cadastrado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => {
        setProgress(false)
          (!manyRegisters ? window.location.href = "/listar/processos" : null)
      },
      onOpen: () => {
        setProcessName("")
        setProgress(true)
      }
    })
  }

  async function handleNotificationError(errorMessage, fieldToBeFocused) {
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onOpen: () => fieldToBeFocused ? document.getElementById(fieldToBeFocused).focus() : null,
    })
  }

  let [processName, setProcessName] = useState("")
  let [manyRegisters, setManyRegisters] = useState(false)

  async function handleNewProcess() {
    processName = processName.trim()
    if (processName !== "") {
      let data = { processName, bipType: bipType.id }
      try {
        let response = await api.post('/api/insert/process', data)
        if (response.status === 200) {
          handleNotificationSuccess(processName)
        }
      } catch (e) {
        handleNotificationError("Erro ao Cadastrar Processo!")
      }
    } else {
      handleNotificationError("Preencha o Nome do Processo Corretamente!", "processName")
    }
  }

  let [progress, setProgress] = useState(false)
  let [bipType, setBipType] = useState({ label: "Obrigatória", id: 1 })

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Toolbar />
      <ToastContainer />
      <Container maxWidth="xg" sx={{ mt: 2 }}>
        <Grid container>
          <TextField
            id="processName"
            required
            label="Processo"
            color="secondary"
            value={processName}
            onChange={e => setProcessName(e.target.value)}
            style={{ marginBottom: 5 }}
            sx={{ width: "80%" }}
          />
          <Autocomplete
            isOptionEqualToValue={(option, value) => option.value === value.value}
            value={bipType}
            onChange={(_event, newValue) => setBipType(newValue)}
            options={[
              { label: "Obrigatória", id: 1 },
              { label: "Informativa", id: 2 },
              { label: "Nenhuma", id: 0 }
            ]}
            disableClearable
            sx={{ width: "19%" }}
            style={{ marginInlineStart: "1%" }}
            renderInput={(params) => <TextField {...params} color="secondary" label="Bipagem" />}
          />
        </Grid>
        <Grid container justifyContent="space-between">
          <FormControlLabel
            control={<Switch
              checked={manyRegisters}
              onChange={() => setManyRegisters(!manyRegisters)}
            />}
            label="Cadastrar Vários"
          />
          <Grid>
            {!progress ?
              (<>
                <Link href="/listar/processos">
                  <Button variant="contained" style={{ background: '#E74C3C', color: "#FFFFFF" }}>
                    Cancelar
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  style={{ color: '#FFFFFF', marginInlineStart: 15, backgroundColor: "#E8927C" }}
                  onClick={() => handleNewProcess()}
                >
                  Salvar
                </Button>
              </>) :
              (<Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>)}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}