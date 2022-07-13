import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, Switch, FormGroup, FormControlLabel, TableCell, TableRow, TableBody, Chip,
  Container, Grid, Box, TextField, Toolbar, Table, TableContainer, TableHead,
  Checkbox, CircularProgress, Pagination
} from "@mui/material";
import Link from "next/link";

export default function CadastrarUsuarios() {

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
          (!manyRegisters ? window.location.href = "/listar/usuarios" : null)
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

  let [userName, setUserName] = useState("")
  let [userSurname, setUserSurname] = useState("")
  let [userLogin, setUserLogin] = useState("")
  let [userPassword, setUserPassword] = useState("")
  let [manyRegisters, setManyRegisters] = useState(false)

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

  let [page, setPage] = useState(1)
  let [count, setCount] = useState(0)
  let [processes, setProcesses] = useState([])
  useEffect(() => {
    async function loadProcesses() {
      let response = await api.post('/api/select/processes', { page })
      setProcesses(response.data.allProcesses)
      setCount(response.data.count)
    }
    loadProcesses()
  }, [page])

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
      <Container maxWidth="xg" sx={{ mt: 2 }}>
        <TextField
          id="userName"
          required
          label="Nome"
          color="secondary"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          style={{ width: "49%" }}
        />
        <TextField
          id="userSurname"
          required
          style={{ marginInlineStart: "2%", width: "49%" }}
          label="Sobrenome"
          color="secondary"
          value={userSurname}
          onChange={e => setUserSurname(e.target.value)}
        />
        <TextField
          id="userLogin"
          required
          label="Login"
          color="secondary"
          value={userLogin}
          onChange={e => setUserLogin(e.target.value)}
          style={{width: "49%", marginTop: "1%"}}
        />
        <TextField
          id="userPassword"
          required
          style={{ marginInlineStart: "2%", width: "49%", marginTop: "1%" }}
          label="Senha"
          color="secondary"
          value={userPassword}
          onChange={e => setUserPassword(e.target.value)}
        />
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
        </Grid>
        <br />
        <Grid item xs={5} >
          <TableContainer >
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left">Processos</TableCell>
                  <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="right">Situação</TableCell>
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
          <br />
          <Grid
            container
            direction="row"
            justifyContent="space-between"
          >
            <div />
            <Grid item justifyContent="center">
              {count > 10 ?
                <Pagination
                  size="large"
                  showFirstButton
                  showLastButton
                  onChange={(_event, page) => setPage(page)}
                  count={(parseInt(count / 10) + (count % 10 !== 0 ? 1 : 0))}
                  defaultPage={1}
                  siblingCount={0}
                  page={page}
                />
                : null}
            </Grid>
            <Grid item>
              {!progress ?
                (<>
                  <Link href="/listar/usuarios">
                    <Button
                      variant="contained"
                      style={{
                        background: '#E74C3C',
                        color: "#FFFFFF"
                      }}
                    >
                      Cancelar
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    style={{ color: "#FFFFFF", marginInlineStart: 15, backgroundColor: "#E8927C" }}
                    onClick={() => checkFields()}
                  >
                    Salvar
                  </Button>
                </>) :
                (<Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>)}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}