import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import {
    Button, TextField, Autocomplete, Table,
    TableBody, TableCell, TableHead, TableRow, Container, Grid, Paper,
    Box, Toolbar, TableContainer, Collapse, createTheme, Switch,
    IconButton, Typography, ThemeProvider, Chip
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CreateIcon from '@mui/icons-material/Create';

function Row(props) {

    const { row } = props;
    const [open, setOpen] = React.useState(false);

    let [processesByProduct, setProcessesByProduct] = useState([])
    useEffect(() => {
        async function loadProcessesByProduct() {
            let response = await api.put(`/api/select/processes_by_product/${row.id}`)
            setProcessesByProduct(response.data)
        }
        if (open) {
            loadProcessesByProduct()
        }
    }, [open])

    return (
        <>
            <TableRow >
                <TableCell width="1%">
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center" width="69%">
                    {row.nome}
                </TableCell>
                <TableCell align="center" width="15%">
                    <Chip size="small" label={row.ativo ? "Ativa" : "Inativa"} color={row.ativo ? "success" : "error"} />
                </TableCell>
                <TableCell align="right" size="small" width="15%">
                    <abbr title="Editar">
                        <Button style={{ color: '#000000' }}>
                            <CreateIcon />
                        </Button>
                        <abbr title={row.ativo ? "Inativar" : "Ativar"}>
                            <Switch
                                color="success"
                                onClick={() => { row.ativo ? props.handleInactivation(row.id, row.nome) : props.handleActivation(row.id, row.nome) }}
                                defaultChecked={row.ativo ? true : false}
                            />
                        </abbr>
                    </abbr>
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
                                        {processesByProduct.map((row) => (
                                            row.sequencia ?
                                                <TableCell
                                                    align="center"
                                                    style={{ background: '#FBECE8', color: '#000000' }}
                                                >
                                                    {row.sequencia}º Processo
                                                </TableCell>
                                                : null
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processesByProduct.map((row) => (
                                        <TableCell align="center" >{row.id_processo}</TableCell>
                                    ))}
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
            primary: { main: '#FF7A40' },
            secondary: { main: '#000000' }
        }
    })

    async function handleNotificationSuccess(productName) {
        toast.success(`Produto: ${productName} Ativado com Sucesso!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }
    async function handleNotificationError(productName) {
        toast.error(`Produto: ${productName} Inativado com Sucesso!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }

    const [productSituation, setProductSituation] = useState(null)
    async function handleInactivation(id, name) {
        setProductSituation(await api.put(`/api/inactivate/product/${id}`))
        handleNotificationError(name)
    }
    async function handleActivation(id, name) {
        setProductSituation(await api.put(`/api/activate/product/${id}`))
        handleNotificationSuccess(name)
    }

    let [products, setProducts] = useState([])
    useEffect(() => {
        async function loadProducts() {
            let response = await api.get('/api/select/products')
            setProducts(response.data)
        }
        loadProducts()
    }, [productSituation])

    return (
        <ThemeProvider theme={theme}>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <ToastContainer />
                <Container maxWidth="xg" sx={{ mt: 2, mb: 1 }}>
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
                            <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/cadastrar/produtos'>Novo</Button>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TableContainer /*sx={{ maxHeight: 440 }}*/ >
                                    <Table size="medium" stickyHeader >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left" width="1%" />
                                                <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="center" width="69%">Produtos</TableCell>
                                                <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="center" width="15%">Situação</TableCell>
                                                <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="right" width="15%" />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {products.map((row) => (
                                                <Row
                                                    key={row.id}
                                                    row={row}
                                                    handleActivation={handleActivation}
                                                    handleInactivation={handleInactivation}
                                                />
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

