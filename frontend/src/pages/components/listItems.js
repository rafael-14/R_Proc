import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ApartmentIcon from '@mui/icons-material/Apartment';


export const mainListItems = (
  <div>
    <ListItem button component="a" href="/" >
      <ListItemIcon >
        <ApartmentIcon style={{ color: '#000000' }} />
      </ListItemIcon>
      <ListItemText primary="Produtos" primaryTypographyProps={{ color: '#000000' }} />
    </ListItem>
  </div>
);