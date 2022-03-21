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

  async function handleNotificationSuccess(productName) {
    toast.success(`Produto: ${productName} Cadastrado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => window.location.href = "/",
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
      onClose: () => errorMessage.startsWith('Prod') ? window.location.href = "/" : document.getElementById('productName').focus(),
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

  let [productName, setProductName] = useState("")

  useEffect(() => {
    async function handleProductName() {
      let response = await api.get(`/api/select/product/${id}`)
      setProductName(response.data[0].nome)
    }
    handleProductName()
  }, [])

  async function handleNewProduct() {
    if (productName !== null) {
      productName = productName.trim()
    }
    if (productName !== null && productName !== "") {
      let data = {name: productName}
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
      setProductName("")
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
              
              <br />
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