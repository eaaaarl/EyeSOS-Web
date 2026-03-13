export type TimePeriod = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type DayType = 'Weekday' | 'Weekend';

export interface BarangayHotspot {
  barangay: string;
  count: number;
}

const BARANGAYS = [
  "Anibongan",
  "Ban-As",
  "Banahao",
  "Baucawe",
  "Diatagon",
  "Ganayon",
  "Liatimco",
  "Manyayay",
  "Payasan",
  "Poblacion",
  "Saint Christine",
  "San Isidro",
  "San Pedro"
];

// Seeded random for consistency in "mock" data
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateMockHotspotData = (dayType: DayType, timePeriod: TimePeriod): BarangayHotspot[] => {
  const seedBase = dayType === 'Weekday' ? 100 : 200;
  const timeWeights: Record<TimePeriod, number> = {
    'Morning': 0.5,
    'Afternoon': 0.8,
    'Evening': 1.2,
    'Night': 1.5,
  };

  const dayWeight = dayType === 'Weekend' ? 1.4 : 1.0;
  const periodWeight = timeWeights[timePeriod];

  return BARANGAYS.map((name, index) => {
    const baseCount = 5 + pseudoRandom(seedBase + index) * 15;
    const finalCount = Math.round(baseCount * dayWeight * periodWeight);
    
    return {
      barangay: name,
      count: finalCount
    };
  }).sort((a, b) => b.count - a.count);
};
