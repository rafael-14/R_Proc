import React from 'react';
import Dashboard from '../components/Dashboard'
import NewRegister from './NewRegister'
import Tables from './Tables';

export function ListarPedidos() {
  return (
    <div>
      <Dashboard componente={Tables}/>
    </div>
  );
};

export function CadastrarPedidos() {
  return (
    <div>
      <Dashboard componente={NewRegister}/>
    </div>
  )
};
