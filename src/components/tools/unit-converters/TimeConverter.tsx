import React from 'react';
import { BaseUnitConverter } from './BaseUnitConverter';
import { UnitDefinition } from './types';

// Base unit: seconds
const timeUnits: UnitDefinition[] = [
  {
    name: 'Nanosecond',
    abbreviation: 'ns',
    toBase: (value) => value / 1000000000,
    fromBase: (value) => value * 1000000000,
  },
  {
    name: 'Microsecond',
    abbreviation: 'μs',
    toBase: (value) => value / 1000000,
    fromBase: (value) => value * 1000000,
  },
  {
    name: 'Millisecond',
    abbreviation: 'ms',
    toBase: (value) => value / 1000,
    fromBase: (value) => value * 1000,
  },
  {
    name: 'Second',
    abbreviation: 's',
    toBase: (value) => value,
    fromBase: (value) => value,
  },
  {
    name: 'Minute',
    abbreviation: 'min',
    toBase: (value) => value * 60,
    fromBase: (value) => value / 60,
  },
  {
    name: 'Hour',
    abbreviation: 'h',
    toBase: (value) => value * 3600,
    fromBase: (value) => value / 3600,
  },
  {
    name: 'Day',
    abbreviation: 'd',
    toBase: (value) => value * 86400,
    fromBase: (value) => value / 86400,
  },
  {
    name: 'Week',
    abbreviation: 'wk',
    toBase: (value) => value * 604800,
    fromBase: (value) => value / 604800,
  },
  {
    name: 'Month (30 days)',
    abbreviation: 'mo',
    toBase: (value) => value * 2592000,
    fromBase: (value) => value / 2592000,
  },
  {
    name: 'Year (365 days)',
    abbreviation: 'yr',
    toBase: (value) => value * 31536000,
    fromBase: (value) => value / 31536000,
  },
  {
    name: 'Decade',
    abbreviation: 'dec',
    toBase: (value) => value * 315360000,
    fromBase: (value) => value / 315360000,
  },
  {
    name: 'Century',
    abbreviation: 'cent',
    toBase: (value) => value * 3153600000,
    fromBase: (value) => value / 3153600000,
  },
];

export const TimeConverter: React.FC = () => {
  return (
    <BaseUnitConverter
      title="Time Converter"
      units={timeUnits}
      defaultFromUnit="h"
      defaultToUnit="min"
    />
  );
};
