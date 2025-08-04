# Unit Converters

This directory contains all the unit converter tools for the Spannerly application.

## Available Converters

### 1. Length Converter (`LengthConverter.tsx`)
- **Supported Units**: mm, cm, m, km, in, ft, yd, mi, nmi
- **Base Unit**: meters
- **Features**: Bi-directional conversion, quick reference units

### 2. Temperature Converter (`TemperatureConverter.tsx`)
- **Supported Units**: Celsius, Fahrenheit, Kelvin, Rankine, Réaumur
- **Base Unit**: Kelvin
- **Features**: Accurate temperature conversion formulas

### 3. Weight Converter (`WeightConverter.tsx`)
- **Supported Units**: mg, g, kg, t, oz, lb, st, US ton, UK ton
- **Base Unit**: grams
- **Features**: Both metric and imperial units

### 4. Area Converter (`AreaConverter.tsx`)
- **Supported Units**: mm², cm², m², km², in², ft², yd², mi², ac, ha
- **Base Unit**: square meters
- **Features**: Land measurement units included

### 5. Volume Converter (`VolumeConverter.tsx`)
- **Supported Units**: ml, L, cm³, m³, in³, ft³, fl oz, cups, pints, quarts, gallons
- **Base Unit**: liters
- **Features**: Both US and Imperial fluid measurements

### 6. Time Converter (`TimeConverter.tsx`)
- **Supported Units**: ns, μs, ms, s, min, h, d, wk, mo, yr, decade, century
- **Base Unit**: seconds
- **Features**: From nanoseconds to centuries

### 7. Currency Converter (`CurrencyConverter.tsx`)
- **Supported Currencies**: 20 major world currencies
- **Base Currency**: USD
- **Features**: Exchange rates, refresh functionality
- **Note**: Uses sample rates for demonstration

## Architecture

### Base Component (`BaseUnitConverter.tsx`)
All converters extend the `BaseUnitConverter` component which provides:
- **Bi-directional conversion**: Convert in either direction
- **Swap functionality**: Quick swap between from/to units
- **Real-time conversion**: Updates as you type
- **Quick reference**: Click units to select them
- **Responsive design**: Works on all screen sizes

### Type Definitions (`types.ts`)
- `UnitDefinition`: Defines conversion functions for each unit
- `UnitConverterProps`: Props interface for the base converter

## Usage Example

```tsx
import { LengthConverter } from '@/components/tools/unit-converters';

// Use in a component
<LengthConverter />
```

## Adding New Converters

1. Create a new converter file following the pattern
2. Define units with `toBase` and `fromBase` conversion functions
3. Use the `BaseUnitConverter` component
4. Export from `index.ts`
5. Add to the tool registry in `HomePage.tsx`
6. Add tool definition to `toolsSlice.ts`

## Conversion Accuracy

- **Precision**: 6 significant digits by default
- **Base Units**: Each converter uses a standard base unit
- **Formulas**: Uses internationally accepted conversion factors
- **Rounding**: Removes trailing zeros for clean display
