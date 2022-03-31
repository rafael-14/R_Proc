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
                                        {processesByProduct.map((row) => (
                                            row.sequencia ?
                                                <TableCell align="center">{row.sequencia} Processo</TableCell>
                                                : null
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processesByProduct.map((row) => (
                                        <TableCell align="center">{row.id}</TableCell>
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
                                                <StyledTableCell width="1%" />
                                                <StyledTableCell align="center" width="99%">Produtos</StyledTableCell>
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

