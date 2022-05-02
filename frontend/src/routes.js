import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ListarProdutos, CadastrarProduto } from './pages/Produtos'
import { CadastrarProcessos, ListarProcessos } from "./pages/Processos";
import { ListarUsuarios, CadastrarUsuarios } from "./pages/Usuarios";
import { ListarPedidos, CadastrarPedidos } from "./pages/Pedidos";
import { ListarSetores, CadastrarSetores } from "./pages/Setores";
import { ListarProducao } from "./pages/Producao";
import Login from "./pages/Login";

function Rotas() {
    return (
        <Router>
            <Routes>
                <Route path='/login' exact element={<Login />} />

                <Route path='/' exact element={<ListarProducao />} />
                <Route path='/produtos' exact element={<ListarProdutos />} />
                <Route path='/cadastrar/produtos' exact element={<CadastrarProduto />} />
                <Route path='/processos' exact element={<ListarProcessos />} />
                <Route path='/cadastrar/processos' exact element={<CadastrarProcessos />} />
                <Route path='/usuarios' exact element={<ListarUsuarios />} />
                <Route path='/cadastrar/usuarios' exact element={<CadastrarUsuarios />} />
                <Route path='/pedidos' exact element={<ListarPedidos />} />
                <Route path='/fazer/pedidos' exact element={<CadastrarPedidos />} />
                <Route path='/setores' exact element={<ListarSetores />} />
                <Route path='/cadastrar/setores' exact element={<CadastrarSetores />} />
            </Routes>
        </Router>
    );
};

export default Rotas;