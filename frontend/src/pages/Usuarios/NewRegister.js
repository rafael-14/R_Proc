import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, createTheme, Switch, FormGroup, ThemeProvider, FormControlLabel, styled, TableCell, tableCellClasses,
  Container, Grid, Paper, Box, TextField, Toolbar, Table, TableContainer, TableHead, TableRow, TableBody, Chip,
  Checkbox, CircularProgress
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#E8927C",
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

export default function Register() {

  async function handleNotificationSuccess(userName, userSurname) {
    toast.success(`Usuário: ${userName} ${userSurname} Cadastrado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => {
        setProgress(false)
        (!manyRegisters ? window.location.href = "/usuarios" : null)
      },
      onOpen: () => {
        setProgress(true)
        cleanFields("")
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

  async function cleanFields() {
    setUserName("")
    setUserSurname("")
    setUserLogin("")
    setUserPassword("")
  }

  async function checkFields() {
    userName = userName.trim()
    userSurname = userSurname.trim()
    userLogin = userLogin.trim()
    userPassword = userPassword.trim()

    if (userName === "") {
      handleNotificationError("Preencher Nome do Usuário Corretamente!", "userName")
    } else if (userSurname === "") {
      handleNotificationError("Preencher Sobrenome do Usuário Corretamente!", "userSurname")
    } else if (userLogin === "") {
      handleNotificationError("Preencher Login do Usuário Corretamente!", "userLogin")
    } else if (userPassword === "") {
      handleNotificationError("Preencher Senha do Usuário Corretamente!", "userPassword")
    } else {
      handleNewUser()
    }
  }

  const theme = createTheme({
    palette: {
      primary: { main: '#E8927C' },
      secondary: { main: '#000000' }
    }
  })

  let [userName, setUserName] = useState("")
  let [userSurname, setUserSurname] = useState("")
  let [userLogin, setUserLogin] = useState("")
  let [userPassword, setUserPassword] = useState("")
  let [manyRegisters, setManyRegisters] = useState(false)
  let [cleanProcesses, setCleanProcesses] = useState(false)

  async function handleNewUser() {
    let data = { userName, userSurname, userLogin, userPassword }
    try {
      let response = await api.post('/api/insert/user', data)
      let responseData = response.data
      if (response.status === 200) {
        let data = { userID: responseData.id, vinculatedProcess }
        try {
          let response = await api.post('/api/insert/processes_by_user', data)
          if (response.status === 200) {
            handleNotificationSuccess(userName, userSurname)
          }
        } catch (e) { }
      }
    } catch (e) {
      handleNotificationError("Erro ao Cadastrar Usuário!")
    }
  }

  let [processes, setProcesses] = useState([])
  useEffect(() => {
    async function loadProcesses() {
      let response = await api.get('/api/select/processes')
      setProcesses(response.data)
    }
    loadProcesses()
  }, [])

  let [vinculatedProcess, setVinculatedProcess] = useState([])
  function handleVinculatedProcesses(id) {
    //vinculatedProcess.find(vinculatedProcess => vinculatedProcess === id)
    let indexProcess = vinculatedProcess.indexOf(id)
    if (indexProcess !== -1) {
      vinculatedProcess.splice(indexProcess, 1)
    } else {
      setVinculatedProcess([...vinculatedProcess, id])
    }
  }

  let [progress, setProgress] = useState(false)

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
                    id="userName"
                    required
                    label="Nome"
                    color="secondary"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                  />
                  <TextField
                    id="userSurname"
                    required
                    style={{ marginInlineStart: 15 }}
                    label="Sobrenome"
                    color="secondary"
                    value={userSurname}
                    onChange={e => setUserSurname(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    id="userLogin"
                    required
                    label="Login"
                    color="secondary"
                    value={userLogin}
                    onChange={e => setUserLogin(e.target.value)}
                  />
                  <TextField
                    id="userPassword"
                    required
                    style={{ marginInlineStart: 15 }}
                    label="Senha"
                    color="secondary"
                    value={userPassword}
                    onChange={e => setUserPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch
                      checked={manyRegisters}
                      onChange={() => setManyRegisters(!manyRegisters)}
                    />}
                    label="Cadastrar Vários"
                  />
                </FormGroup>
                {/*{manyRegisters ? (<FormGroup>
                  <FormControlLabel
                    control={<Switch
                      checked={cleanProcesses}
                      onChange={() => setCleanProcesses(!cleanProcesses)}
                    />}
                    label="Limpar Processos"
                  />
                    </FormGroup>) : null}*/}
              </Grid>
              <br />

              <Grid item xs={5} >
                <TableContainer >
                  <Table size="medium" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">Processos</StyledTableCell>
                        <StyledTableCell align="right">Situação</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {processes.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="left">
                            <Checkbox
                              color="secondary"
                              onClick={() => handleVinculatedProcesses(row.id)}
                              disabled={row.ativo ? false : true}
                            />
                            {row.nome}
                          </TableCell>
                          <TableCell align="right">
                            <Chip size="small" label={row.ativo ? "Ativa" : "Inativa"} color={row.ativo ? "success" : "error"} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
              >
                {!progress ?
                  (<><Button
                    variant="contained"
                    style={{
                      background: '#E74C3C',
                      color: "#FFFFFF"
                    }}
                    href="/usuarios"
                  >
                    Cancelar
                  </Button>
                    <Button variant="contained" style={{ color: '#FFFFFF', marginInlineStart: 15 }} onClick={() => checkFields()}>
                      Salvar
                    </Button></>) :
                  (<Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                  </Box>)}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}