export function getPercents(value = 0, maxValue = 0): string {
  if ((!value && !maxValue) || !maxValue) {
    return '0';
  } else {
    return Math.round((value / maxValue) * 100).toFixed(0);
  }
}

export function getPrecentsForManyValues(valuesToPercents: number[], totalValue: number): number[] {
  const calculatedRawPercents: number[] = [];
  if (!valuesToPercents.length) {
    return [0];
  }
  if (valuesToPercents.length === 1) {
    calculatedRawPercents.push(Number.parseInt(getPercents(valuesToPercents[0], totalValue), 10));
  } else {
    const sumOfElements = valuesToPercents.reduce((acc, curr) => acc + curr);
    if (sumOfElements === totalValue) {
      let calculatedPercentsSum = 0;
      valuesToPercents.forEach((value, index) => {
        if (index !== valuesToPercents.length - 1) {
          const calcPercents = Number.parseInt(getPercents(value, totalValue), 10);
          calculatedRawPercents.push(calcPercents);
          calculatedPercentsSum += calcPercents;
        } else {
          calculatedRawPercents.push(100 - calculatedPercentsSum);
        }
      });
    } else {
      valuesToPercents.forEach((value) => {
        calculatedRawPercents.push(Number.parseInt(getPercents(value, totalValue), 10));
      });
    }
  }
  return calculatedRawPercents;
}
