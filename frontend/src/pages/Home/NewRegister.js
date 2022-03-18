import React, { useState } from "react";
import api from '../../services/api';
import {
  Button, createTheme, Switch, FormGroup, ThemeProvider, FormControlLabel,
  Container, Grid, Paper, Box, TextField, Toolbar
} from "@mui/material";

export default function Register() {

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

  let [productName, setProductName] = useState(null)
  let [manyRegisters, setManyRegisters] = useState(false)

  async function handleNewProduct() {
    if (productName !== null) {
      productName = productName.trim()
    }
    if (productName !== null && productName !== "") {
      let data = {name: productName}
      try {
        let response = await api.post('/api/insert_product', data)
        if (response.status === 200) {
          alert("Produto Cadastrado com Sucesso!")
          window.location.href="/"
        }
      } catch (e) {
        alert("Erro ao Cadastrar Produto!")
      }
    } else {
      let errorMessage = "Preencha o Nome do Produto Corretamente!"
      alert(errorMessage)
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