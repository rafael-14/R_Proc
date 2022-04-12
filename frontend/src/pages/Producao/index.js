import React from 'react';
import Dashboard from '../components/Dashboard'
import Tables from './Tables';

export function ListarProducao() {
  return (
    <div>
      <Dashboard componente={Tables}/>
    </div>
  );
};