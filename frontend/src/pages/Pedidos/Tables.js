import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, TextField, Autocomplete, Table, Typography, IconButton,
    TableBody, TableCell, TableHead, TableRow, Container, Grid, Chip,
    Box, Toolbar, TableContainer, createTheme, ThemeProvider, Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {

    const { row } = props;
    const [open, setOpen] = useState(false);

    let [productsByOrder, setProductsByOrder] = useState([])
    useEffect(() => {
        async function loadProductsByOrder() {
            let response = await api.put(`/api/select/products_by_order/${row.id}`)
            setProductsByOrder(response.data)
        }
        if (open) {
            loadProductsByOrder()
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
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">
                    <Chip size="small" label={row.status ? row.status : "Concluído"} color={row.status ? "error" : "success"} />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6">
                                Produtos
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ background: '#FBECE8', color: '#000000' }} align="left">Produtos</TableCell>
                                        <TableCell style={{ background: '#FBECE8', color: '#000000' }} align="left">Quantidade</TableCell>
                                        <TableCell style={{ background: '#FBECE8', color: '#000000' }} align="left">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productsByOrder.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="left">{row.nome}</TableCell>
                                            <TableCell align="left">{row.quantidade}</TableCell>
                                            <TableCell align="left">
                                                <Chip size="small" label={row.status ? row.status : "Concluído"} color={row.status ? "error" : "success"} />
                                            </TableCell>
                                        </TableRow>
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

    let [orders, setOrders] = useState([])
    useEffect(() => {
        async function loadOrders() {
            let response = await api.get('/api/select/orders')
            setOrders(response.data)
        }
        loadOrders()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Autocomplete
                            disablePortal
                            options={orders.map((row) => row.id)}
                            sx={{ width: 500 }}
                            renderInput={(params) => <TextField color="secondary" {...params} label="Pedidos" />}
                        />
                        <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/fazer/pedidos'>Novo</Button>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table size="medium" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left" width="1%" />
                                            <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left">Pedidos</TableCell>
                                            <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left">Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map((row) => (
                                            <Row
                                                key={row.id}
                                                row={row}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider >
    );
}

