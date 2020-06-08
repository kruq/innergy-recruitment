import { ServicePriceList } from '../../data/price-list.data';
import { ServiceType } from '../../types';

export const calculateBasePrice = (
  foundServices: ServicePriceList[],
  selectedYear: number
): number => {
  const prices: number[] = calculatePricesForGivenYear(
    foundServices,
    selectedYear
  );
  let totalBasePrice = prices.reduce(
    (prevValue, currentValue) => prevValue + currentValue,
    0
  );
  return totalBasePrice;
};

const calculatePricesForGivenYear = (
  foundServices: ServicePriceList[],
  selectedYear: number
): number[] => {
  return foundServices.map(
    (x) =>
      x.prices.find((price) => !price.year || price.year === selectedYear).price
  );
};
