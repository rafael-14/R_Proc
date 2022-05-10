import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, styled, tableCellClasses, TextField, Autocomplete, Table,
    TableBody, TableCell, TableHead, TableRow, Container, Grid, Paper,
    Box, Toolbar, TableContainer, createTheme, ThemeProvider
} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';

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
                            <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/cadastrar/processos'>Novo</Button>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TableContainer>
                                    <Table size="medium" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">Processos</StyledTableCell>
                                                <StyledTableCell align="right"></StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {processes.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell align="left">{row.nome}</TableCell>
                                                    <TableCell align="right" size="small" width="1%">
                                                        <abbr title="Editar">
                                                            <Button style={{ color: '#000000' }}>
                                                                <CreateIcon />
                                                            </Button>
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
        </ThemeProvider >
    );
}

