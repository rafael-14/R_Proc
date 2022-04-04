import React from 'react';
import Dashboard from './Dashboard'
import NewRegister from './NewRegister'
import Tables from './Tables';

export function ListarUsuarios() {
  return (
    <div>
      <Dashboard componente={Tables}/>
    </div>
  );
};

export function CadastrarUsuarios() {
  return (
    <div>
      <Dashboard componente={NewRegister}/>
    </div>
  );
};
