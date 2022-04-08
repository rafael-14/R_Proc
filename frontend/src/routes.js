import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home, CadastrarProduto } from './pages/Home'
import { CadastrarProcessos, ListarProcessos } from "./pages/Processos";
import { ListarUsuarios, CadastrarUsuarios } from "./pages/Usuarios";
import { ListarPedidos, FazerPedidos } from "./pages/Pedidos";

function Rotas() {
    return (
        <Router>
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/cadastrar/produtos' exact element={<CadastrarProduto />} />
                <Route path='/processos' exact element={<ListarProcessos />} />
                <Route path='/cadastrar/processos' exact element={<CadastrarProcessos />} />
                <Route path='/usuarios' exact element={<ListarUsuarios />} />
                <Route path='/cadastrar/usuarios' exact element={<CadastrarUsuarios />} />
                <Route path='/pedidos' exact element={<ListarPedidos />} />
                <Route path='/fazer/pedidos' exact element={<FazerPedidos />} />
            </Routes>
        </Router>
    );
};

export default Rotas;