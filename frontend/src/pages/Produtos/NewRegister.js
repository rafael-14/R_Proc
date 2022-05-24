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

function Row(props) {

  const { row } = props;

  useEffect(() => {
    if (props.selectedProcesses.length == 0) {
      setChecked(false)
    }
  }, [props.fabricationOrder])

  let [checked, setChecked] = useState(false)

  async function setDirectlyFabricationOrder(id, nome) {
    props.setFabricationOrder([...props.fabricationOrder,
    {
      id,
      order: (props.fabricationOrder.length === 0 ?
        10 :
        parseInt(Math.max.apply(null, props.fabricationOrder.map(fabricationOrder => fabricationOrder.order)) / 10 + 1) * 10),
      nome
    }])
  }

  return (
    <>
      <TableRow key={row.id}>
        <TableCell
          align="center"
          onDoubleClick={() => row.ativo ? setDirectlyFabricationOrder(row.id, row.nome) : null}
        >
          <Checkbox
            color="secondary"
            checked={checked}
            onClick={() => { props.handleSelectedProcesses(row.id, row.nome); setChecked(!checked) }}
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

  const theme = createTheme({
    palette: {
      primary: { main: '#E8927C' },
      secondary: { main: '#000000' }
    }
  })

  let [productName, setProductName] = useState("")
  let [manyRegisters, setManyRegisters] = useState(false)
  let [cleanFabricationOrder, setCleanFabricationOrder] = useState(false)


  async function handleNewProduct() {

    productName = productName.trim()

    if (productName !== "") {
      let data = { productName }
      try {
        let response = await api.post('/api/insert/product', data)
        let responseData = response.data
        if (response.status === 200) {
          let data = { productID: responseData.id, processesID: fabricationOrder }
          try {
            let response = await api.post('/api/insert/processes_by_product', data)
            if (response.status === 200) {
              handleNotificationSuccess(productName)
            }
          } catch (e) { }
          if (cleanFabricationOrder) {
            setFabricationOrder([])
          }
        }
      } catch (e) {
        handleNotificationError("Produto Já Cadastrado!")
      }
    } else {
      handleNotificationError("Preencha o Nome do Produto Corretamente!", "productName")
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
  async function handleSelectedProcesses(id, nome) {
    let insert = true;
    if (selectedProcesses.length == 0) {
      setSelectedProcesses([{ id, nome }])
    } else {
      for (let i = 0; i < selectedProcesses.length; i++) {
        if (selectedProcesses[i].id == id) {
          insert = false
          selectedProcesses.splice(i, 1)
        }
      }
      if (insert) {
        setSelectedProcesses([...selectedProcesses, { id, nome }])
      }
    }
  }
  let [fabricationOrder, setFabricationOrder] = useState([])
  async function handleFabricationOrder() {
    setFabricationOrder([...fabricationOrder,
    ...selectedProcesses.map((selectedProcesses, position) => ({
      ...selectedProcesses,
      order: fabricationOrder.length === 0 ? (position + 1) * 10 :
        parseInt((Math.max.apply(null, fabricationOrder.map(fabricationOrder => fabricationOrder.order))) / 10 + 1 + position) * 10
    }))])
    setSelectedProcesses([])
  }

  async function handleNewOrder(newOrder, newRowPosition, id, nome) {
    let orderExist = fabricationOrder.find(fabricationOrder => fabricationOrder.order === parseInt(newOrder))
    if (!orderExist) {
      let newProcessOrder = { id, order: parseInt(newOrder), nome }
      setFabricationOrder(fabricationOrder.map((fabricationOrder, position) => position === newRowPosition ? { ...newProcessOrder } : fabricationOrder))
    } else {
      handleNotificationError("Ordem já Existente!")
    }
  }

  function setRemoveProductionDirectly(position) {
    fabricationOrder.splice(position, 1)
    setFabricationOrder([...fabricationOrder])
  }

  let [unselectedProcesses, setUnselectedProcesses] = useState([])
  function handleCheckboxUnselectedProcess(processToBeRemoved) {
    let position = unselectedProcesses.indexOf(processToBeRemoved)
    if (position !== -1) {
      unselectedProcesses.splice(position, 1)
      setUnselectedProcesses([...unselectedProcesses])
    } else {
      setUnselectedProcesses([...unselectedProcesses, processToBeRemoved])
    }
  }

  function handleUnselectedProcess() {
    //for (let i = 0; i < fabricationOrder.length; i++) {
    //  console.log(fabricationOrder[i])
    //  console.log(unselectedProcesses[i])
    //  let position = fabricationOrder.indexOf(unselectedProcesses)
    //  console.log(position)
    //  if (position !== -1) {
    //    console.log("entrei")
    //    fabricationOrder.splice(position, 1)
    //    setFabricationOrder([...fabricationOrder])
    //  }
    //}

    //fabricationOrder => fabricationOrder === unselectedProcesses.map(unselectedProcesses)
    //fabricationOrder.splice(index, 1)
    //setFabricationOrder([...fabricationOrder])

    for (let i = 0; i < fabricationOrder.length; i++) {
      for (let j = 0; j < unselectedProcesses.length; j++) {
        if (unselectedProcesses[j] === fabricationOrder[i]) {
          fabricationOrder.splice(i, 1)
          console.log(fabricationOrder)
        }
      }
    }
    setFabricationOrder([...fabricationOrder])
    setUnselectedProcesses([])
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
                    id="productName"
                    required
                    label="Produto"
                    fullWidth
                    color="secondary"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
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
                {manyRegisters ? (<FormGroup>
                  <FormControlLabel
                    control={<Switch
                      checked={cleanFabricationOrder}
                      onChange={() => setCleanFabricationOrder(!cleanFabricationOrder)}
                    />}
                    label="Limpar Ordem de Fabricação"
                  />
                </FormGroup>) : null}
              </Grid>
              <br />
              <Grid
                container
                justifyContent="space-between"
              >
                <Grid item xs={5} >
                  <TableContainer >
                    <Table size="medium" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Processos</StyledTableCell>
                          <StyledTableCell align="right">Situação</StyledTableCell>
                        </TableRow>
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
                      onClick={() => handleUnselectedProcess()}
                      disabled={unselectedProcesses.length === 0 ? true : false}
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
                        <TableRow>
                          <StyledTableCell align="center" style={{ width: '70%' }}>Ordem de Fabricação</StyledTableCell>
                          <StyledTableCell align="right">Ordem</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fabricationOrder.map((newRow, newRowPosition) => (
                          <TableRow key={newRow.id + newRowPosition}>
                            <TableCell align="center" onDoubleClick={() => setRemoveProductionDirectly(newRowPosition)}>
                              <Checkbox color="secondary" onClick={() => handleCheckboxUnselectedProcess(newRow, newRowPosition)} />
                              {newRow.nome}
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={newRow.order}
                                onChange={e => handleNewOrder(e.target.value, newRowPosition, newRow.id, newRow.nome)}
                                align="right"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  style={{
                    background: '#E74C3C',
                    color: "#FFFFFF"
                  }}
                  href="/"
                >
                  Cancelar
                </Button>
                <Button variant="contained" style={{ color: '#FFFFFF', marginInlineStart: 15 }} onClick={() => handleNewProduct()}>
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}