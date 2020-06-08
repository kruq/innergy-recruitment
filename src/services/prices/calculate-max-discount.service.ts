import { ServiceType, ServiceYear } from '../../types';
import { ServicePriceList, Discount } from '../../data/price-list.data';

export const calculateMaxDiscount = (
  servicePriceLists: ServicePriceList[],
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
): number => {
  const isDiscountMachingRequirement = (discount: Discount) =>
    selectedServices.includes(discount.requiredService) &&
    (!discount.requiredYear || discount.requiredYear == selectedYear);

  const returnDiscountValue = (discount: Discount): number =>
    discount.discountValue;

  const getMatchingDiscountValues = (servicePrice: ServicePriceList) => {
    return [0].concat(
      servicePrice.discounts
        ?.filter(isDiscountMachingRequirement)
        .map(returnDiscountValue) || []
    );
  };

  const discounts = servicePriceLists
    .map(getMatchingDiscountValues)
    .reduce((prevValue, currentValue) => prevValue.concat(currentValue), []);

  return Math.max(...discounts);
};
