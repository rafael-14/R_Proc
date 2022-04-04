import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonIcon from '@mui/icons-material/Person';


export const mainListItems = (
  <>
    <ListItem button component="a" href="/processos" >
      <ListItemIcon >
        <PrecisionManufacturingIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Processos" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
    <ListItem button component="a" href="/" >
      <ListItemIcon >
        <DiamondIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Produtos" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
    <ListItem button component="a" href="/usuarios" >
      <ListItemIcon >
        <PersonIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Usuários" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
  </>
);