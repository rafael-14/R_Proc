import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, styled, tableCellClasses, TextField, Autocomplete, Table,
    TableBody, TableCell, TableHead, TableRow, Container, Grid, Paper,
    Box, Toolbar, TableContainer, Collapse, createTheme,
    IconButton, Typography, ThemeProvider
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CreateIcon from '@mui/icons-material/Create';

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

    const theme = createTheme({
        palette: {
            primary: {
                main: '#FF7A40'
            },
            secondary: {
                main: '#000000'
            }
        }
    })

    let [products, setProducts] = useState([])
    let [processes, setProcesses] = useState([])

    useEffect(() => {
        async function loadProcesses() {
            let response = await api.get('/api/select/processes')
            setProcesses(response.data)
        }
        loadProcesses()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 2, mb: 1 }}>
                    <Paper>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                        >
                            <Autocomplete
                                disablePortal
                                options={processes.map((row) => row.nome)}
                                sx={{ width: 500 }}
                                renderInput={(params) => <TextField color="secondary" {...params} label="Processos" />}
                            />
                            <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/cadastrar/processo'>Novo</Button>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TableContainer>
                                    <Table size="medium" stickyHeader>
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell align="center">Processos</StyledTableCell>
                                                <StyledTableCell align="center">Código</StyledTableCell>
                                                <StyledTableCell />
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {processes.map((row) => (
                                                <StyledTableRow key={row.id}>
                                                    <StyledTableCell align="center">{row.nome}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                                                    <StyledTableCell align="right" width="1%">
                                                        <abbr title="Editar">
                                                            <Button
                                                                align="right"
                                                                style={{ color: '#000000' }}
                                                                onClick={() => window.location.href = "/editar/processo/" + row.id}
                                                                size="small"
                                                            >
                                                                <CreateIcon />
                                                            </Button>
                                                        </abbr>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider >
    );
}

