import React from 'react';
import Dashboard from './Dashboard'
import Tables from './Tables';

function Home() {
  return (
    <div>
      <Dashboard 
        componente={Tables}
      />
    </div>
  );
};

export default Home;