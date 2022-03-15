import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'

function Rotas() {
    return (
        <Router>
            <Routes>
                <Route path='/' exact element={<Home />} />
            </Routes>
        </Router>
    );
};

export default Rotas;