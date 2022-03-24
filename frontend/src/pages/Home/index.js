import React from 'react';
import Dashboard from './Dashboard'
import NewRegister from './NewRegister'
import Tables from './Tables';

export function Home() {
  return (
    <div>
      <Dashboard componente={Tables}/>
    </div>
  );
};

export function CadastrarProduto() {
  return (
    <div>
      <Dashboard componente={NewRegister}/>
    </div>
  );
};
