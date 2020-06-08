import { ServiceType } from '../../types';
import Relations, { ServiceRelation } from '../../data/service-relations.data';

export const deselectService = (
  previouslySelectedServices: ServiceType[],
  actionService: ServiceType
) => {
  let selectedServices = [...previouslySelectedServices];
  const indexOfService = selectedServices.indexOf(actionService);
  const actionServiceAleradySelected = indexOfService > -1;
  if (actionServiceAleradySelected) {
    selectedServices.splice(indexOfService, 1);
  }
  deselectChildServices(actionService, selectedServices);
  return selectedServices;
};

export const selectService = (
  previouslySelectedServices: ServiceType[],
  actionService: ServiceType
) => {
  let selectedServices = [...previouslySelectedServices];
  const canSelectChildService = canSelectChild(actionService, selectedServices);
  const actionServiceAleradySelected = selectedServices.includes(actionService);
  if (!actionServiceAleradySelected && canSelectChildService) {
    selectedServices.push(actionService);
  }
  return selectedServices;
};

const deselectChildServices = (
  actionService: string,
  selectedServices: ServiceType[]
) => {
  const servicesWithActionServiceAsParent = Relations.filter(
    (x) => x.parent == actionService
  ).map((y) => y.child);

  const removeServiceFromSelectedServices = (
    relation: ServiceRelation
  ): void => {
    const index = selectedServices.indexOf(relation.child);
    selectedServices.splice(index, 1);
  };
  Relations.filter(
    (relation) =>
      servicesWithActionServiceAsParent.includes(relation.child) &&
      relation.parent != actionService &&
      !selectedServices.includes(relation.parent) &&
      selectedServices.includes(relation.child)
  ).forEach(removeServiceFromSelectedServices);
};

const canSelectChild = (
  service: ServiceType,
  selectedServices: ServiceType[]
) => {
  const childServices = Relations.filter(
    (relation) => relation.child == service
  );
  const canAddChildService =
    !childServices.length ||
    selectedServices.some((service) =>
      childServices.map((childService) => childService.parent).includes(service)
    );
  return canAddChildService;
};
