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
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  VpnKey as KeyIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { CryptographyService, KeyPair } from '../../services/cryptographyService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rsa-tabpanel-${index}`}
      aria-labelledby={`rsa-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RsaEncryption: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const generateKeyPair = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const keyPair: KeyPair = await CryptographyService.generateRSAKeyPair();
      setPublicKey(keyPair.publicKey);
      setPrivateKey(keyPair.privateKey);
      setSuccess('RSA key pair generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Key generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to encrypt');
      return;
    }
    if (!publicKey.trim()) {
      setError('Please generate or enter a public key');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const encrypted = await CryptographyService.encryptRSA(inputText, publicKey);
      setEncryptedText(encrypted);
      setSuccess('Text encrypted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedText.trim()) {
      setError('Please enter encrypted text to decrypt');
      return;
    }
    if (!privateKey.trim()) {
      setError('Please generate or enter a private key');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const decrypted = await CryptographyService.decryptRSA(encryptedText, privateKey);
      setDecryptedText(decrypted);
      setSuccess('Text decrypted successfully!');
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
    setPublicKey('');
    setPrivateKey('');
    setEncryptedText('');
    setDecryptedText('');
    setError('');
    setSuccess('');
  };

  const loadSampleKeys = () => {
    setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...');
    setPrivateKey('MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...');
    setInputText('Hello RSA!');
    setSuccess('Sample keys loaded. Click "Generate Key Pair" for real keys.');
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Encryption/Decryption (RSA)
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        RSA is an asymmetric encryption algorithm that uses a pair of keys: a public key for encryption
        and a private key for decryption. Maximum text length is approximately 190 characters for 2048-bit keys.
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Encrypt/Decrypt" />
          <Tab label="Key Management" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Text to Encrypt
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Input text (max ~190 characters)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter the text you want to encrypt..."
            helperText={`${inputText.length} characters`}
            error={inputText.length > 190}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            startIcon={<LockIcon />}
            onClick={handleEncrypt}
            disabled={loading || !inputText.trim() || !publicKey.trim()}
            color="primary"
            sx={{ mr: 2 }}
          >
            Encrypt with Public Key
          </Button>

          <Button
            variant="outlined"
            onClick={() => setTabValue(1)}
            disabled={loading}
          >
            Manage Keys
          </Button>
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
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            startIcon={<LockOpenIcon />}
            onClick={handleDecrypt}
            disabled={loading || !encryptedText.trim() || !privateKey.trim()}
            color="secondary"
          >
            Decrypt with Private Key
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
              rows={3}
              label="Decrypted text"
              value={decryptedText}
              InputProps={{
                readOnly: true,
              }}
            />
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h6">
              RSA Key Pair Generation
            </Typography>
            <Button
              variant="contained"
              startIcon={<KeyIcon />}
              onClick={generateKeyPair}
              disabled={loading}
              color="primary"
            >
              Generate New Key Pair
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadSampleKeys}
              disabled={loading}
              size="small"
            >
              Load Sample
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate a new 2048-bit RSA key pair. The public key is used for encryption,
            and the private key is used for decryption. Keep your private key secure!
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="subtitle1">
              Public Key (for encryption)
            </Typography>
            {publicKey && (
              <Tooltip title="Copy public key">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(publicKey, 'Public key')}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Public Key (Base64 encoded)"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Generate a key pair or paste your public key here..."
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="subtitle1">
              Private Key (for decryption)
            </Typography>
            {privateKey && (
              <Tooltip title="Copy private key">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(privateKey, 'Private key')}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Private Key (Base64 encoded)"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Generate a key pair or paste your private key here..."
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setTabValue(0)}
            >
              Back to Encrypt/Decrypt
            </Button>
            <Button
              variant="outlined"
              onClick={clearAll}
              color="warning"
            >
              Clear All Keys
            </Button>
          </Box>
        </Paper>
      </TabPanel>

      <Paper elevation={1} sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="body2">
          <strong>RSA Security Notes:</strong>
          <br />
          • RSA-2048 with OAEP padding for secure encryption
          <br />
          • Public key can be shared safely - use it to encrypt messages for you
          <br />
          • Private key must be kept secret - only you should have access to it
          <br />
          • Maximum message length is approximately 190 characters for 2048-bit keys
          <br />
          • For longer messages, use RSA to encrypt an AES key (hybrid encryption)
          <br />
          • Generated keys are valid only in this session and browser
        </Typography>
      </Paper>
    </Box>
  );
};

export default RsaEncryption;
