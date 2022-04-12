import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, styled, tableCellClasses, TextField, Autocomplete, Card,
    Typography, TableCell, CardHeader, CardContent, Container, Grid, Paper,
    Box, Toolbar, CardActions, createTheme, ThemeProvider
} from "@mui/material";
import StarIcon from '@mui/icons-material/StarBorder';

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
                        <Grid container spacing={5} alignItems="flex-end">
                            {processes.map((tier) => (
                                // Enterprise card is full width at sm breakpoint
                                <Grid
                                    item
                                    key={tier.id}
                                    xs={12}
                                    sm={tier.nome === 'Enterprise' ? 12 : 6}
                                    md={4}
                                >
                                    <Card>
                                        <CardHeader
                                            title={tier.nome}
                                            subheader={tier.nome}
                                            titleTypographyProps={{ align: 'center' }}
                                            action={tier.nome === 'Pro' ? <StarIcon /> : null}
                                            subheaderTypographyProps={{
                                                align: 'center',
                                            }}
                                            sx={{
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode === 'light'
                                                        ? theme.palette.grey[200]
                                                        : theme.palette.grey[700],
                                            }}
                                        />
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'baseline',
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography component="h2" variant="h3" color="text.primary">
                                                    ${tier.nome}
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    /mo
                                                </Typography>
                                            </Box>
                                            {/*<ul>
                                                {tier.description.map((line) => (
                                                    <Typography
                                                        component="li"
                                                        variant="subtitle1"
                                                        align="center"
                                                        key={line}
                                                    >
                                                        {line}
                                                    </Typography>
                                                ))}
                                                </ul>*/}
                                        </CardContent>
                                        <CardActions>
                                            <Button fullWidth variant={tier.buttonVariant}>
                                                {tier.buttonText}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    
                </Container>
            </Box >
        </ThemeProvider >
    );
}

