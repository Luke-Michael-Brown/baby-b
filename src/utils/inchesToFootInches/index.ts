// Utility function that converts a height in inches to a string in feet and inches format, useful for displaying baby height measurements.

export default function inchesToFootInches(inches: number): string {
  if (inches < 0) inches = 0;

  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);

  if (remainingInches === 0) {
    return `${feet} \'`;
  }

  return `${feet}\' ${remainingInches}\"`;
}
