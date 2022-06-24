import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, Checkbox, TableBody, Card,
    Typography, TableCell, CardHeader, CardContent, Container, Grid, TableRow, List, ListItem,
    Box, Toolbar, CardActions, Table, TableHead, Fab,
    Dialog, DialogTitle, TextField, DialogContent, DialogContentText, DialogActions, ListItemText
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getIdSetor } from '../../services/auth';
import RemoveIcon from '@mui/icons-material/Remove';
import QrCode2Icon from '@mui/icons-material/QrCode2';

function HandleDialogUserCode(props) {

    async function verifyCode(value) {
        let response = await api.post(`/api/select/user_by_code`, { code: value })
        if (response.data.status === 200) {
            props.handleUser(response.data.userByCode[0])
        } else {
            props.handleNotificationError('Código Inexistente!')
            props.setCode("")
        }
    }

    return (
        <Dialog open={props.open} onClose={() => { props.setOpen(false); props.setCode("") }} >
            <DialogTitle>Digite Seu Código:</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <TextField
                        autoFocus
                        id="dialogTextField"
                        margin="dense"
                        required
                        fullWidth
                        label="Código"
                        type="password"
                        color="secondary"
                        value={props.code}
                        onChange={e => props.setCode(e.target.value)}
                        onKeyDown={e => e.key === "Enter" ? verifyCode(props.code) : null}
                    />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

function HandleDialogQrCode(props) {

    useEffect(() => {
        props.setQrCode("")
    }, [props.listQrCode])

    function handleListQrCode(value) {
        if (value !== "" && props.listQrCode.indexOf(value) === -1) {
            props.setListQrCode([...props.listQrCode, value])
        } else {
            props.handleNotificationError("QR Code Já Inserido!")
            props.setQrCode("")
        }
    }
    function handleRemoveListQrCode(position) {
        props.listQrCode.splice(position, 1)
        props.setListQrCode([...props.listQrCode])
    }

    function handleProduction() {
        props.setOpen(true)
        if (props.listQrCode.length === 1) {
            props.setFunctionToBeExecuted(props.functionToBeExecuted + "Production")
        } else if (props.listQrCode.length > 1) {
            props.setFunctionToBeExecuted(props.functionToBeExecuted + "ManyProductions")
        }
    }

    return (
        <Dialog open={props.openQrCode} onClose={() => { props.setOpenQrCode(false); props.setListQrCode([]) }} fullWidth>
            <List>
                {props.listQrCode.map((row, position) => (
                    <ListItem>
                        <ListItemText primary={new String(row).substring(0, 50)} />
                        <Fab size="small" style={{ backgroundColor: '#E74C3C', color: "#FFFFFF" }} onClick={() => handleRemoveListQrCode(position)}>
                            <RemoveIcon />
                        </Fab>
                    </ListItem>
                ))}
            </List>
            <DialogContent>
                <DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        label="Leia aqui o QR Code:"
                        color="secondary"
                        value={props.qrCode}
                        onChange={e => props.setQrCode(e.target.value)}
                        onKeyDown={e => e.key === "Enter" ? handleListQrCode(e.target.value.trim()) : null}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                >
                    <Button
                        variant="contained"
                        style={{ background: "#E74C3C", color: "#FFFFFF" }}
                        onClick={() => { props.setOpenQrCode(false); props.setListQrCode([]) }}
                    >
                        Cancelar
                    </Button>
                    {props.listQrCode.length > 0 ?
                        (<Button
                            variant="contained"
                            style={{ color: "#FFFFFF", marginInlineStart: 15 }}
                            onClick={() => handleProduction()}
                        >
                            Iniciar
                        </Button>) : null}
                </Grid>
            </DialogActions>
        </Dialog>
    )
}

export default function Tables() {

    let [code, setCode] = useState("")

    async function handleNotificationError(msg) {
        toast.error(msg, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }

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

    let [paramsID, setParamsID] = useState(null)
    let [paramsName, setParamsName] = useState(null)
    let [paramsOrder, setParamsOrder] = useState(null)
    let [paramsIdNextProcess, setParamsIdNextProcess] = useState(null)
    let [paramsIdProcess, setParamsIdProcess] = useState(null)
    async function handleStartProduction(id_user) {
        setProductionStatus(await api.put(`/api/start/production/${paramsID}`, id_user))
        handleNotification(paramsName, paramsOrder, "Iniciada", toast.info)
    }
    async function handlePauseProduction(id_user, responseQrCode) {
        if (responseQrCode) {
            paramsID = responseQrCode
        }
        let response = await api.post(`/api/verify/user`, { paramsID, id_user })
        if (response.data.status === 200) {
            setProductionStatus(await api.put(`/api/pause/production/${paramsID}`))
            handleNotification(paramsName, paramsOrder, "Pausada", toast.error)
        } else {
            handleNotificationError("Usuário Diferente do Usuário que Iniciou a Produção!")
        }
    }
    async function handleResumeProduction(id_user, responseQrCode) {
        console.log(responseQrCode)
        setProductionStatus(await api.put(`/api/resume/production/${paramsID}`, id_user))
        handleNotification(paramsName, paramsOrder, "Retomada", toast.warning)
    }
    async function handleFinishProduction(id_user) {
        let response = await api.post(`/api/verify/user`, { paramsID, id_user })
        if (response.data.status === 200) {
            setProductionStatus(await api.put(`/api/finish/production/${paramsID}`, { paramsIdNextProcess }))
            handleNotification(paramsName, paramsOrder, "Concluída", toast.success)
        } else {
            handleNotificationError("Usuário Diferente do Usuário que Iniciou a Produção!")
        }
    }
    async function handleStartManyProductions(id_user) {
        setProductionStatus(await api.put(`/api/start/many_productions`, { checkboxStartProduction, id_user }))
        setCheckboxStartProduction([])
        handleNotificationManyProductions("Iniciadas", toast.info)
    }
    async function handlePauseManyProductions(id_user) {
        let response = await api.post(`/api/verify/users`, { checkboxPause_FinishProduction, id_user })
        if (response.data.status === 200) {
            setProductionStatus(await api.put(`/api/pause/many_productions`, { checkboxPause_FinishProduction }))
            setCheckboxPause_FinishProduction([])
            handleNotificationManyProductions("Pausadas", toast.error)
        } else {
            handleNotificationError("Usuário Diferente do Usuário que Iniciou a Produção!")
        }
    }
    async function handleResumeManyProductions(id_user) {
        setProductionStatus(await api.put(`/api/resume/many_productions`, { checkboxResumeProduction, id_user }))
        setCheckboxResumeProduction([])
        handleNotificationManyProductions("Retomadas", toast.warning)
    }
    async function handleFinishManyProductions(id_user) {
        let response = await api.post(`/api/verify/users`, { checkboxPause_FinishProduction, id_user })
        if (response.data.status === 200) {
            setProductionStatus(await api.put(`/api/finish/many_productions`, { checkboxPause_FinishProduction, checkboxNextProcesses }))
            setCheckboxPause_FinishProduction([])
            setCheckboxNextProcesses([])
            handleNotificationManyProductions("Concluídas", toast.success)
        } else {
            handleNotificationError("Usuário Diferente do Usuário que Iniciou a Produção!")
        }
    }

    const [productionStatus, setProductionStatus] = useState(null)
    let [functionToBeExecuted, setFunctionToBeExecuted] = useState(null)
    async function switchFunction(id_user, responseQrCode) {
        switch (functionToBeExecuted) {
            case "handleStartProduction": handleStartProduction(id_user, responseQrCode); break
            case "handlePauseProduction": handlePauseProduction(id_user, responseQrCode); break
            case "handleResumeProduction": handleResumeProduction(id_user, responseQrCode); break
            case "handleFinishProduction": handleFinishProduction(id_user, responseQrCode); break
            case "handleStartManyProductions": handleStartManyProductions(id_user, responseQrCode); break
            case "handlePauseManyProductions": handlePauseManyProductions(id_user, responseQrCode); break
            case "handleResumeManyProductions": handleResumeManyProductions(id_user, responseQrCode); break
            case "handleFinishManyProductions": handleFinishManyProductions(id_user, responseQrCode); break
        }
    }

    let [productionNotStarted, setProductionNotStarted] = useState([])
    let [productionStarted, setProductionStarted] = useState([])
    let [productionPaused, setProductionPaused] = useState([])
    useEffect(() => {
        async function loadProductionNotStarted() {
            let response = await api.post('/api/select/production_not_started', { id_setor: getIdSetor() })
            setProductionNotStarted(response.data)
        }
        loadProductionNotStarted()

        async function loadProductionStarted() {
            let response = await api.post('/api/select/production_started', { id_setor: getIdSetor() })
            setProductionStarted(response.data)
        }
        loadProductionStarted()

        async function loadProductionPaused() {
            let response = await api.post('/api/select/production_paused', { id_setor: getIdSetor() })
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

    let [checkboxIdProcessesStart, setCheckboxIdProcessesStart] = useState([])
    function handleCheckboxIdProcessesStart(idProcess, id) {
        let index = checkboxIdProcessesStart.indexOf(checkboxIdProcessesStart.find(checkboxIdProcessesStart => checkboxIdProcessesStart.id === id))
        if (index === -1) {
            setCheckboxIdProcessesStart([...checkboxIdProcessesStart, { idProcess, id }])
        } else {
            checkboxIdProcessesStart.splice(index, 1)
            setCheckboxIdProcessesStart([...checkboxIdProcessesStart])
        }
    }
    let [checkboxIdProcessesPauseFinish, setCheckboxIdProcessesPauseFinish] = useState([])
    function handleCheckboxIdProcessesPauseFinish(idProcess, id) {
        let index = checkboxIdProcessesPauseFinish.indexOf(checkboxIdProcessesPauseFinish.find(checkboxIdProcessesPauseFinish => checkboxIdProcessesPauseFinish.id === id))
        if (index === -1) {
            setCheckboxIdProcessesPauseFinish([...checkboxIdProcessesPauseFinish, { idProcess, id }])
        } else {
            checkboxIdProcessesPauseFinish.splice(index, 1)
            setCheckboxIdProcessesPauseFinish([...checkboxIdProcessesPauseFinish])
        }
    }
    let [checkboxIdProcessesResume, setCheckboxIdProcessesResume] = useState([])
    function handleCheckboxIdProcessesResume(idProcess, id) {
        let index = checkboxIdProcessesResume.indexOf(checkboxIdProcessesResume.find(checkboxIdProcessesResume => checkboxIdProcessesResume.id === id))
        if (index === -1) {
            setCheckboxIdProcessesResume([...checkboxIdProcessesResume, { idProcess, id }])
        } else {
            checkboxIdProcessesResume.splice(index, 1)
            setCheckboxIdProcessesResume([...checkboxIdProcessesResume])
        }
    }

    let [open, setOpen] = useState(false);
    async function handleUser(data) {
        let responseQrCode
        if (listQrCode.length > 0) {
            responseQrCode = await api.post(`/api/qrcode`, { listQrCode })
            paramsIdProcess = responseQrCode.data[0].id_processo
            responseQrCode = responseQrCode.data[0].id
        }
        switch (functionToBeExecuted) {
            case "handleStartProduction":
            case "handlePauseProduction":
            case "handleResumeProduction":
            case "handleFinishProduction": {
                let response = await api.post(`/api/verify/process_by_user`, { id: data.id, idProcess: paramsIdProcess })
                setOpen(false)
                setOpenQrCode(false)
                setListQrCode([])
                setQrCode("")
                setCode("")
                if (response.data.status === 400) {
                    handleNotificationError('Usuário Não Possui Permissão!')
                }
                else {
                    switchFunction({ id_user: data.id }, responseQrCode)
                }
            }
                break;
            case "handleStartManyProductions":
            case "handlePauseManyProductions":
            case "handleResumeManyProductions":
            case "handleFinishManyProductions": {
                let idProcesses
                switch (functionToBeExecuted) {
                    case "handleStartManyProductions": idProcesses = checkboxIdProcessesStart; break
                    case "handleResumeManyProductions": idProcesses = checkboxIdProcessesResume; break
                    default: idProcesses = checkboxIdProcessesPauseFinish; break
                }
                let response = await api.post(`/api/verify/processes_by_user`, { id: data.id, idProcesses })
                setOpen(false)
                setCode("")
                if (response.data.status === 400) {
                    handleNotificationError('Usuário Não Possui Permissão!')
                }
                else {
                    switchFunction({ id_user: data.id })
                }
            }
                break
        }
    }

    let [openQrCode, setOpenQrCode] = useState(false);
    let [listQrCode, setListQrCode] = useState([])
    let [qrCode, setQrCode] = useState("")

    return (
        <>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <HandleDialogUserCode
                    open={open}
                    setOpen={setOpen}
                    handleUser={handleUser}
                    handleNotificationError={handleNotificationError}
                    code={code}
                    setCode={setCode}
                />
                <HandleDialogQrCode
                    openQrCode={openQrCode}
                    setOpenQrCode={setOpenQrCode}
                    listQrCode={listQrCode}
                    setListQrCode={setListQrCode}
                    qrCode={qrCode}
                    setQrCode={setQrCode}
                    handleNotificationError={handleNotificationError}
                    open={open}
                    setOpen={setOpen}
                    setFunctionToBeExecuted={setFunctionToBeExecuted}
                    functionToBeExecuted={functionToBeExecuted}
                />
                <ToastContainer />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" width="50%" style={{ background: '#E8927C', color: '#FFFFFF' }}>
                                    A Fazer
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="flex-end"
                                        alignItems="baseline"
                                    >
                                        <Button variant="contained" size="small">
                                            <Typography color="#FFFFFF">INICIAR</Typography>
                                            <QrCode2Icon
                                                style={{ color: '#FFFFFF' }}
                                                onClick={() => {
                                                    setOpenQrCode(true);
                                                    setFunctionToBeExecuted("handleStart")
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            {productionNotStarted.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={row.id}>
                                            <Card>
                                                <CardHeader
                                                    title={row.nome_processo}
                                                    titleTypographyProps={{ align: 'right' }}
                                                    subheader={row.nome_proximo_processo ? row.nome_proximo_processo : null/*<br />*/}
                                                    subheaderTypographyProps={{ align: 'right', }}
                                                    avatar={
                                                        <Typography variant="body2" align="left" color="text.secondary">
                                                            {row.id_pedido}
                                                        </Typography>}
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000", maxHeight: 50 }}
                                                />
                                                <CardContent sx={{ maxHeight: 65 }}>
                                                    <Box>
                                                        <Typography variant="body2" align="center" color="text.primary">
                                                            {row.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {row.observacao ? row.observacao : null/*<br />*/}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
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
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    width="50%"
                                    style={{ background: '#E8927C', color: '#FFFFFF' }}
                                >
                                    Fazendo
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-between"
                                    >
                                        <Button variant="contained" size="small">
                                            <QrCode2Icon
                                                style={{ color: '#FFFFFF' }}
                                                onClick={() => {
                                                    setOpenQrCode(true);
                                                    setFunctionToBeExecuted("handlePause")
                                                }}
                                            />
                                            <Typography color="#FFFFFF">PAUSAR</Typography>
                                        </Button>
                                        <Button variant="contained" size="small">
                                            <Typography color="#FFFFFF">FINALIZAR</Typography>
                                            <QrCode2Icon
                                                style={{ color: '#FFFFFF' }}
                                                onClick={() => {
                                                    setOpenQrCode(true);
                                                    setFunctionToBeExecuted("handleFinish")
                                                }} />
                                        </Button>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            {productionStarted.map((rowProduction) => (
                                <TableRow key={rowProduction.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={rowProduction.id}>
                                            <Card>
                                                <CardHeader
                                                    title={rowProduction.nome_processo}
                                                    titleTypographyProps={{ align: 'right', variant: "body2" }}
                                                    subheader={rowProduction.nome_proximo_processo ? rowProduction.nome_proximo_processo : null/*<br />*/}
                                                    subheaderTypographyProps={{ align: 'right', variant: "body2" }}
                                                    avatar={
                                                        <Typography variant="body2" align="left" color="text.secondary">
                                                            {rowProduction.id_pedido}
                                                        </Typography>
                                                    }
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000", maxHeight: 50 }}
                                                />
                                                <CardContent sx={{ maxHeight: 65 }}>
                                                    <Box>
                                                        <Typography variant="body2" align="center" color="text.primary">
                                                            {rowProduction.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {rowProduction.observacao ? rowProduction.observacao : null/*<br />*/}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
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
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    width="50%"
                                    style={{ background: '#E8927C', color: '#FFFFFF' }}
                                >
                                    Pausado
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="flex-end"
                                        alignItems="baseline"
                                    >
                                        <Button variant="contained" size="small">
                                            <Typography color="#FFFFFF">RETOMAR</Typography>
                                            <QrCode2Icon
                                                style={{ color: '#ffffff' }}
                                                onClick={() => {
                                                    setOpenQrCode(true);
                                                    setFunctionToBeExecuted("handleResume")
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            {productionPaused.map((rowProductionPaused) => (
                                <TableRow key={rowProductionPaused.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={rowProductionPaused.id}>
                                            <Card>
                                                <CardHeader
                                                    title={rowProductionPaused.nome_processo}
                                                    titleTypographyProps={{ align: 'right' }}
                                                    subheader={rowProductionPaused.nome_proximo_processo ? rowProductionPaused.nome_proximo_processo : null/*<br />*/}
                                                    subheaderTypographyProps={{ align: 'right', }}
                                                    avatar={
                                                        <Typography variant="body2" align="left" color="text.secondary">
                                                            {rowProductionPaused.id_pedido}
                                                        </Typography>
                                                    }
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000", maxHeight: 50 }}
                                                />
                                                <CardContent sx={{ maxHeight: 65 }}>
                                                    <Box>
                                                        <Typography variant="body2" align="center" color="text.primary">
                                                            {rowProductionPaused.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {rowProductionPaused.observacao ? rowProductionPaused.observacao : null/*<br />*/}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Container>
            </Box >
        </>
    );
}