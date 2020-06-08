import Prices, { ServicePriceList } from '../../data/price-list.data';
import { ServiceType, ServiceYear, Price } from '../../types';
import { calculateMaxDiscount } from './calculate-max-discount.service';
import { calculateBasePrice } from './calculate-base-price.service';

export const calculate = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
): Price => {
  const priceLists: ServicePriceList[] = findMatchingServicePriceLists(
    selectedServices
  );

  const totalBasePrice = calculateBasePrice(priceLists, selectedYear);

  const maxDiscount = calculateMaxDiscount(
    priceLists,
    selectedServices,
    selectedYear
  );
  let totalFinalPrice = totalBasePrice - maxDiscount;

  return { basePrice: totalBasePrice, finalPrice: totalFinalPrice };
};

const findMatchingServicePriceLists = (
  selectedServices: ServiceType[]
): ServicePriceList[] => {
  let remainingServicesToCheck = [...selectedServices];

  const compareServicePriceListDesc = (
    service1: ServicePriceList,
    service2: ServicePriceList
  ): number => service2.services.length - service1.services.length;

  const isPriceListMatchingRemainingServices = (
    servicePrice: ServicePriceList,
    remainingServicesToCheck: ServiceType[]
  ) => {
    return servicePrice.services.every((service) =>
      remainingServicesToCheck.includes(service)
    );
  };

  const removeRemainingServicesMatchingToPriceList = (
    priceList: ServicePriceList,
    remainingServicesToCheck: ServiceType[]
  ) => {
    priceList.services.forEach((service) =>
      remainingServicesToCheck.splice(
        remainingServicesToCheck.indexOf(service),
        1
      )
    );
  };

  const filterPriceLists = () => {
    let priceLists: ServicePriceList[] = [];
    Prices.sort(compareServicePriceListDesc).forEach((priceList) => {
      var isMatch = isPriceListMatchingRemainingServices(
        priceList,
        remainingServicesToCheck
      );
      if (isMatch) {
        priceLists.push(priceList);
        removeRemainingServicesMatchingToPriceList(
          priceList,
          remainingServicesToCheck
        );
      }
    });
    return priceLists;
  };

  return filterPriceLists();
};
