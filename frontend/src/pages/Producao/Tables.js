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
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="medium" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" width="50%">A Fazer</StyledTableCell>
                                <StyledTableCell align="center" width="50%">Fazendo</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {processes.map((tier) => (
                                <TableRow key={tier.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={tier.id}>
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
                                                        <Typography variant="h6" align="left"  color="text.secondary">
                                                            NúmeroPedido
                                                        </Typography>
                                                        <Typography variant="h5" align="center" color="text.primary">
                                                            Nome do Produto
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
                                        <Grid key={tier.id}>
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
                                                        <Typography variant="h6" align="left"  color="text.secondary">
                                                            NúmeroPedido
                                                        </Typography>
                                                        <Typography variant="h5" align="center" color="text.primary">
                                                            Nome do Produto
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
