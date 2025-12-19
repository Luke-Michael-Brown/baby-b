// Utility function that converts a weight in grams to a string representation in pounds and ounces, commonly used for baby weight measurements.

export default function gramsToLB(grams: number): string {
  if (grams <= 0) return '0 lb 0 oz';

  const totalOunces = grams / 28.3495;
  const pounds = Math.floor(totalOunces / 16);
  const ounces = Math.round(totalOunces - pounds * 16);

  return `${pounds} lb ${ounces} oz`;
}
