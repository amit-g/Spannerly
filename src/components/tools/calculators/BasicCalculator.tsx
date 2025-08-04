import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  useTheme,
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForOperand: boolean;
}

export const BasicCalculator: React.FC = () => {
  const theme = useTheme();
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false,
  });

  const inputNumber = useCallback((num: string) => {
    const { display, waitingForOperand } = state;

    if (waitingForOperand) {
      setState({
        ...state,
        display: num,
        waitingForOperand: false,
      });
    } else {
      setState({
        ...state,
        display: display === '0' ? num : display + num,
      });
    }
  }, [state]);

  const inputDecimal = useCallback(() => {
    const { display, waitingForOperand } = state;

    if (waitingForOperand) {
      setState({
        ...state,
        display: '0.',
        waitingForOperand: false,
      });
    } else if (display.indexOf('.') === -1) {
      setState({
        ...state,
        display: display + '.',
      });
    }
  }, [state]);

  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForOperand: false,
    });
  }, []);

  const clearEntry = useCallback(() => {
    setState({
      ...state,
      display: '0',
    });
  }, [state]);

  const backspace = useCallback(() => {
    const { display } = state;
    
    if (display.length > 1) {
      setState({
        ...state,
        display: display.slice(0, -1),
      });
    } else {
      setState({
        ...state,
        display: '0',
      });
    }
  }, [state]);

  const performOperation = useCallback((nextOperation: string) => {
    const { display, previousValue, operation } = state;
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setState({
        ...state,
        previousValue: inputValue,
        operation: nextOperation,
        waitingForOperand: true,
      });
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result: number;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = currentValue / inputValue;
          break;
        case '=':
          result = inputValue;
          break;
        default:
          return;
      }

      setState({
        display: String(result),
        previousValue: result,
        operation: nextOperation,
        waitingForOperand: true,
      });
    }
  }, [state]);

  const calculate = useCallback(() => {
    performOperation('=');
  }, [performOperation]);

  const percentage = useCallback(() => {
    const { display } = state;
    const value = parseFloat(display);
    
    setState({
      ...state,
      display: String(value / 100),
    });
  }, [state]);

  const toggleSign = useCallback(() => {
    const { display } = state;
    const value = parseFloat(display);
    
    setState({
      ...state,
      display: String(-value),
    });
  }, [state]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        event.preventDefault();
        inputNumber(key);
      } else if (key === '.') {
        event.preventDefault();
        inputDecimal();
      } else if (key === '+') {
        event.preventDefault();
        performOperation('+');
      } else if (key === '-') {
        event.preventDefault();
        performOperation('-');
      } else if (key === '*') {
        event.preventDefault();
        performOperation('×');
      } else if (key === '/') {
        event.preventDefault();
        performOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
      } else if (key === 'Escape') {
        event.preventDefault();
        clear();
      } else if (key === 'Backspace') {
        event.preventDefault();
        backspace();
      } else if (key === '%') {
        event.preventDefault();
        percentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputNumber, inputDecimal, performOperation, calculate, clear, backspace, percentage]);

  const buttonStyle = {
    minHeight: '60px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  const operatorStyle = {
    ...buttonStyle,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  };

  const functionStyle = {
    ...buttonStyle,
    bgcolor: 'secondary.main',
    color: 'secondary.contrastText',
    '&:hover': {
      bgcolor: 'secondary.dark',
    },
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Basic Calculator
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Display */}
        <TextField
          fullWidth
          value={state.display}
          variant="outlined"
          InputProps={{
            readOnly: true,
            style: {
              fontSize: '2rem',
              textAlign: 'right',
              fontFamily: 'monospace',
              padding: '16px',
            },
          }}
          sx={{ mb: 2 }}
        />

        {/* Button Grid */}
        <Grid container spacing={1}>
          {/* Row 1 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={clear}
              sx={functionStyle}
            >
              AC
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={clearEntry}
              sx={functionStyle}
            >
              CE
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={backspace}
              sx={functionStyle}
            >
              <BackspaceIcon />
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => performOperation('÷')}
              sx={operatorStyle}
            >
              ÷
            </Button>
          </Grid>

          {/* Row 2 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('7')}
              sx={buttonStyle}
            >
              7
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('8')}
              sx={buttonStyle}
            >
              8
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('9')}
              sx={buttonStyle}
            >
              9
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => performOperation('×')}
              sx={operatorStyle}
            >
              ×
            </Button>
          </Grid>

          {/* Row 3 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('4')}
              sx={buttonStyle}
            >
              4
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('5')}
              sx={buttonStyle}
            >
              5
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('6')}
              sx={buttonStyle}
            >
              6
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => performOperation('-')}
              sx={operatorStyle}
            >
              −
            </Button>
          </Grid>

          {/* Row 4 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('1')}
              sx={buttonStyle}
            >
              1
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('2')}
              sx={buttonStyle}
            >
              2
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('3')}
              sx={buttonStyle}
            >
              3
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => performOperation('+')}
              sx={operatorStyle}
            >
              +
            </Button>
          </Grid>

          {/* Row 5 */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={toggleSign}
              sx={functionStyle}
            >
              ±
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => inputNumber('0')}
              sx={buttonStyle}
            >
              0
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={inputDecimal}
              sx={buttonStyle}
            >
              .
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={calculate}
              sx={{
                ...operatorStyle,
                bgcolor: 'success.main',
                '&:hover': {
                  bgcolor: 'success.dark',
                },
              }}
            >
              =
            </Button>
          </Grid>

          {/* Row 6 - Additional Functions */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={percentage}
              sx={{
                ...functionStyle,
                mt: 1,
                minHeight: '50px',
              }}
            >
              Percentage (%)
            </Button>
          </Grid>
        </Grid>

        {/* Operation History Display */}
        {state.previousValue !== null && state.operation && state.operation !== '=' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {state.previousValue} {state.operation} {state.waitingForOperand ? '?' : state.display}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Instructions */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <strong>Functions:</strong><br />
          AC: All Clear | CE: Clear Entry | ±: Toggle Sign | %: Percentage
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <strong>Keyboard shortcuts:</strong><br />
          Numbers: 0-9 | Operations: +, -, *, / | Enter/=: Calculate | Esc: Clear | Backspace: Delete
        </Typography>
      </Box>
    </Box>
  );
};
