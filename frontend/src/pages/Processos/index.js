import React from 'react';
import Dashboard from './Dashboard'
import NewRegister from './NewRegister'
import Tables from './Tables';

export function ListarProcessos() {
  return (
    <div>
      <Dashboard componente={Tables}/>
    </div>
  );
};

export function CadastrarProcessos() {
  return (
    <div>
      <Dashboard componente={NewRegister}/>
    </div>
  );
};
