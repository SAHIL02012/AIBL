import React from 'react';
import { Box, Typography } from '@mui/material';

const IPFSPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        padding: '2rem',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        IPFS Page
      </Typography>
      <Typography variant="body1">
        This is the IPFS page. Content will be added later.
      </Typography>
    </Box>
  );
};

export default IPFSPage; 