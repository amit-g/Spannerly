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
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { CryptographyService } from '../../services/cryptographyService';

const AesEncryption: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [autoDecrypt, setAutoDecrypt] = useState(false);

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const encrypted = await CryptographyService.encryptAES(inputText, password);
      setEncryptedText(encrypted);
      setSuccess('Text encrypted successfully!');
      
      if (autoDecrypt) {
        await handleDecrypt(encrypted);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async (textToDecrypt?: string) => {
    const targetText = textToDecrypt || encryptedText;
    
    if (!targetText.trim()) {
      setError('Please enter encrypted text to decrypt');
      return;
    }
    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const decrypted = await CryptographyService.decryptAES(targetText, password);
      setDecryptedText(decrypted);
      if (!textToDecrypt) {
        setSuccess('Text decrypted successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
    } finally {
      setLoading(false);
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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Encryption/Decryption (AES)
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Encrypt and decrypt text using AES-256-GCM encryption with password-based key derivation.
        AES (Advanced Encryption Standard) is a secure symmetric encryption algorithm.
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
        <Typography variant="h6" gutterBottom>
          Input
        </Typography>
        
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

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a strong password..."
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

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<LockIcon />}
            onClick={handleEncrypt}
            disabled={loading || !inputText.trim() || !password.trim()}
            color="primary"
          >
            Encrypt
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={autoDecrypt}
                onChange={(e) => setAutoDecrypt(e.target.checked)}
              />
            }
            label="Auto-decrypt to verify"
          />

          <Button
            variant="outlined"
            onClick={clearAll}
            disabled={loading}
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
          label="Encrypted text"
          value={encryptedText}
          onChange={(e) => setEncryptedText(e.target.value)}
          placeholder="Encrypted text will appear here or paste encrypted text to decrypt..."
          InputProps={{
            readOnly: false,
          }}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          startIcon={<LockOpenIcon />}
          onClick={() => handleDecrypt()}
          disabled={loading || !encryptedText.trim() || !password.trim()}
          color="secondary"
        >
          Decrypt
        </Button>
      </Paper>

      {decryptedText && (
        <Paper elevation={2} sx={{ p: 3 }}>
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

      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="body2">
          <strong>Security Notes:</strong>
          <br />
          • AES-256-GCM provides authenticated encryption with associated data
          <br />
          • Uses PBKDF2 with 100,000 iterations for key derivation
          <br />
          • Each encryption uses a random IV for security
          <br />
          • Use strong, unique passwords for maximum security
          <br />
          • Keep your password safe - it cannot be recovered if lost
        </Typography>
      </Paper>
    </Box>
  );
};

export default AesEncryption;
