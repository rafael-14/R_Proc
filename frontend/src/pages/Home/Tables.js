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
import { Button, styled, Switch, tableCellClasses, TextField, Autocomplete, TableContainer, Chip } from "@mui/material";
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


export default function Tables() {

    let [products, setProducts] = useState([])
    let [processes, setProcesses] = useState([])

    useEffect(() => {
        async function loadProducts() {
            let response = await api.get('/api/select_products')
            setProducts(response.data)
        }
        loadProducts()

        async function loadProcesses(){
            let response = await api.get('/api/select_processes')
            setProcesses(response.data)
        }
        loadProcesses()
    }, [])


    return (
        <><Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table size="medium" stickyHeader>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell align="center">Produto</StyledTableCell>
                                            <StyledTableCell align="center">Ordem dos Processos</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((row) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell align="center">{row.nome}</StyledTableCell>
                                                <StyledTableCell align="center">{row.nome}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box><Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Paper>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table size="medium" stickyHeader>
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell align="center">Processo</StyledTableCell>
                                                <StyledTableCell align="center">Código</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {processes.map((row) => (
                                                <StyledTableRow key={row.id}>
                                                    <StyledTableCell align="center">{row.nome}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Box></>








    );
}