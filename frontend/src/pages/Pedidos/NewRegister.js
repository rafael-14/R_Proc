import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, createTheme, Switch, FormGroup, ThemeProvider, FormControlLabel, styled, TableCell, tableCellClasses,
  Container, Grid, Paper, Box, TextField, Toolbar, Table, TableContainer, TableHead, TableRow, TableBody,
  Autocomplete, Fab, InputAdornment, CircularProgress
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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

  async function handleNotificationSuccess(orderNumber) {
    toast.success(`Pedido: ${orderNumber} Efetuado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => {
        setProgress(false)
        (!manyOrders ? window.location.href = "/pedidos" : setOrderProducts([]))
      },
      onOpen: () => setProgress(true)
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

  let [manyOrders, setManyOrders] = useState(false)

  async function handleNewOrder() {
    if (orderProducts.length > 0) {
      try {
        let response = await api.post('/api/insert/order')
        let responseOrder = response.data
        if (response.status === 200) {
          let data = { orderID: responseOrder.id, orderProducts }
          try {
            let response = await api.post('/api/insert/products_by_order', data)
            if (response.status === 200) {
              let data = { orderID: responseOrder.id, orderProducts }
              try {
                let response = await api.post('/api/insert/production', data)
              } catch (e) { }
              handleNotificationSuccess(responseOrder.id)
            }
          } catch (e) { }
        }
      } catch (e) {
        handleNotificationError("Erro ao Efetuar Pedido!")
      }
    }
    else {
      handleNotificationError("Preencher Produtos do Pedido Corretamente!", "product")
    }
  }

  let [products, setProducts] = useState([])
  useEffect(() => {
    async function loadProducts() {
      let response = await api.get('/api/select/products')
      setProducts(response.data)
    }
    loadProducts()
  }, [])

  let [orderProducts, setOrderProducts] = useState([])
  let [productQuantity, setProductQuantity] = useState(1)
  let [productNote, setProductNote] = useState("")
  let [product, setProduct] = useState(null)
  const handleOrderProduct = useCallback(() => {
    productNote = productNote.trim()
    if (!product) {
      handleNotificationError("Preencha o Produto Corretamente", "product")
      return
    }
    setOrderProducts([...orderProducts, { ...products.find(products => products.nome === product), productQuantity, productSeq: orderProducts.length + 1, productNote }])
    setProduct(null)
    setProductQuantity(1)
    setProductNote("")
  }, [productNote, product, orderProducts, products, productQuantity, productNote])
  async function handleRemoveOrderProduct(row) {
    orderProducts.splice(orderProducts.indexOf(row), 1)
    setOrderProducts([...orderProducts])
    //let x = orderProducts.indexOf(orderProducts => orderProducts.id === id && orderProducts.productSeq === productSeq)
  }

  async function handleChangeProductQuantity(newProductQuantity, rowPosition) {
    orderProducts[rowPosition].productQuantity = parseInt(newProductQuantity)
    setOrderProducts([...orderProducts])
  }

  async function handleChangeProductNote(newProductNote, rowPosition) {
    orderProducts[rowPosition].productNote = newProductNote
    setOrderProducts([...orderProducts])
  }

  let [progress, setProgress] = useState(false)

  const orderProductsLength = useMemo(() => orderProducts.length, [orderProducts])

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
                <Grid item xs={12} container>
                  <Autocomplete
                    id="product"
                    disablePortal
                    onChange={(event, newValue) => setProduct(newValue)}
                    value={product}
                    options={products.map((row) => row.nome)}
                    sx={{ width: 500 }}
                    renderInput={(params) => <TextField color="secondary" {...params} label="Produtos" />}
                  />
                  <TextField
                    color="secondary"
                    label="Quantidade"
                    style={{ marginInlineStart: 5 }}
                    sx={{ width: 125 }}
                    value={productQuantity}
                    onChange={e => isNaN(parseInt(e.target.value)) ? setProductQuantity(1) : setProductQuantity(parseInt(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RemoveIcon onClick={() => setProductQuantity(productQuantity - 1)} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <AddIcon onClick={() => setProductQuantity(productQuantity + 1)} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Fab color="primary" style={{ marginInlineStart: 15 }} onClick={() => handleOrderProduct()}>
                    <AddIcon />
                  </Fab>
                </Grid>
              </Grid>
              <TextField
                multiline
                onChange={e => setProductNote(e.target.value)}
                value={productNote}
                style={{ marginTop: 10 }}
                sx={{ width: 630 }}
                color="secondary"
                label="Observação"
              />
              <Grid container>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch
                      checked={manyOrders}
                      onChange={() => setManyOrders(!manyOrders)}
                    />}
                    label="Vários Pedidos"
                  />
                </FormGroup>
              </Grid>
              {orderProductsLength > 0 ? (<Grid item xs={5} >
                <TableContainer >
                  <Table size="medium" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center" onClick={() => console.log(orderProducts)}>Produtos</StyledTableCell>
                        <StyledTableCell align="center">Quantidade</StyledTableCell>
                        <StyledTableCell align="center">Observação</StyledTableCell>
                        <StyledTableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderProducts.map((row, rowPosition) => (
                        <TableRow key={`${row.id}|${rowPosition}`}>
                          <TableCell align="center">{row.nome}</TableCell>
                          <TableCell align="center">
                            <TextField
                              value={row.productQuantity}
                              onChange={e => isNaN(parseInt(e.target.value)) ? null : handleChangeProductQuantity(e.target.value, rowPosition)}
                              size="small"
                              align="center"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              multiline
                              value={row.productNote}
                              onChange={e => handleChangeProductNote(e.target.value, rowPosition)}
                              size="small"
                              align="center"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Fab onClick={() => handleRemoveOrderProduct(row)} size="small" style={{ backgroundColor: '#E74C3C', color: "#FFFFFF" }}>
                              <RemoveIcon />
                            </Fab>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>) : null}
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
              >
                {!progress ?
                  (<>
                    <Button variant="contained" style={{ background: '#E74C3C', color: "#FFFFFF" }} href="/pedidos">
                      Cancelar
                    </Button>
                    <Button variant="contained" style={{ color: '#FFFFFF', marginInlineStart: 15 }} onClick={() => handleNewOrder()}>
                      Salvar
                    </Button>
                  </>) :
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