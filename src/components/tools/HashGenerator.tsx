import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Grid,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { 
  ContentCopy, 
  Clear, 
  Fingerprint, 
  Security,
  Info
} from '@mui/icons-material';
import { CryptographyService, HashResult } from '../../services/cryptographyService';

const HashGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<string>('all');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const algorithms = [
    { value: 'all', label: 'All Algorithms', description: 'Generate all hash types' },
    { value: 'md5', label: 'MD5', description: 'Legacy hash function (128-bit)' },
    { value: 'sha1', label: 'SHA-1', description: 'Legacy secure hash (160-bit)' },
    { value: 'sha256', label: 'SHA-256', description: 'Secure Hash Algorithm (256-bit)' },
    { value: 'sha384', label: 'SHA-384', description: 'Secure Hash Algorithm (384-bit)' },
    { value: 'sha512', label: 'SHA-512', description: 'Secure Hash Algorithm (512-bit)' },
  ];

  const examples = [
    { text: 'Hello World', description: 'Simple text' },
    { text: 'password123', description: 'Password example' },
    { text: 'user@example.com', description: 'Email address' },
    { text: 'The quick brown fox jumps over the lazy dog', description: 'Pangram sentence' },
    { text: '{"id": 1, "name": "John"}', description: 'JSON data' },
    { text: 'MySecretKey2024!', description: 'Complex key' },
  ];

  const handleGenerate = useCallback(async () => {
    try {
      setError('');
      setIsGenerating(true);
      
      if (!input.trim()) {
        setHashResults([]);
        return;
      }

      let results: HashResult[];

      if (algorithm === 'all') {
        results = await CryptographyService.generateAllHashes(input);
      } else {
        let hash: string;
        switch (algorithm) {
          case 'md5':
            hash = await CryptographyService.generateMD5(input);
            break;
          case 'sha1':
            hash = await CryptographyService.generateSHA1(input);
            break;
          case 'sha256':
            hash = await CryptographyService.generateSHA256(input);
            break;
          case 'sha384':
            hash = await CryptographyService.generateSHA384(input);
            break;
          case 'sha512':
            hash = await CryptographyService.generateSHA512(input);
            break;
          default:
            throw new Error('Unknown algorithm');
        }
        
        results = [{
          original: input,
          hash,
          algorithm: algorithm.toUpperCase(),
          length: hash.length
        }];
      }

      setHashResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during hash generation');
      setHashResults([]);
    } finally {
      setIsGenerating(false);
    }
  }, [input, algorithm]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setHashResults([]);
    setError('');
  }, []);

  const handleExampleClick = useCallback((example: typeof examples[0]) => {
    setInput(example.text);
    setError('');
  }, []);

  const getAlgorithmInfo = useCallback((algo: string) => {
    return CryptographyService.getAlgorithmInfo(algo);
  }, []);

  const getSecurityColor = useCallback((level: string) => {
    switch (level) {
      case 'Low': return 'error';
      case 'Medium': return 'warning';
      case 'High': return 'success';
      case 'Very High': return 'success';
      default: return 'default';
    }
  }, []);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Hash Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate cryptographic hashes using various algorithms including MD5, SHA-1, SHA-256, SHA-384, and SHA-512.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Generate Hash</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Algorithm</InputLabel>
                <Select
                  value={algorithm}
                  label="Algorithm"
                  onChange={(e) => setAlgorithm(e.target.value)}
                >
                  {algorithms.map((algo) => (
                    <MenuItem key={algo.value} value={algo.value}>
                      <Box>
                        <Typography variant="body1">{algo.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {algo.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Text to Hash"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to generate hash..."
                sx={{ mb: 2 }}
              />

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  startIcon={isGenerating ? <CircularProgress size={16} /> : <Fingerprint />}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Hash'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  startIcon={<Clear />}
                  disabled={isGenerating}
                >
                  Clear
                </Button>
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {hashResults.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Hash Results:</Typography>
                  <Stack spacing={2}>
                    {hashResults.map((result, index) => {
                      const algorithmInfo = getAlgorithmInfo(result.algorithm);
                      return (
                        <Card key={index} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography variant="h6">{result.algorithm}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {algorithmInfo.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                  <Chip 
                                    label={`Security: ${algorithmInfo.securityLevel}`}
                                    color={getSecurityColor(algorithmInfo.securityLevel) as any}
                                    size="small"
                                  />
                                  <Chip 
                                    label={`Length: ${result.length} chars`}
                                    variant="outlined"
                                    size="small"
                                  />
                                </Box>
                              </Box>
                              <IconButton
                                onClick={() => handleCopy(result.hash)}
                                title="Copy hash"
                              >
                                <ContentCopy />
                              </IconButton>
                            </Box>
                            
                            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                              <Typography
                                sx={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.875rem',
                                  wordBreak: 'break-all',
                                  lineHeight: 1.5
                                }}
                              >
                                {result.hash}
                              </Typography>
                            </Paper>

                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Common Use Cases:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {algorithmInfo.useCases.map((useCase, idx) => (
                                  <Chip
                                    key={idx}
                                    label={useCase}
                                    variant="outlined"
                                    size="small"
                                  />
                                ))}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Examples</Typography>
              <Stack spacing={1}>
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    onClick={() => handleExampleClick(example)}
                    sx={{ 
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      p: 1
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {example.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {example.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Security />
                <Typography variant="h6">
                  Security Information
                </Typography>
              </Box>
              
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Security Notice:</strong> MD5 and SHA-1 are cryptographically broken and should not be used for security purposes.
                </Typography>
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  Recommended for Security:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="SHA-256" 
                      secondary="Industry standard for most applications"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="SHA-512" 
                      secondary="Maximum security for critical data"
                    />
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="warning.main" gutterBottom>
                  Legacy Algorithms:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="MD5" 
                      secondary="Only for checksums, not security"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="SHA-1" 
                      secondary="Deprecated for security use"
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HashGenerator;
