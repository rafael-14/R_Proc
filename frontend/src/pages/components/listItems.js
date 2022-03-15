import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PoolIcon from '@mui/icons-material/Pool';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export const mainListItems = (
  <div>
    <ListItem button component="a" href="/empresa" >
      <ListItemIcon >
        <ApartmentIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Empresas" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
    <ListItem button component="a" href="/centro_custo">
      <ListItemIcon>
        <AttachMoneyIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Centros de Custo" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
    <ListItem button component="a" href="/departamento">
      <ListItemIcon>
        <AccountBoxIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Departamentos" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
    <ListItem button component="a" href="/cargo">
      <ListItemIcon>
        <ManageAccountsIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Cargos" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
    <ListItem button component="a" href="/funcionario">
      <ListItemIcon>
        <PeopleIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Funcionários" primaryTypographyProps={{ color: '#000000'}} />
    </ListItem>
    <ListItem button component="a" href="/ferias">
      <ListItemIcon>
        <PoolIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Férias" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
  </div>
);