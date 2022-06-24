import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, TextField, Autocomplete, Table, Switch,
    TableBody, TableCell, TableHead, TableRow, Container, Grid, Paper,
    Box, Toolbar, TableContainer
} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Tables() {

    async function handleNotification(processName, processSituation) {
        (processSituation === "Inativado" ? toast.error : toast.success)(`Processo: ${processName} ${processSituation} com Sucesso!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }
    const [situation, setSituation] = useState(null)
    async function handleSituation(id, nome, ativo) {
        setSituation(await api.put(`/api/${ativo ? "inactivate" : "activate"}/process/${id}`))
        handleNotification(nome, ativo ? "Inativado" : "Ativado")
    }

    let [processes, setProcesses] = useState([])
    useEffect(() => {
        async function loadProcesses() {
            let response = await api.get('/api/select/processes')
            setProcesses(response.data)
        }
        loadProcesses()
    }, [situation])

    return (
        <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
            <Toolbar />
            <ToastContainer />
            <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
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
                        <Button style={{ background: "#E8927C", color: "#FFFFFF", width: "10%" }} href="/cadastrar/processos">Novo</Button>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table size="medium" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ background: "#E8927C", color: "#FFFFFF" }} align="left">Processos</TableCell>
                                            <TableCell style={{ background: "#E8927C", color: "#FFFFFF" }} align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {processes.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="left">{row.nome}</TableCell>
                                                <TableCell align="right" size="small" width="15%">
                                                    <abbr title="Editar">
                                                        <Button style={{ color: "#000000" }}>
                                                            <CreateIcon />
                                                        </Button>
                                                    </abbr>
                                                    <abbr title={row.ativo ? "Inativar" : "Ativar"}>
                                                        <Switch
                                                            color="success"
                                                            onClick={() => handleSituation(row.id, row.nome, row.ativo)}
                                                            defaultChecked={row.ativo ? true : false}
                                                        />
                                                    </abbr>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}

