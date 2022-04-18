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

    const [productionStatus, setProductionStatus] = useState(null)
    async function handleStartProduction(id) {
        setProductionStatus(await api.put(`/api/start/production/${id}`))
        //handleNotificationError(name)
    }
    async function handlePauseProduction(id) {
        setProductionStatus(await api.put(`/api/pause/production/${id}`))
        //handleNotificationError(name)
    }
    async function handleResumeProduction(id) {
        setProductionStatus(await api.put(`/api/resume/production/${id}`))
        //handleNotificationError(name)
    }

    let [productionNotStarted, setProductionNotStarted] = useState([])
    let [productionStarted, setProductionStarted] = useState([])
    useEffect(() => {
        async function loadProductionNotStarted() {
            let response = await api.get('/api/select/production_not_started')
            setProductionNotStarted(response.data)
        }
        loadProductionNotStarted()

        async function loadProductionStarted() {
            let response = await api.get('/api/select/production_started')
            setProductionStarted(response.data)
        }
        loadProductionStarted()
    }, [productionStatus])

    return (
        <ThemeProvider theme={theme}>
            {/*<Button onClick={() => console.log(productionNotStarted)}>productionNotStarted</Button>*/}
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>

                <Toolbar />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="medium" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" width="50%">A Fazer</StyledTableCell>
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
                                                    subheader={row.nome_proximo_processo}
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
                                                            {row.observacao}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                                <CardActions>
                                                    <Grid container justifyContent="left">
                                                        <Button
                                                            onClick={() => handleStartProduction(row.id)}
                                                            variant="contained"
                                                            style={{ background: '#E8927C', color: '#FFFFFF' }}
                                                        >
                                                            Iniciar
                                                        </Button>
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
            </Box>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="medium" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" width="50%">Fazendo</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productionStarted.map((rowProduction) => (
                                <TableRow key={rowProduction.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={rowProduction.id}>
                                            <Card>
                                                <CardHeader
                                                    title={rowProduction.nome_processo}
                                                    titleTypographyProps={{ align: 'right' }}
                                                    subheader={rowProduction.nome_proximo_processo}
                                                    subheaderTypographyProps={{ align: 'right', }}
                                                    avatar={<Checkbox />}
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000" }}
                                                />
                                                <CardContent>
                                                    <Box>
                                                        <Typography variant="h6" align="left" color="text.secondary">
                                                            {rowProduction.id_pedido}
                                                        </Typography>
                                                        <Typography variant="h5" align="center" color="text.primary">
                                                            {rowProduction.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {rowProduction.observacao}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                                <CardActions>
                                                    {rowProduction.situacao !== 2 ? (<Grid container justifyContent="space-between">
                                                        <Button
                                                            variant="contained"
                                                            style={{ background: '#E8927C', color: '#FFFFFF' }}
                                                        >
                                                            Finalizar
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            style={{ background: '#E8927C', color: '#FFFFFF' }}
                                                            onClick={() => handlePauseProduction(rowProduction.id)}
                                                        >
                                                            Pausar
                                                        </Button>
                                                    </Grid>) :
                                                        (<Grid container justifyContent="center">
                                                            <Button
                                                                variant="contained"
                                                                style={{ background: '#E8927C', color: '#FFFFFF' }}
                                                                onClick={() => handleResumeProduction(rowProduction.id)}
                                                            >
                                                                Retomar
                                                            </Button>
                                                        </Grid>)}
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

