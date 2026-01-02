/**
 * Converts height in centimeters to a string in feet and inches format.
 * Calculation: 1 cm / 2.54 = inches
 */
export default function cmToInchesAndFeet(cm: number): string {
  if (cm <= 0) return "0'";

  // 1. Convert total cm to total inches
  const totalInches = cm / 2.54;

  // 2. Calculate feet and the remaining inches
  const feet = Math.floor(totalInches / 12);
  const remainingInches = Math.round(totalInches % 12);

  // 3. Handle the case where rounding inches reaches 12
  if (remainingInches === 12) {
    return `${feet + 1}'`;
  }

  // 4. Formatting logic
  if (remainingInches === 0) {
    return `${feet}'`;
  }

  return `${feet}' ${remainingInches}"`;
}
