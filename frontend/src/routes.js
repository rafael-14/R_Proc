import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home, CadastrarProduto } from './pages/Home'
import { CadastrarProcessos, ListarProcessos } from "./pages/Processos";

function Rotas() {
    return (
        <Router>
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/cadastrar_produto' exact element={<CadastrarProduto />} />
                <Route path='/processos' exact element={<ListarProcessos />} />
                <Route path='/cadastrar_processo' exact element={<CadastrarProcessos />} />
            </Routes>
        </Router>
    );
};

export default Rotas;