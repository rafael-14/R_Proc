import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, Checkbox, TableBody, Card, styled, tableCellClasses,
    Typography, TableCell, CardHeader, CardContent, Container, Grid, TableRow,
    Box, Toolbar, CardActions, createTheme, ThemeProvider, Table, TableHead
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#E8927C",
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

export default function Tables() {

    const theme = createTheme({
        palette: {
            primary: { main: '#FF7A40' },
            secondary: { main: '#000000' }
        }
    })

    let [productionNotStarted, setProductionNotStarted] = useState([])
    useEffect(() => {
        async function loadProductionNotStarted() {
            let response = await api.get('/api/select/production_not_started')
            setProductionNotStarted(response.data)
        }
        loadProductionNotStarted()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="medium" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" width="50%">A Fazer</StyledTableCell>
                                <StyledTableCell align="center" width="50%">Fazendo</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productionNotStarted.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={row.id}>
                                            <Card>
                                                <CardHeader
                                                    title={row.nome_processo}
                                                    titleTypographyProps={{ align: 'right' }}
                                                    subheader="próximo processo"
                                                    subheaderTypographyProps={{ align: 'right', }}
                                                    avatar={<Checkbox />}
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000" }}
                                                />
                                                <CardContent>
                                                    <Box>
                                                        <Typography variant="h6" align="left" color="text.secondary">
                                                            {row.id_pedido}
                                                        </Typography>
                                                        <Typography variant="h5" align="center" color="text.primary">
                                                            {row.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Observação do Produto, apareça caso tenha alguma info
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                                <CardActions>
                                                    <Grid container justifyContent="left">
                                                        <Button variant="contained" style={{ background: '#E8927C', color: '#FFFFFF' }}>Iniciar</Button>
                                                    </Grid>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="center" width="50%">
                                        <Grid key={row.id}>
                                            <Card>
                                                <CardHeader
                                                    title="processo a ser realizado"
                                                    titleTypographyProps={{ align: 'right' }}
                                                    subheader="próximo processo"
                                                    subheaderTypographyProps={{ align: 'right', }}
                                                    avatar={<Checkbox />}
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000" }}
                                                />
                                                <CardContent>
                                                    <Box>
                                                        <Typography variant="h6" align="left" color="text.secondary">
                                                            Número do Pedido
                                                        </Typography>
                                                        <Typography variant="h5" align="center" color="text.primary">
                                                            Nome do Produto
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Observação do Produto, apareça caso tenha alguma info
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                                <CardActions>
                                                    <Grid container justifyContent="space-between">
                                                        <Button variant="contained" style={{ background: '#E8927C', color: '#FFFFFF' }}>Finalizar</Button>
                                                        <Button variant="contained" style={{ background: '#E8927C', color: '#FFFFFF' }}>Pausar</Button>
                                                    </Grid>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Container>
            </Box >
        </ThemeProvider >
    );
}

