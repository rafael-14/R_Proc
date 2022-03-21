import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home, CadastrarProduto, EditarProduto } from './pages/Home'
import { CadastrarProcessos, EditarProcesso, ListarProcessos } from "./pages/Processos";

function Rotas() {
    return (
        <Router>
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/cadastrar/produto' exact element={<CadastrarProduto />} />
                <Route path='/editar/produto/:id' exact element={<EditarProduto />} />

                <Route path='/processos' exact element={<ListarProcessos />} />
                <Route path='/cadastrar/processo' exact element={<CadastrarProcessos />} />
                <Route path='/editar/processo/:id' exact element={<EditarProcesso />} />
            </Routes>
        </Router>
    );
};

export default Rotas;