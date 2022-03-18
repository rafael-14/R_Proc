import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import api from '../../services/api';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {
  Button, styled, Switch, tableCellClasses, TextField, Autocomplete,
  TableContainer, Chip, Collapse,
  IconButton, Typography
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CreateIcon from '@mui/icons-material/Create';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#000000'
  },
})

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
  const [open, setOpen] = React.useState(false);
  let [processesByProduct, setProcessesByProduct] = useState([])

  useEffect(() => {
    async function loadProcessesByProduct() {
      let response = await api.put(`/api/select_processes_by_product/`)
      setProcessesByProduct(response.data)
    }
    loadProcessesByProduct()
  }, [])

  return (
    <>
      <TableRow >
        <TableCell width="1%">
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" width="99%">
          {row.nome}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6">
                Processos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {row.nome_processo1 ? <TableCell align="center">Processo 1</TableCell> : null}
                    {row.nome_processo2 ? <TableCell align="center">Processo 2</TableCell> : null}
                    {row.nome_processo3 ? <TableCell align="center">Processo 3</TableCell> : null}
                    {row.nome_processo4 ? <TableCell align="center">Processo 4</TableCell> : null}
                    {row.nome_processo5 ? <TableCell align="center">Processo 5</TableCell> : null}
                    {row.nome_processo6 ? <TableCell align="center">Processo 6</TableCell> : null}
                    {row.nome_processo7 ? <TableCell align="center">Processo 7</TableCell> : null}
                    {row.nome_processo8 ? <TableCell align="center">Processo 8</TableCell> : null}
                    {row.nome_processo9 ? <TableCell align="center">Processo 9</TableCell> : null}
                    {row.nome_processo10 ? <TableCell align="center">Processo 10</TableCell> : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">{row.nome_processo1}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo2}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo3}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo4}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo5}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo6}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo7}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo8}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo9}</StyledTableCell>
                    <StyledTableCell align="center">{row.nome_processo10}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}


export default function Tables() {

  let [products, setProducts] = useState([])
  let [processes, setProcesses] = useState([])

  useEffect(() => {
    async function loadProducts() {
      let response = await api.get('/api/select_products')
      setProducts(response.data)
    }
    loadProducts()

    async function loadProcesses() {
      let response = await api.get('/api/select_processes')
      setProcesses(response.data)
    }
    loadProcesses()


  }, [])

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TableContainer /*sx={{ maxHeight: 440 }}*/ >
                    <Table size="medium" stickyHeader >
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell width="1%" />
                          <StyledTableCell align="center" width="99%">Produto</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((row) => (
                          <Row key={row.id} row={row} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
