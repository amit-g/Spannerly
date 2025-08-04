import React from 'react';
import { BaseUnitConverter } from './BaseUnitConverter';
import { UnitDefinition } from './types';

// Base unit: grams
const weightUnits: UnitDefinition[] = [
  {
    name: 'Milligram',
    abbreviation: 'mg',
    toBase: (value) => value / 1000,
    fromBase: (value) => value * 1000,
  },
  {
    name: 'Gram',
    abbreviation: 'g',
    toBase: (value) => value,
    fromBase: (value) => value,
  },
  {
    name: 'Kilogram',
    abbreviation: 'kg',
    toBase: (value) => value * 1000,
    fromBase: (value) => value / 1000,
  },
  {
    name: 'Metric Ton',
    abbreviation: 't',
    toBase: (value) => value * 1000000,
    fromBase: (value) => value / 1000000,
  },
  {
    name: 'Ounce',
    abbreviation: 'oz',
    toBase: (value) => value * 28.3495,
    fromBase: (value) => value / 28.3495,
  },
  {
    name: 'Pound',
    abbreviation: 'lb',
    toBase: (value) => value * 453.592,
    fromBase: (value) => value / 453.592,
  },
  {
    name: 'Stone',
    abbreviation: 'st',
    toBase: (value) => value * 6350.29,
    fromBase: (value) => value / 6350.29,
  },
  {
    name: 'US Ton',
    abbreviation: 'US ton',
    toBase: (value) => value * 907184.74,
    fromBase: (value) => value / 907184.74,
  },
  {
    name: 'Imperial Ton',
    abbreviation: 'UK ton',
    toBase: (value) => value * 1016046.9,
    fromBase: (value) => value / 1016046.9,
  },
];

export const WeightConverter: React.FC = () => {
  return (
    <BaseUnitConverter
      title="Weight Converter"
      units={weightUnits}
      defaultFromUnit="kg"
      defaultToUnit="lb"
    />
  );
};
