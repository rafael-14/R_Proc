import React, { useEffect, useState } from "react";
import api from '../../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Button, Autocomplete,
    Container, Grid, Box, TextField, Toolbar, CircularProgress
} from "@mui/material";
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CadastrarProcessos() {

    const router = useRouter()
    const query = router.query
    const id = query.id;

    async function handleNotificationSuccess(processName) {
        toast.success(`Processo: ${processName} Editado com Sucesso!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            onClose: () => {
                setProgress(false)
                window.location.href = "/listar/processos"
            },
            onOpen: () => {
                setProcessName("")
                setProgress(true)
            }
        })
    }
    async function handleNotificationError(errorMessage, fieldToBeFocused) {
        toast.error(errorMessage, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            onOpen: () => fieldToBeFocused ? document.getElementById(fieldToBeFocused).focus() : null,
        })
    }

    let [processName, setProcessName] = useState("")

    async function handleEditProcess() {
        processName = processName.trim()
        if (processName !== "") {
            let data = { processName, bipType: bipType.id }
            try {
                let response = await api.put(`/api/update/process/${parseInt(id)}`, data)
                console.log(response.status)
                if (response.status === 200) {
                    handleNotificationSuccess(processName)
                }
            } catch (e) {
                handleNotificationError(`Há Produtos em Produção Cujo Processo: ${processName} está em Andamento. 
                    Favor Concluir a Produção Para Efetuar a Alteração!`)
            }
        } else {
            handleNotificationError("Preencha o Nome do Processo Corretamente!", "processName")
        }
    }

    let [progress, setProgress] = useState(false)
    let [bipType, setBipType] = useState({ label: "Obrigatória", id: 1 })

    useEffect(() => {
        if (!id) return
        async function loadProcess() {
            let response = await api.put(`/api/select/process/${parseInt(id)}`)
            setProcessName(response.data.nome)
            setBipType({
                label: response.data.bipagem === 1 ? "Obrigatória" : "Nenhuma",
                id: response.data.bipagem
            })
        }
        loadProcess()
    }, [id])

    return (
        <Box component="main" sx={{ flexGrow: 1 }}>
            <Toolbar />
            <ToastContainer />
            <Container maxWidth="xg" sx={{ mt: 2 }}>
                <Grid container>
                    <TextField
                        id="processName"
                        required
                        label="Processo"
                        color="secondary"
                        value={processName}
                        onChange={e => setProcessName(e.target.value)}
                        style={{ marginBottom: 5 }}
                        sx={{ width: "80%" }}
                    />
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={bipType}
                        onChange={(_event, newValue) => setBipType(newValue)}
                        options={[
                            { label: "Obrigatória", id: 1 },
                            { label: "Nenhuma", id: 0 }
                        ]}
                        disableClearable
                        sx={{ width: "19%" }}
                        style={{ marginInlineStart: "1%" }}
                        renderInput={(params) => <TextField {...params} color="secondary" label="Bipagem" />}
                    />
                </Grid>
                <Grid container justifyContent="flex-end">
                    {!progress ?
                        (<>
                            <Link href="/listar/processos">
                                <Button variant="contained" style={{ background: '#E74C3C', color: "#FFFFFF" }}>
                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                variant="contained"
                                style={{ color: '#FFFFFF', marginInlineStart: 15, backgroundColor: "#E8927C" }}
                                onClick={() => handleEditProcess()}
                            >
                                Salvar
                            </Button>
                        </>) :
                        (<Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>)}
                </Grid>
            </Container>
        </Box>
    );
}