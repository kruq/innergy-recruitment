import { ServiceType, ServiceYear, Price } from './types';
import {
  selectService,
  deselectService,
} from './services/selection/service-selection.service';
import { calculate } from './services/prices/service-price.service';

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: 'Select' | 'Deselect'; service: ServiceType }
) => {
  const actionService = action.service;
  switch (action.type) {
    case 'Select': {
      return selectService(previouslySelectedServices, actionService);
    }
    case 'Deselect': {
      return deselectService(previouslySelectedServices, actionService);
    }
  }
  return null;
};

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
): Price => {
  if (!selectedServices.length) {
    return { basePrice: 0, finalPrice: 0 };
  }
  return calculate(selectedServices, selectedYear);
};
