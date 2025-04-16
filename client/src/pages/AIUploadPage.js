import React, { useState, useRef } from 'react';
import OpenAI from "openai";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
const AIUploadPage = () => {
  console.log("AIUploadPage component rendering");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !prompt.trim()) {
      setError('Please select an image and enter a prompt');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Extract base64 image from preview URL
      const base64Image = previewUrl.split(',')[1];
      
      console.log('Sending request to OpenAI...');

      // First, use GPT-4o (which has vision capabilities) to understand the image and generate a detailed description
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `Look at this image and follow these instructions: ${prompt}. Based on this image, describe in great detail how this image would look with the requested style transformation.` },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });
      
      console.log('Vision API Response:', visionResponse);
      
      // Extract the detailed description
      const detailedDescription = visionResponse.choices[0].message.content;
      
      // Now use DALL-E to generate a new image based on the detailed description
      const dalleResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a new image that looks like this: ${detailedDescription}. Apply the following style transformation: ${prompt}.`,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      });

      console.log('DALL-E Response:', dalleResponse);
      if (dalleResponse.data && dalleResponse.data.length > 0) {
        setGeneratedImage(dalleResponse.data[0].url);
      } else {
        throw new Error('Invalid response format from OpenAI');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError(`API Error: ${error.message}` || 'Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'edited-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrompt('');
    setGeneratedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem',
          background: '#1e1e1e',
          borderRadius: '12px',
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, color: '#90caf9', textAlign: 'center' }}>
          AI Image Transformer
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleUpload}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={generatedImage ? 6 : 12}>
              {/* Image Upload Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#90caf9' }}>
                  Original Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    color: '#90caf9',
                    borderColor: '#90caf9',
                    '&:hover': {
                      borderColor: '#64b5f6',
                      background: 'rgba(144, 202, 249, 0.1)',
                    },
                    mb: 2,
                  }}
                >
                  Select Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Button>
                {selectedFile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="body1">{selectedFile.name}</Typography>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      sx={{
                        color: '#90caf9',
                        '&:hover': {
                          background: 'rgba(144, 202, 249, 0.1)',
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                )}
                {previewUrl && (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: '300px',
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                  />
                )}
              </Box>

              {/* Prompt Input */}
              <TextField
                fullWidth
                label="Enter style transformation prompt (e.g., 'Convert to Studio Ghibli style')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                multiline
                rows={4}
                sx={{
                  mb: 4,
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

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isUploading || !selectedFile || !prompt.trim()}
                  sx={{
                    background: '#90caf9',
                    '&:hover': {
                      background: '#64b5f6',
                    },
                    minWidth: '120px',
                  }}
                >
                  {isUploading ? <CircularProgress size={24} /> : 'Transform Image'}
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
            </Grid>

            {/* Generated Image Preview */}
            {generatedImage && (
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#90caf9' }}>
                    Transformed Image
                  </Typography>
                  <Box
                    component="img"
                    src={generatedImage}
                    alt="Generated"
                    sx={{
                      width: '100%',
                      height: '300px',
                      borderRadius: '8px',
                      objectFit: 'contain',
                      mb: 2,
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    sx={{
                      color: '#90caf9',
                      borderColor: '#90caf9',
                      '&:hover': {
                        borderColor: '#64b5f6',
                        background: 'rgba(144, 202, 249, 0.1)',
                      },
                    }}
                  >
                    Download Image
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AIUploadPage; 