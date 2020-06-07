export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType =
  | 'Photography'
  | 'VideoRecording'
  | 'BlurayPackage'
  | 'TwoDayEvent'
  | 'WeddingSession';

export type Relation = { parent: ServiceType; child: ServiceType };
export const hierarchy: Relation[] = [
  { parent: 'VideoRecording', child: 'BlurayPackage' },
  { parent: 'VideoRecording', child: 'TwoDayEvent' },
  { parent: 'Photography', child: 'TwoDayEvent' },
];

export type Discount = {
  requiredService: ServiceType;
  requiredYear?: ServiceYear;
  discountValue: number;
};
export type PriceDetails = { year?: ServiceYear; price: number };
export type ServicePrice = {
  services: ServiceType[];
  prices: PriceDetails[];
  discounts?: Discount[];
};
export const servicePrices: ServicePrice[] = [
  {
    services: ['Photography'],
    prices: [
      { year: 2020, price: 1700 },
      { year: 2021, price: 1800 },
      { year: 2022, price: 1900 },
    ],
  },
  {
    services: ['VideoRecording'],
    prices: [
      { year: 2020, price: 1700 },
      { year: 2021, price: 1800 },
      { year: 2022, price: 1900 },
    ],
    discounts: [],
  },
  {
    services: ['Photography', 'VideoRecording'],
    prices: [
      { year: 2020, price: 2200 },
      { year: 2021, price: 2300 },
      { year: 2022, price: 2500 },
    ],
    discounts: [],
  },
  {
    services: ['WeddingSession'],
    prices: [{ price: 600 }],
    discounts: [
      { requiredService: 'Photography', discountValue: 300 },
      { requiredService: 'VideoRecording', discountValue: 300 },
      {
        requiredService: 'Photography',
        requiredYear: 2022,
        discountValue: 600,
      },
    ],
  },
  {
    services: ['BlurayPackage'],
    prices: [{ price: 300 }],
    discounts: [],
  },
  {
    services: ['TwoDayEvent'],
    prices: [{ price: 400 }],
    discounts: [],
  },
];

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: 'Select' | 'Deselect'; service: ServiceType }
) => {
  let selectedServices = [...previouslySelectedServices];
  const actionService = action.service;
  const indexOfService = selectedServices.indexOf(actionService);
  const actionServiceAleradySelected = indexOfService > -1;
  switch (action.type) {
    case 'Select': {
      let canSelectChildService = canSelectChild(
        actionService,
        selectedServices
      );
      if (!actionServiceAleradySelected && canSelectChildService) {
        selectedServices.push(actionService);
      }
      break;
    }
    case 'Deselect': {
      if (actionServiceAleradySelected) {
        selectedServices.splice(indexOfService, 1);
      }

      deselectChildServices(actionService, selectedServices);
      break;
    }
  }
  return selectedServices;
};

const deselectChildServices = (
  actionService: string,
  selectedServices: ServiceType[]
) => {
  const servicesWithActionServiceAsParent = hierarchy
    .filter((x) => x.parent == actionService)
    .map((y) => y.child);
  hierarchy
    .filter(
      (x) =>
        servicesWithActionServiceAsParent.includes(x.child) &&
        x.parent != actionService &&
        !selectedServices.includes(x.parent) &&
        selectedServices.includes(x.child)
    )
    .map((x) => selectedServices.indexOf(x.child))
    .forEach((x) => selectedServices.splice(x, 1));
};

const canSelectChild = (
  service: ServiceType,
  selectedServices: ServiceType[]
) => {
  const childService = hierarchy.filter((x) => x.child == service);
  const canAddChildService =
    !childService.length ||
    selectedServices.some((x) => childService.map((y) => y.parent).includes(x));
  return canAddChildService;
};

export type CalculatedPrice = { basePrice: number; finalPrice: number };

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
): CalculatedPrice => {
  if (!selectedServices.length) {
    return { basePrice: 0, finalPrice: 0 };
  }
  let foundServices: ServicePrice[] = [];

  let remainingServicesToCheck = [...selectedServices];
  servicePrices
    .sort(
      (service1, service2) =>
        service2.services.length - service1.services.length
    )
    .forEach((servicePrice) => {
      var covers = servicePrice.services.every((service) =>
        remainingServicesToCheck.includes(service)
      );
      if (covers) {
        foundServices.push(servicePrice);
        servicePrice.services.forEach((service) =>
          remainingServicesToCheck.splice(
            remainingServicesToCheck.indexOf(service),
            1
          )
        );
      }
    });

  var prices2 = foundServices.map(
    (x) =>
      x.prices.find((price) => !price.year || price.year === selectedYear).price
  );

  const discounts = foundServices
    .map((x) =>
      [0].concat(
        x.discounts
          ?.filter(
            (discount) =>
              selectedServices.includes(discount.requiredService) &&
              (!discount.requiredYear || discount.requiredYear == selectedYear)
          )
          .map((discount) => discount.discountValue) || []
      )
    )
    .reduce((prevValue, currentValue) => prevValue.concat(currentValue), []);

  let totalBasePrice = prices2.reduce(
    (prevValue, currentValue) => prevValue + currentValue,
    0
  );

  let totalFinalPrice = totalBasePrice - Math.max(...discounts);

  return { basePrice: totalBasePrice, finalPrice: totalFinalPrice };
};
