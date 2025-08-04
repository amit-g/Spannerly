import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Visibility,
  VisibilityOff,
  Info as InfoIcon,
} from '@mui/icons-material';
import { CryptographyService } from '../../services/cryptographyService';

const Base64Encryption: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usePassword, setUsePassword] = useState(false);

  const handleEncrypt = () => {
    if (!inputText.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    if (usePassword && !password.trim()) {
      setError('Please enter a password');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const encrypted = CryptographyService.encryptBase64(
        inputText, 
        usePassword ? password : undefined
      );
      setEncryptedText(encrypted);
      setSuccess('Text encrypted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    }
  };

  const handleDecrypt = () => {
    if (!encryptedText.trim()) {
      setError('Please enter encrypted text to decrypt');
      return;
    }
    if (usePassword && !password.trim()) {
      setError('Please enter the password');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const decrypted = CryptographyService.decryptBase64(
        encryptedText,
        usePassword ? password : undefined
      );
      setDecryptedText(decrypted);
      setSuccess('Text decrypted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(`${label} copied to clipboard!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const clearAll = () => {
    setInputText('');
    setPassword('');
    setEncryptedText('');
    setDecryptedText('');
    setError('');
    setSuccess('');
  };

  const handleSample = () => {
    setInputText('Hello, this is a sample text for Base64 encryption!');
    setPassword('mySecretPassword123');
    setUsePassword(true);
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Encryption/Decryption (Base64)
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Simple Base64 encoding with optional password protection using XOR encryption.
        This provides basic obfuscation and is suitable for non-sensitive data.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6">
            Input
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={handleSample}
            sx={{ ml: 'auto' }}
          >
            Load Sample
          </Button>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Text to encrypt"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter the text you want to encrypt..."
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={usePassword}
              onChange={(e) => setUsePassword(e.target.checked)}
            />
          }
          label="Use password protection (XOR encryption)"
          sx={{ mb: 2 }}
        />

        {usePassword && (
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password for additional protection..."
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<LockIcon />}
            onClick={handleEncrypt}
            disabled={!inputText.trim() || (usePassword && !password.trim())}
            color="primary"
          >
            Encrypt
          </Button>

          <Button
            variant="outlined"
            onClick={clearAll}
          >
            Clear All
          </Button>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6">
            Encrypted Result
          </Typography>
          {encryptedText && (
            <Tooltip title="Copy encrypted text">
              <IconButton
                size="small"
                onClick={() => copyToClipboard(encryptedText, 'Encrypted text')}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Encrypted text (Base64)"
          value={encryptedText}
          onChange={(e) => setEncryptedText(e.target.value)}
          placeholder="Encrypted text will appear here or paste encrypted text to decrypt..."
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          startIcon={<LockOpenIcon />}
          onClick={handleDecrypt}
          disabled={!encryptedText.trim() || (usePassword && !password.trim())}
          color="secondary"
        >
          Decrypt
        </Button>
      </Paper>

      {decryptedText && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h6">
              Decrypted Result
            </Typography>
            <Tooltip title="Copy decrypted text">
              <IconButton
                size="small"
                onClick={() => copyToClipboard(decryptedText, 'Decrypted text')}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Decrypted text"
            value={decryptedText}
            InputProps={{
              readOnly: true,
            }}
          />
        </Paper>
      )}

      <Paper elevation={1} sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <InfoIcon fontSize="small" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="body2">
              <strong>Security Notice:</strong>
            </Typography>
            <Typography variant="body2">
              • Base64 is encoding, not encryption - it's easily reversible
              <br />
              • Password protection uses simple XOR which provides basic obfuscation
              <br />
              • This is NOT suitable for sensitive or confidential data
              <br />
              • For strong security, use AES encryption instead
              <br />
              • Useful for simple data obfuscation and avoiding special characters
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Base64Encryption;
