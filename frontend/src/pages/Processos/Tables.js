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
            let response = await api.get('/api/select_processes')
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
                            <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/cadastrar_processo'>Novo</Button>
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
            </Box>
        </ThemeProvider >
    );
}

