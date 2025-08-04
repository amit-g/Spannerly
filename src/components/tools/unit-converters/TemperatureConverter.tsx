import React from 'react';
import { BaseUnitConverter } from './BaseUnitConverter';
import { UnitDefinition } from './types';

// Base unit: Kelvin
const temperatureUnits: UnitDefinition[] = [
  {
    name: 'Celsius',
    abbreviation: '°C',
    toBase: (value) => value + 273.15,
    fromBase: (value) => value - 273.15,
  },
  {
    name: 'Fahrenheit',
    abbreviation: '°F',
    toBase: (value) => (value - 32) * 5/9 + 273.15,
    fromBase: (value) => (value - 273.15) * 9/5 + 32,
  },
  {
    name: 'Kelvin',
    abbreviation: 'K',
    toBase: (value) => value,
    fromBase: (value) => value,
  },
  {
    name: 'Rankine',
    abbreviation: '°R',
    toBase: (value) => value * 5/9,
    fromBase: (value) => value * 9/5,
  },
  {
    name: 'Réaumur',
    abbreviation: '°Ré',
    toBase: (value) => value * 5/4 + 273.15,
    fromBase: (value) => (value - 273.15) * 4/5,
  },
];

export const TemperatureConverter: React.FC = () => {
  return (
    <BaseUnitConverter
      title="Temperature Converter"
      units={temperatureUnits}
      defaultFromUnit="°C"
      defaultToUnit="°F"
      precision={4}
    />
  );
};
