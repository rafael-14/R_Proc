import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, createTheme, Switch, FormGroup, ThemeProvider, FormControlLabel, styled, TableCell, tableCellClasses,
  Container, Grid, Paper, Box, TextField, Toolbar, Table, TableContainer, TableHead, TableRow, TableBody, Chip,
  Checkbox
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

function Row(props) {

  const { row } = props;

  useEffect(() => {
    if (props.selectedProcesses.length == 0) {
      setChecked(false)
    }
  }, [props.fabricationOrder])

  let [checked, setChecked] = useState(false)

  async function setDirectlyFabricationOrder(id) {
    props.setFabricationOrder([...props.fabricationOrder, { id, order: (props.fabricationOrder.length + 1) * 10 }])
  }

  return (
    <>
      <TableRow key={row.id}>
        <TableCell
          align="center"
          onDoubleClick={() => row.ativo ? setDirectlyFabricationOrder(row.id) : null}
        >
          <Checkbox
            color="secondary"
            checked={checked}
            onClick={() => { props.handleSelectedProcesses(row.id); setChecked(!checked) }}
            disabled={row.ativo ? false : true}
          />
          {row.nome}
        </TableCell>
        <TableCell align="right">
          <Chip size="small" label={row.ativo ? "Ativa" : "Inativa"} color={row.ativo ? "success" : "error"} />
        </TableCell>
      </TableRow>
    </>
  )
}

export default function Register() {

  async function handleNotificationSuccess(productName) {
    toast.success(`Produto: ${productName} Cadastrado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => !manyRegisters ? window.location.href = "/" : setProductName(''),
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
    })
  }

  const theme = createTheme({
    palette: {
      primary: { main: '#E8927C' },
      secondary: { main: '#000000' }
    }
  })

  let [productName, setProductName] = useState("")
  let [manyRegisters, setManyRegisters] = useState(false)

  async function handleNewProduct() {
    if (productName !== null) {
      productName = productName.trim()
    }
    if (productName !== null && productName !== "") {
      let data = { name: productName }
      try {
        let response = await api.post('/api/insert/product', data)
        if (response.status === 200) {
          handleNotificationSuccess(productName)
        }
      } catch (e) {
        let errorMessage = "Produto Já Cadastrado!"
        handleNotificationError(errorMessage)
      }
    } else {
      let errorMessage = "Preencha o Nome do Produto Corretamente!"
      handleNotificationError(errorMessage)
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

  let [selectedProcesses, setSelectedProcesses] = useState([])
  async function handleSelectedProcesses(id) {
    let insert = true;
    if (selectedProcesses.length == 0) {
      setSelectedProcesses([{ id }])
    } else {
      for (let i = 0; i < selectedProcesses.length; i++) {
        if (selectedProcesses[i].id == id) {
          insert = false
          selectedProcesses.splice(i, 1)
        }
      }
      if (insert) {
        setSelectedProcesses([...selectedProcesses, { id }])
      }
    }
  }
  let [fabricationOrder, setFabricationOrder] = useState([])
  async function handleFabricationOrder() {
    if (fabricationOrder.length === 0) {
      setFabricationOrder(selectedProcesses.map((selectedProcesses, position) => ({ ...selectedProcesses, order: (position + 1) * 10 })))
    } else {
      setFabricationOrder([...fabricationOrder, ...selectedProcesses.map((selectedProcesses, position) => ({ ...selectedProcesses, order: (fabricationOrder.length + 1 + position) * 10 }))])
    }
    setSelectedProcesses([])
  }

  let [unselectedProcesses, setUnselectedProcess] = useState([])
  async function handleUnselectedProcesses() {
    for (let i = 0; i < unselectedProcesses.length; i++) {

    }
  }

  async function handleNewOrder(x, y, id) {
    let newOrder = { id, order: parseInt(x) }
    setFabricationOrder(fabricationOrder.map((fabricationOrder, position) => position === y ? { ...newOrder } : fabricationOrder))
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
                    label="Produto"
                    fullWidth
                    color="secondary"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
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
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item xs={5} >
                  <TableContainer >
                    <Table size="medium" stickyHeader>
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell align="center">Processos</StyledTableCell>
                          <StyledTableCell align="right">Situação</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {processes.map((row) => (
                          <Row
                            key={row.id}
                            row={row}
                            handleSelectedProcesses={handleSelectedProcesses}
                            setFabricationOrder={setFabricationOrder}
                            fabricationOrder={fabricationOrder}
                            handleFabricationOrder={handleFabricationOrder}
                            selectedProcesses={selectedProcesses}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item>
                  <Grid container direction="column" alignItems="center">
                    <Button
                      sx={{ my: 0.5 }}
                      size="small"
                      disabled={selectedProcesses.length == 0 ? true : false}
                      variant="outlined"
                      onClick={() => handleFabricationOrder()}
                    >
                      &gt;
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      size="small"
                      variant="outlined"
                      //onClick={() => handleUnselectedProcesses()}
                      onClick={() => console.log(fabricationOrder)}
                      disabled={fabricationOrder.length === 0 ? true : false}
                    >
                      &lt;
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      size="small"
                      variant="outlined"
                      onClick={() => setFabricationOrder([])}
                      disabled={fabricationOrder.length === 0 ? true : false}
                    >
                      &lt;&lt;
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={5} >
                  <TableContainer>
                    <Table size="medium" stickyHeader>
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell align="center" style={{ width: '70%' }}>Ordem de Fabricação</StyledTableCell>
                          <StyledTableCell align="right">Ordem</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {fabricationOrder.map((newRow, newRowPosition) => (
                          <StyledTableRow key={newRow.id + "|" + newRow.order}>
                            <StyledTableCell align="center">
                              <Checkbox color="secondary" onClick={() => setUnselectedProcess(newRow.id)} />
                              {newRow.id}
                            </StyledTableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={newRow.order}
                                onChange={e => handleNewOrder(e.target.value, newRowPosition, newRow.id)}
                                align="right"
                              />
                            </TableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>




              <Button variant="contained" style={{ color: '#FFFFFF' }} onClick={() => handleNewProduct()}>
                Salvar
              </Button>
              <Button
                variant="contained"
                style={{
                  background: '#D32F2F',
                  color: "#FFFFFF",
                  marginInlineStart: 15
                }}
                href="/"
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