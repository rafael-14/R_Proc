import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, Switch, FormControlLabel, TableCell, TableBody, Chip,
  Container, Grid, Box, TextField, Toolbar, Table, TableContainer, TableHead, TableRow,
  Checkbox, CircularProgress, Pagination
} from "@mui/material";
import Link from "next/link";

export default function CadastrarSetores() {

  async function handleNotificationSuccess(sector) {
    toast.success(`Setor: ${sector} Cadastrado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => {
        setProgress(false)
          (!manyRegisters ? window.location.href = "/listar/setores" : null)
      },
      onOpen: () => {
        setProgress(true)
        setSector("")
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

  let [sector, setSector] = useState("")
  let [manyRegisters, setManyRegisters] = useState(false)

  async function handleNewSector() {
    if (!sector) {
      handleNotificationError("Preencha o Setor Corretamente", "sector")
      return
    }
    let data = { sector }
    try {
      let response = await api.post('/api/insert/sector', data)
      let responseData = response.data
      if (response.status === 200) {
        let data = { sectorID: responseData.id, vinculatedUser }
        try {
          let response = await api.post('/api/insert/users_by_sector', data)
          if (response.status === 200) {
            handleNotificationSuccess(sector)
          }
        } catch (e) { }
      }
    } catch (e) {
      handleNotificationError("Erro ao Cadastrar Setor!")
    }
  }

  let [page, setPage] = useState(1)
  let [count, setCount] = useState(0)
  let [users, setUsers] = useState([])
  useEffect(() => {
    async function loadUsers() {
      let response = await api.post('/api/select/users', { page })
      setUsers(response.data.allUsers)
      setCount(response.data.count)
    }
    loadUsers()
  }, [page])

  let [vinculatedUser, setVinculatedUser] = useState([])
  function handleVinculatedUser(id) {
    let indexUser = vinculatedUser.indexOf(id)
    if (indexUser !== -1) {
      vinculatedUser.splice(indexUser, 1)
    } else {
      setVinculatedUser([...vinculatedUser, id])
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
        <Grid >
          <TextField
            id="sector"
            fullWidth
            required
            label="Setor"
            color="secondary"
            value={sector}
            onChange={e => setSector(e.target.value)}
          />
        </Grid>
        <FormControlLabel
          control={<Switch
            checked={manyRegisters}
            onChange={() => setManyRegisters(!manyRegisters)}
          />}
          label="Cadastrar Vários"
        />
        <br />
        <TableContainer >
          <Table size="medium" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left">Usuários</TableCell>
                <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="right">Situação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left">
                    <Checkbox
                      color="secondary"
                      onClick={() => handleVinculatedUser(row.id)}
                      disabled={row.ativo ? false : true}
                    />
                    {row.nome} {row.sobrenome}
                  </TableCell>
                  <TableCell align="right">
                    <Chip size="small" label={row.ativo ? "Ativo" : "Inativo"} color={row.ativo ? "success" : "error"} />
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
          <div/>
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
                <Link href="/listar/setores">
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
                  onClick={() => handleNewSector()}
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