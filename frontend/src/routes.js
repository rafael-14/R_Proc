import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ListarProdutos, CadastrarProduto } from './pages/Produtos'
import { CadastrarProcessos, ListarProcessos } from "./pages/Processos";
import { ListarUsuarios, CadastrarUsuarios } from "./pages/Usuarios";
import { ListarPedidos, CadastrarPedidos } from "./pages/Pedidos";
import { ListarSetores, CadastrarSetores } from "./pages/Setores";
import { ListarProducao } from "./pages/Producao";
import Login from "./pages/Login";
import PrivateRoute from './services/wAuth';

function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<PrivateRoute><ListarProducao /></PrivateRoute>} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/produtos' element={<PrivateRoute><ListarProdutos /></PrivateRoute>} />
                <Route exact path='/cadastrar/produtos' element={<PrivateRoute><CadastrarProduto /></PrivateRoute>} />
                <Route exact path='/processos' element={<PrivateRoute><ListarProcessos /></PrivateRoute>} />
                <Route exact path='/cadastrar/processos' element={<PrivateRoute><CadastrarProcessos /></PrivateRoute>} />
                <Route exact path='/usuarios' element={<PrivateRoute><ListarUsuarios /></PrivateRoute>} />
                <Route exact path='/cadastrar/usuarios' element={<PrivateRoute><CadastrarUsuarios /></PrivateRoute>} />
                <Route exact path='/pedidos' element={<PrivateRoute><ListarPedidos /></PrivateRoute>} />
                <Route exact path='/fazer/pedidos' element={<PrivateRoute><CadastrarPedidos /></PrivateRoute>} />
                <Route exact path='/setores' element={<PrivateRoute><ListarSetores /></PrivateRoute>} />
                <Route exact path='/cadastrar/setores' element={<PrivateRoute><CadastrarSetores /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Rotas;