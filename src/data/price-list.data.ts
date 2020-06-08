import { ServiceType, ServiceYear } from '../types';

export type Discount = {
  requiredService: ServiceType;
  requiredYear?: ServiceYear;
  discountValue: number;
};
export type PriceDetails = { year?: ServiceYear; price: number };
export type ServicePriceList = {
  services: ServiceType[];
  prices: PriceDetails[];
  discounts?: Discount[];
};
export const ServicePrices: ServicePriceList[] = [
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

export default ServicePrices;
