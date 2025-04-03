import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Box,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorageIcon from '@mui/icons-material/Storage';
import { useNavigate, useLocation } from 'react-router-dom';

const AppDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'AI + NFT',
      icon: <AutoAwesomeIcon />,
      path: '/'
    },
    {
      text: 'IPFS',
      icon: <StorageIcon />,
      path: '/ipfs'
    }
  ];

  return (
    <>
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 1000,
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            color: 'white',
            width: 240,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            AIBL
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(144, 202, 249, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default AppDrawer; 