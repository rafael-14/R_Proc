import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, createTheme, Switch, FormGroup, ThemeProvider, FormControlLabel, styled, TableCell, tableCellClasses,
  Container, Grid, Paper, Box, TextField, Toolbar, Table, TableContainer, TableHead, TableRow, TableBody,
  Autocomplete, Fab, InputAdornment
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
      onClose: () => !manyOrders ? window.location.href = "/pedidos" : null//cleanFields(''),
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
  let [cleanProducts, setCleanProducts] = useState(false)

  async function handleNewOrder() {
    if (orderProducts.length > 0) {
      try {
        let response = await api.post('/api/insert/order') //verificar qual a rota correta --- verificar se é a rota get
        let responseData = response.data
        if (response.status === 200) {
          let data = { orderID: responseData.id, orderProducts }
          try {
            let response = await api.post('/api/insert/products_by_order', data)
            if (response.status === 200) {
              handleNotificationSuccess(responseData.id)
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
  let [product, setProduct] = useState(null)
  async function handleOrderProduct() {
    if (!product) {
      handleNotificationError("Preencha o Produto Corretamente", "product")
      return
    }
    setOrderProducts([...orderProducts, { ...products.find(products => products.nome === product), productQuantity: productQuantity, productSeq: orderProducts.length + 1 }])
    setProduct(null)
    setProductQuantity(1)
  }
  async function handleRemoveOrderProduct(row) {
    orderProducts.splice(orderProducts.indexOf(row), 1)
    setOrderProducts([...orderProducts])
    //let x = orderProducts.indexOf(orderProducts => orderProducts.id === id && orderProducts.productSeq === productSeq)
  }

  async function handleChangeProductQuantity(newProductQuantity, rowPosition) {
    orderProducts[rowPosition].productQuantity = parseInt(newProductQuantity)
    setOrderProducts([...orderProducts])
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
                    type="text"
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
                {manyOrders ? (<FormGroup>
                  <FormControlLabel
                    control={<Switch
                      checked={cleanProducts}
                      onChange={() => setCleanProducts(!cleanProducts)}
                    />}
                    label="Limpar Produtos"
                  />
                </FormGroup>) : null}
              </Grid>
              <br />
              {orderProducts.length > 0 ? (<Grid item xs={5} >
                <TableContainer >
                  <Table size="medium" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Produtos</StyledTableCell>
                        <StyledTableCell align="center">Quantidade</StyledTableCell>
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
                            <Fab onClick={() => handleRemoveOrderProduct(row)} size="small" style={{ backgroundColor: '#D32F2F', color: "#FFFFFF" }}>
                              <RemoveIcon />
                            </Fab>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>) : null}
              <Button variant="contained" style={{ color: '#FFFFFF' }} onClick={() => handleNewOrder()}>
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