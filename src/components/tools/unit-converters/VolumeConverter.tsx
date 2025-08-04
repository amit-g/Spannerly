import React from 'react';
import { BaseUnitConverter } from './BaseUnitConverter';
import { UnitDefinition } from './types';

// Base unit: liters
const volumeUnits: UnitDefinition[] = [
  {
    name: 'Milliliter',
    abbreviation: 'ml',
    toBase: (value) => value / 1000,
    fromBase: (value) => value * 1000,
  },
  {
    name: 'Liter',
    abbreviation: 'L',
    toBase: (value) => value,
    fromBase: (value) => value,
  },
  {
    name: 'Cubic Centimeter',
    abbreviation: 'cm³',
    toBase: (value) => value / 1000,
    fromBase: (value) => value * 1000,
  },
  {
    name: 'Cubic Meter',
    abbreviation: 'm³',
    toBase: (value) => value * 1000,
    fromBase: (value) => value / 1000,
  },
  {
    name: 'Cubic Inch',
    abbreviation: 'in³',
    toBase: (value) => value * 0.0163871,
    fromBase: (value) => value / 0.0163871,
  },
  {
    name: 'Cubic Foot',
    abbreviation: 'ft³',
    toBase: (value) => value * 28.3168,
    fromBase: (value) => value / 28.3168,
  },
  {
    name: 'US Fluid Ounce',
    abbreviation: 'fl oz (US)',
    toBase: (value) => value * 0.0295735,
    fromBase: (value) => value / 0.0295735,
  },
  {
    name: 'US Cup',
    abbreviation: 'cup (US)',
    toBase: (value) => value * 0.236588,
    fromBase: (value) => value / 0.236588,
  },
  {
    name: 'US Pint',
    abbreviation: 'pt (US)',
    toBase: (value) => value * 0.473176,
    fromBase: (value) => value / 0.473176,
  },
  {
    name: 'US Quart',
    abbreviation: 'qt (US)',
    toBase: (value) => value * 0.946353,
    fromBase: (value) => value / 0.946353,
  },
  {
    name: 'US Gallon',
    abbreviation: 'gal (US)',
    toBase: (value) => value * 3.78541,
    fromBase: (value) => value / 3.78541,
  },
  {
    name: 'Imperial Fluid Ounce',
    abbreviation: 'fl oz (UK)',
    toBase: (value) => value * 0.0284131,
    fromBase: (value) => value / 0.0284131,
  },
  {
    name: 'Imperial Pint',
    abbreviation: 'pt (UK)',
    toBase: (value) => value * 0.568261,
    fromBase: (value) => value / 0.568261,
  },
  {
    name: 'Imperial Gallon',
    abbreviation: 'gal (UK)',
    toBase: (value) => value * 4.54609,
    fromBase: (value) => value / 4.54609,
  },
];

export const VolumeConverter: React.FC = () => {
  return (
    <BaseUnitConverter
      title="Volume Converter"
      units={volumeUnits}
      defaultFromUnit="L"
      defaultToUnit="gal (US)"
    />
  );
};
