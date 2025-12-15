export default function mlToOz(ml: number): number {
  const ounces = ml / 29.5735;
  return parseFloat(ounces.toFixed(2));
}
