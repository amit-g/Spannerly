export interface UnitDefinition {
  name: string;
  abbreviation: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface UnitConverterProps {
  title: string;
  units: UnitDefinition[];
  defaultFromUnit?: string;
  defaultToUnit?: string;
  precision?: number;
}
