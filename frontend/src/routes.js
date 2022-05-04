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
                {/*<Route exact path='/' element={<ListarProducao />} />*/}

                <Route path='/' element={<PrivateRoute element={<ListarProducao />} />}>
                </Route>

                <Route path='/login' element={<Login />} />



                <Route exact path='/produtos' element={<ListarProdutos />} />
                <Route exact path='/cadastrar/produtos' element={<CadastrarProduto />} />
                <Route exact path='/processos' element={<ListarProcessos />} />
                <Route exact path='/cadastrar/processos' element={<CadastrarProcessos />} />
                <Route exact path='/usuarios' element={<ListarUsuarios />} />
                <Route exact path='/cadastrar/usuarios' element={<CadastrarUsuarios />} />
                <Route exact path='/pedidos' element={<ListarPedidos />} />
                <Route exact path='/fazer/pedidos' element={<CadastrarPedidos />} />
                <Route exact path='/setores' element={<ListarSetores />} />
                <Route exact path='/cadastrar/setores' element={<CadastrarSetores />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Rotas;