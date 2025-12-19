// Utility function that converts a volume in milliliters to ounces, typically used for liquid intake measurements like milk or formula.

export default function mlToOz(ml: number): number {
  const ounces = ml / 29.5735;
  return parseFloat(ounces.toFixed(2));
}
