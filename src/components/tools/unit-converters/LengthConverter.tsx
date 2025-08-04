import React from 'react';
import { BaseUnitConverter } from './BaseUnitConverter';
import { UnitDefinition } from './types';

// Base unit: meters
const lengthUnits: UnitDefinition[] = [
  {
    name: 'Millimeter',
    abbreviation: 'mm',
    toBase: (value) => value / 1000,
    fromBase: (value) => value * 1000,
  },
  {
    name: 'Centimeter',
    abbreviation: 'cm',
    toBase: (value) => value / 100,
    fromBase: (value) => value * 100,
  },
  {
    name: 'Meter',
    abbreviation: 'm',
    toBase: (value) => value,
    fromBase: (value) => value,
  },
  {
    name: 'Kilometer',
    abbreviation: 'km',
    toBase: (value) => value * 1000,
    fromBase: (value) => value / 1000,
  },
  {
    name: 'Inch',
    abbreviation: 'in',
    toBase: (value) => value * 0.0254,
    fromBase: (value) => value / 0.0254,
  },
  {
    name: 'Foot',
    abbreviation: 'ft',
    toBase: (value) => value * 0.3048,
    fromBase: (value) => value / 0.3048,
  },
  {
    name: 'Yard',
    abbreviation: 'yd',
    toBase: (value) => value * 0.9144,
    fromBase: (value) => value / 0.9144,
  },
  {
    name: 'Mile',
    abbreviation: 'mi',
    toBase: (value) => value * 1609.344,
    fromBase: (value) => value / 1609.344,
  },
  {
    name: 'Nautical Mile',
    abbreviation: 'nmi',
    toBase: (value) => value * 1852,
    fromBase: (value) => value / 1852,
  },
];

export const LengthConverter: React.FC = () => {
  return (
    <BaseUnitConverter
      title="Length Converter"
      units={lengthUnits}
      defaultFromUnit="m"
      defaultToUnit="ft"
    />
  );
};
