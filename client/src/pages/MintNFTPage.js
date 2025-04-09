import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MintNFTPage = () => {
  const [fileFormat, setFileFormat] = useState('image');
  const [blockchain, setBlockchain] = useState('polygon');
  const [cid, setCid] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement minting logic
    console.log('Minting NFT with:', { fileFormat, blockchain, cid });
  };

  const handleReset = () => {
    setFileFormat('image');
    setBlockchain('polygon');
    setCid('');
  };

  const handleIPFSRedirect = () => {
    navigate('/ipfs');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#121212',
        padding: '2rem',
        color: 'white',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2rem',
          background: '#1e1e1e',
          borderRadius: '12px',
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, color: '#90caf9', textAlign: 'center' }}>
          Mint NFT
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* File Format Selection */}
          <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
            <FormLabel sx={{ color: 'white' }}>File Format</FormLabel>
            <RadioGroup
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
              sx={{ color: 'white' }}
            >
              <FormControlLabel value="image" control={<Radio />} label="Image" />
              <FormControlLabel value="audio" control={<Radio />} label="Audio" />
              <FormControlLabel value="video" control={<Radio />} label="Video" />
            </RadioGroup>
          </FormControl>

          {/* Blockchain Selection */}
          <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
            <FormLabel sx={{ color: 'white' }}>Blockchain Network</FormLabel>
            <RadioGroup
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
              sx={{ color: 'white' }}
            >
              <FormControlLabel value="polygon" control={<Radio />} label="Polygon Amoy" />
              <FormControlLabel value="ethereum" control={<Radio />} label="Ethereum Sepolia" />
            </RadioGroup>
          </FormControl>

          {/* CID Input with IPFS Redirect Button */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            <TextField
              fullWidth
              label="IPFS CID"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#90caf9',
                  },
                  '&:hover fieldset': {
                    borderColor: '#64b5f6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
              }}
            />
            <Button
              onClick={handleIPFSRedirect}
              sx={{
                position: 'absolute',
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#90caf9',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: 'rgba(144, 202, 249, 0.1)',
                },
              }}
            >
              Don't have file on IPFS? Click here
            </Button>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: '#90caf9',
                '&:hover': {
                  background: '#64b5f6',
                },
                minWidth: '120px',
              }}
            >
              Mint NFT
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              sx={{
                color: '#90caf9',
                borderColor: '#90caf9',
                '&:hover': {
                  borderColor: '#64b5f6',
                  background: 'rgba(144, 202, 249, 0.1)',
                },
                minWidth: '120px',
              }}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default MintNFTPage; 