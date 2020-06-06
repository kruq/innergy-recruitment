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

export type PriceDetails = { year?: ServiceYear; price: number };
export type ServicePrice = {
  service: ServiceType;
  prices: PriceDetails[];
  discounts: Discount[];
};
export const servicePrices: ServicePrice[] = [
  {
    service: 'Photography',
    prices: [
      { year: 2020, price: 1700 },
      { year: 2021, price: 1800 },
      { year: 2022, price: 1900 },
    ],
    discounts: [
      { requiredService: 'VideoRecording', requiredYear: 2020, discount: 1200 },
      { requiredService: 'VideoRecording', requiredYear: 2021, discount: 1300 },
      { requiredService: 'VideoRecording', requiredYear: 2022, discount: 1300 },
    ],
  },
  {
    service: 'VideoRecording',
    prices: [
      { year: 2020, price: 1700 },
      { year: 2021, price: 1800 },
      { year: 2022, price: 1900 },
    ],
    discounts: [
      { requiredService: 'Photography', requiredYear: 2020, discount: 1200 },
      { requiredService: 'Photography', requiredYear: 2021, discount: 1300 },
      { requiredService: 'Photography', requiredYear: 2022, discount: 1300 },
    ],
  },
  {
    service: 'WeddingSession',
    prices: [{ price: 600 }],
    discounts: [
      { requiredService: 'Photography', discount: 300 },
      { requiredService: 'VideoRecording', discount: 300 },
      { requiredService: 'Photography', requiredYear: 2022, discount: 600 },
    ],
  },
  {
    service: 'BlurayPackage',
    prices: [{ price: 300 }],
    discounts: [],
  },
  ,
  {
    service: 'TwoDayEvent',
    prices: [{ price: 400 }],
    discounts: [],
  },
];

export type Discount = {
  requiredService: ServiceType;
  requiredYear?: ServiceYear;
  discount: number;
};
// export type Discount = { requiredServices: ServiceType[]; discount: number };
// export const discounts: Discount[] = [
//   { requiredServices: ['Photography', 'VideoRecording'], discount: 300 },
//   { requiredServices: ['Photography'], discount: }
// ];

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

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => {
  if (!selectedServices.length) {
    return { basePrice: 0, finalPrice: 0 };
  }

  const servicePricePair = selectedServices.map((selectedService) => {
    const servicePrice = servicePrices.find(
      (servicePrice) => servicePrice.service === selectedService
    );

    if (!servicePrice) {
      return { service: selectedService, price: 0, discount: 0 };
    }
    const priceDetails = servicePrice.prices.find(
      (price) => price.year === selectedYear || !price.year
    );

    const foundDiscounts = servicePrice.discounts
      .filter(
        (x) =>
          selectedServices.includes(x.requiredService) &&
          (!x.requiredYear || x.requiredYear == selectedYear)
      )
      .map((x) => x.discount)
      .concat(0);

    const maxDiscount = Math.max(...foundDiscounts);

    return {
      service: selectedService,
      price: priceDetails.price,
      discount: maxDiscount,
    };
  });
  let totalBasePrice = servicePricePair
    .map((x) => x.price)
    .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

  let totalFinalPrice =
    totalBasePrice - Math.max(...servicePricePair.map((x) => x.discount));

  return { basePrice: totalBasePrice, finalPrice: totalFinalPrice };
};
