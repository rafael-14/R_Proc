import React, { useEffect, useState } from 'react';
import api from './api';
import { login, logout, getToken } from './auth';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
//api/check/token

export default function WAuth({ component: Component, ...rest }) {
    const [redirect, setRedirect] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function verify() {
            var res = await api.get('/api/check/token', { params: { token: getToken() } })
            console.log(res.data.status)
            if (res.data.status === 200) {
                setLoading(false);
                setRedirect(false);
            } else {
                logout();
                setLoading(false);
                setRedirect(true);
            }
        }
        verify();
    }, [])

    return (
        loading ? "Carregando" :
            <Routes>
                <Route
                    {...rest}
                    render={
                        props => !redirect ? (<Component {...props} />)
                            : <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
                    }
                />
            </Routes>

    )
}