import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, Checkbox, TableBody, Card, styled, tableCellClasses,
    Typography, TableCell, CardHeader, CardContent, Container, Grid, TableRow,
    Box, Toolbar, CardActions, createTheme, ThemeProvider, Table, TableHead
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            primary: { main: '#E8927C' },
            secondary: { main: '#000000' }
        }
    })

    async function handleNotification(nome_produto, id_pedido, status, toast) {
        toast(`Produção do Produto: ${nome_produto} do Pedido: ${id_pedido} ${status}!`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }
    async function handleNotificationManyProductions(status, toast) {
        toast(`Produções ${status}!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }

    const [productionStatus, setProductionStatus] = useState(null)
    async function handleStartProduction(id, nome_produto, id_pedido) {
        setProductionStatus(await api.put(`/api/start/production/${id}`))
        handleNotification(nome_produto, id_pedido, "Iniciada", toast.info)
    }
    async function handlePauseProduction(id, nome_produto, id_pedido) {
        setProductionStatus(await api.put(`/api/pause/production/${id}`))
        handleNotification(nome_produto, id_pedido, "Pausada", toast.error)
    }
    async function handleResumeProduction(id, nome_produto, id_pedido) {
        setProductionStatus(await api.put(`/api/resume/production/${id}`))
        handleNotification(nome_produto, id_pedido, "Retomada", toast.warning)
    }
    async function handleFinishProduction(id, id_proximo_processo, nome_produto, id_pedido) {
        setProductionStatus(await api.put(`/api/finish/production/${id}`, { id_proximo_processo }))
        handleNotification(nome_produto, id_pedido, "Concluída", toast.success)
    }
    async function handleStartManyProductions() {
        setProductionStatus(await api.post(`/api/start/many_productions`, { checkboxStartProduction }))
        setCheckboxStartProduction([])
        handleNotificationManyProductions("Iniciadas", toast.info)
    }
    async function handlePauseManyProductions() {
        setProductionStatus(await api.post(`/api/pause/many_productions`, { checkboxPause_FinishProduction }))
        setCheckboxPause_FinishProduction([])
        handleNotificationManyProductions("Pausadas", toast.error)
    }
    async function handleResumeManyProductions() {
        setProductionStatus(await api.post(`/api/resume/many_productions`, { checkboxResumeProduction }))
        setCheckboxResumeProduction([])
        handleNotificationManyProductions("Retomadas", toast.warning)
    }
    async function handleFinishManyProductions() {
        setProductionStatus(await api.post(`/api/finish/many_productions`, { checkboxPause_FinishProduction, checkboxNextProcesses }))
        setCheckboxPause_FinishProduction([])
        setCheckboxNextProcesses([])
        handleNotificationManyProductions("Concluídas", toast.success)
    }

    let [productionNotStarted, setProductionNotStarted] = useState([])
    let [productionStarted, setProductionStarted] = useState([])
    let [productionPaused, setProductionPaused] = useState([])
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

        async function loadProductionPaused() {
            let response = await api.get('/api/select/production_paused')
            setProductionPaused(response.data)
        }
        loadProductionPaused()
    }, [productionStatus])

    let [checkboxStartProduction, setCheckboxStartProduction] = useState([])
    function handleCheckboxStartProduction(id) {
        let indexProduction = checkboxStartProduction.indexOf(id)
        if (indexProduction !== -1) {
            checkboxStartProduction.splice(indexProduction, 1)
            setCheckboxStartProduction([...checkboxStartProduction])
        } else {
            setCheckboxStartProduction([...checkboxStartProduction, id])
        }
    }
    let [checkboxPause_FinishProduction, setCheckboxPause_FinishProduction] = useState([])
    let [checkboxNextProcesses, setCheckboxNextProcesses] = useState([])
    function handleCheckboxPause_FinishProduction(id, id_proximo_processo) {
        let indexProduction = checkboxPause_FinishProduction.indexOf(id)
        if (indexProduction !== -1) {
            checkboxPause_FinishProduction.splice(indexProduction, 1)
            checkboxNextProcesses.splice(indexProduction, 1)
            setCheckboxPause_FinishProduction([...checkboxPause_FinishProduction])
            setCheckboxNextProcesses([...checkboxNextProcesses])
        } else {
            setCheckboxPause_FinishProduction([...checkboxPause_FinishProduction, id])
            setCheckboxNextProcesses([...checkboxNextProcesses, id_proximo_processo])
        }
    }
    let [checkboxResumeProduction, setCheckboxResumeProduction] = useState([])
    function handleCheckboxResumeProduction(id) {
        let indexProduction = checkboxResumeProduction.indexOf(id)
        if (indexProduction !== -1) {
            checkboxResumeProduction.splice(indexProduction, 1)
            setCheckboxResumeProduction([...checkboxResumeProduction])
        } else {
            setCheckboxResumeProduction([...checkboxResumeProduction, id])
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <ToastContainer />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="medium" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" width="50%">
                                    A Fazer
                                </StyledTableCell>
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
                                                    avatar={<Checkbox onClick={() => handleCheckboxStartProduction(row.id)} />}
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
                                                            onClick={() => {
                                                                checkboxStartProduction.length === 0 ?
                                                                    handleStartProduction(row.id, row.nome_produto, row.id_pedido)
                                                                    : handleStartManyProductions()
                                                            }}
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
                                                    avatar={
                                                        <Checkbox onClick={
                                                            () => handleCheckboxPause_FinishProduction(rowProduction.id, rowProduction.id_proximo_processo)
                                                        } />
                                                    }
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
                                                    <Grid container justifyContent="space-between">
                                                        <Button
                                                            variant="contained"
                                                            style={{ background: '#E8927C', color: '#FFFFFF' }}
                                                            onClick={() => {
                                                                checkboxPause_FinishProduction.length === 0 ?
                                                                    handleFinishProduction(rowProduction.id, rowProduction.id_proximo_processo, rowProduction.nome_produto, rowProduction.id_pedido)
                                                                    : handleFinishManyProductions()
                                                            }}
                                                        >
                                                            Finalizar
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            style={{ background: '#E8927C', color: '#FFFFFF' }}
                                                            onClick={() => {
                                                                checkboxPause_FinishProduction.length === 0 ?
                                                                    handlePauseProduction(rowProduction.id, rowProduction.nome_produto, rowProduction.id_pedido)
                                                                    : handlePauseManyProductions()
                                                            }}
                                                        >
                                                            Pausar
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
            </Box >
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="medium" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" width="50%">Pausado</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productionPaused.map((rowProductionPaused) => (
                                <TableRow key={rowProductionPaused.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={rowProductionPaused.id}>
                                            <Card>
                                                <CardHeader
                                                    title={rowProductionPaused.nome_processo}
                                                    titleTypographyProps={{ align: 'right' }}
                                                    subheader={rowProductionPaused.nome_proximo_processo}
                                                    subheaderTypographyProps={{ align: 'right', }}
                                                    avatar={<Checkbox onClick={() => handleCheckboxResumeProduction(rowProductionPaused.id)} />}
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000" }}
                                                />
                                                <CardContent>
                                                    <Box>
                                                        <Typography variant="h6" align="left" color="text.secondary">
                                                            {rowProductionPaused.id_pedido}
                                                        </Typography>
                                                        <Typography variant="h5" align="center" color="text.primary">
                                                            {rowProductionPaused.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {rowProductionPaused.observacao}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                                <CardActions>
                                                    <Grid container justifyContent="center">
                                                        <Button
                                                            variant="contained"
                                                            style={{ background: '#E8927C', color: '#FFFFFF' }}
                                                            onClick={() => {
                                                                checkboxResumeProduction.length === 0 ?
                                                                    handleResumeProduction(rowProductionPaused.id, rowProductionPaused.nome_produto, rowProductionPaused.id_pedido)
                                                                    : handleResumeManyProductions()
                                                            }}
                                                        >
                                                            Retomar
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
            </Box >
        </ThemeProvider >
    );
}

