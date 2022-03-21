import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import {
    Button, styled, tableCellClasses, TextField, Autocomplete, Table,
    TableBody, TableCell, TableHead, TableRow, Container, Grid, Paper,
    Box, Toolbar, TableContainer, Collapse, createTheme,
    IconButton, Typography, ThemeProvider, Chip, Switch
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

function Row(props) {

    async function handleNotificationSuccess(nome) {
        toast.success(`Produto: ${nome} Ativado com Sucesso!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }

    async function handleNotificationError(nome) {
        toast.error(`Produto: ${nome} Inativado com Sucesso!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }

    const { row } = props;
    const [open, setOpen] = useState(false);

    async function handleInactivation(id, nome) {
        await api.put(`/api/inactivate/product/${id}`)
        handleNotificationError(nome)
    }
    async function handleActivation(id, nome) {
        await api.put(`/api/activate/product/${id}`)
        handleNotificationSuccess(nome)
    }

    return (
        <>
            <ToastContainer />
            <TableRow >
                <TableCell align="left" >
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center" >
                    {row.nome}
                </TableCell>
                <TableCell align="right" ><Chip size="small" label={row.ativo === true ? "Ativa" : "Inativa"} color={row.ativo === true ? "success" : "error"} /></TableCell>
                <TableCell align="right" >
                    <span>
                        <abbr title="Editar">
                            <Button
                                style={{ color: '#000000' }}
                                onClick={() => window.location.href = "/editar/produto/" + row.id}
                                size="small"
                            >
                                <CreateIcon />
                            </Button>
                        </abbr>

                        <abbr title={row.ativo ? "Inativar" : "Ativar"}>
                            <Switch
                                color="success"
                                onClick={() => { row.ativo ? handleInactivation(row.id, row.nome) : handleActivation(row.id, row.nome) }}
                                defaultChecked={row.ativo ? true : false}
                            />
                        </abbr>
                    </span>
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

    useEffect(() => {
        async function loadProducts() {
            let response = await api.get('/api/select/products')
            setProducts(response.data)
        }
        loadProducts()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 2, mb: 1 }}>
                    <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                        >
                            <Autocomplete
                                disablePortal
                                options={products.map((row) => row.nome)}
                                sx={{ width: 500 }}
                                renderInput={(params) => <TextField color="secondary" {...params} label="Produtos" />}
                            />
                            <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/cadastrar/produto'>Novo</Button>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TableContainer /*sx={{ maxHeight: 440 }}*/ >
                                    <Table size="medium" stickyHeader >
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell align="left" />
                                                <StyledTableCell align="center" >Produtos</StyledTableCell>
                                                <StyledTableCell align="right" >Situação</StyledTableCell>
                                                <StyledTableCell align="right" />
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
        </ThemeProvider>
    );
}

