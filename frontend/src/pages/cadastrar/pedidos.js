import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, Switch, FormGroup, FormControlLabel, TableCell, TableBody,
  Container, Grid, Box, TextField, Toolbar, Table, TableContainer, TableHead, TableRow,
  Fab, InputAdornment, CircularProgress, ButtonGroup
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Link from "next/link";

export default function CadastrarUsuarios() {

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
        setProgress(false),
          (!manyOrders ? window.location.href = "/listar/pedidos" : setOrderProducts([]))
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

  let [manyOrders, setManyOrders] = useState(false)

  async function handleNewOrder() {
    if (orderProducts.length > 0) {
      try {
        let response = await api.post("/api/insert/order")
        let responseOrder = response.data
        if (response.status === 200) {
          let data = { orderID: responseOrder.id, orderProducts }
          try {
            response = await api.post("/api/insert/products_by_order", data)
            if (response.status === 200) {
              let newOrderProducts = orderProducts.map((orderProducts, position) => {
                return orderProducts.id === parseInt(response.data[position].id_produto) ?
                  { ...orderProducts, ...response.data[position] }
                  : { ...orderProducts }
              })
              data = { orderID: responseOrder.id, orderProducts: newOrderProducts }
              try {
                await api.post("/api/insert/production", data)
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

  let [orderProducts, setOrderProducts] = useState([])
  let [productQuantity, setProductQuantity] = useState(1)
  let [productNote, setProductNote] = useState("")
  let [product, setProduct] = useState("")
  const handleOrderProduct = useCallback(async () => {
    productNote = productNote.trim()
    product = product.trim()
    if (!product) {
      handleNotificationError("Preencha o Produto Corretamente", "product")
      setProduct("")
      return
    }
    //let productFound = products.find(products => products.nome === product)
    let response = await api.post("/api/find/product", { product })
    console.log(response.data)
    if (response.data.length === 0) {
      handleNotificationError("Produto Inexistente!", "product")
      setProduct("")
      return
    }
    setOrderProducts([...orderProducts, {
      ...response.data[0],
      productQuantity,
      productSeq: orderProducts.length + 1,
      productNote
    }])
    setProduct("")
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
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <ToastContainer />
      <Container maxWidth="xg" sx={{ mt: 2 }}>
        <Grid container>
          <TextField
            id="product"
            color="secondary"
            onChange={e => setProduct(e.target.value)}
            value={product}
            label="Produtos"
            sx={{ width: "60%" }}
          />
          <TextField
            color="secondary"
            label="Quantidade"
            style={{ marginInlineStart: "1%" }}
            sx={{ width: "10%" }}
            value={productQuantity}
            onChange={e => {
              isNaN(parseInt(e.target.value)) ? setProductQuantity(1)
                : setProductQuantity(parseInt(e.target.value))
            }}
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
        </Grid>
        <TextField
          multiline
          onChange={e => setProductNote(e.target.value)}
          value={productNote}
          style={{ marginTop: "1%" }}
          sx={{ width: "60%" }}
          color="secondary"
          label="Observação"
        />
        <Fab
          style={{ marginInlineStart: "3%", backgroundColor: "#E8927C", color: "#FFFFFF", marginTop: "1%" }}
          onClick={() => handleOrderProduct()}
        >
          <AddIcon />
        </Fab>
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
        {orderProductsLength > 0 ? (<Grid item xs={5}>
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ background: "#E8927C", color: "#FFFFFF" }} align="center">Produtos</TableCell>
                  <TableCell style={{ background: "#E8927C", color: "#FFFFFF" }} align="center">Quantidade</TableCell>
                  <TableCell style={{ background: "#E8927C", color: "#FFFFFF" }} align="center">Observação</TableCell>
                  <TableCell style={{ background: "#E8927C", color: "#FFFFFF" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {orderProducts.map((row, rowPosition) => (
                  <TableRow key={`${row.id}|${rowPosition}`}>
                    <TableCell align="center">{row.nome}</TableCell>
                    <TableCell align="center">
                      <TextField
                        value={row.productQuantity}
                        onChange={e => {
                          isNaN(parseInt(e.target.value)) ? null :
                            handleChangeProductQuantity(e.target.value, rowPosition)
                        }}
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
                      <Fab
                        onClick={() => handleRemoveOrderProduct(row)}
                        size="small"
                        style={{ backgroundColor: '#E74C3C', color: "#FFFFFF" }}
                      >
                        <RemoveIcon />
                      </Fab>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>) : null}
        <br />
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
        >
          {!progress ?
            (<>
              <Link href="/listar/pedidos">
                <Button variant="contained" style={{ background: "#E74C3C", color: "#FFFFFF" }}>
                  Cancelar
                </Button>
              </Link>
              {orderProductsLength > 0 ?
                (<Button
                  variant="contained"
                  style={{ color: "#FFFFFF", marginInlineStart: 15 }}
                  onClick={() => handleNewOrder()}
                >
                  Salvar
                </Button>) : null}
            </>) :
            (<Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>)}
        </Grid>
      </Container>
    </Box >
  );
}