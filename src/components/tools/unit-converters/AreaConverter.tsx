import React from 'react';
import { BaseUnitConverter } from './BaseUnitConverter';
import { UnitDefinition } from './types';

// Base unit: square meters
const areaUnits: UnitDefinition[] = [
  {
    name: 'Square Millimeter',
    abbreviation: 'mm²',
    toBase: (value) => value / 1000000,
    fromBase: (value) => value * 1000000,
  },
  {
    name: 'Square Centimeter',
    abbreviation: 'cm²',
    toBase: (value) => value / 10000,
    fromBase: (value) => value * 10000,
  },
  {
    name: 'Square Meter',
    abbreviation: 'm²',
    toBase: (value) => value,
    fromBase: (value) => value,
  },
  {
    name: 'Square Kilometer',
    abbreviation: 'km²',
    toBase: (value) => value * 1000000,
    fromBase: (value) => value / 1000000,
  },
  {
    name: 'Square Inch',
    abbreviation: 'in²',
    toBase: (value) => value * 0.00064516,
    fromBase: (value) => value / 0.00064516,
  },
  {
    name: 'Square Foot',
    abbreviation: 'ft²',
    toBase: (value) => value * 0.092903,
    fromBase: (value) => value / 0.092903,
  },
  {
    name: 'Square Yard',
    abbreviation: 'yd²',
    toBase: (value) => value * 0.836127,
    fromBase: (value) => value / 0.836127,
  },
  {
    name: 'Square Mile',
    abbreviation: 'mi²',
    toBase: (value) => value * 2589988.11,
    fromBase: (value) => value / 2589988.11,
  },
  {
    name: 'Acre',
    abbreviation: 'ac',
    toBase: (value) => value * 4046.86,
    fromBase: (value) => value / 4046.86,
  },
  {
    name: 'Hectare',
    abbreviation: 'ha',
    toBase: (value) => value * 10000,
    fromBase: (value) => value / 10000,
  },
];

export const AreaConverter: React.FC = () => {
  return (
    <BaseUnitConverter
      title="Area Converter"
      units={areaUnits}
      defaultFromUnit="m²"
      defaultToUnit="ft²"
    />
  );
};
