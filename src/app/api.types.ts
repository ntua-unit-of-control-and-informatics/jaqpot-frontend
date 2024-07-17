import { components, operations } from './api.schema.d';

export type ModelDto = components['schemas']['Model'];
export type FeatureDto = components['schemas']['Feature'];
export type FeaturePossibleValueDto =
  components['schemas']['FeaturePossibleValue'];
export type DatasetDto = components['schemas']['Dataset'];
export type DatasetCSVDto = components['schemas']['DatasetCSV'];
export type OrganizationDto = components['schemas']['Organization'];
export type OrganizationInvitationDto =
  components['schemas']['OrganizationInvitation'];

export type ModelsResponseDto =
  operations['getModels']['responses']['200']['content']['application/json'];
export type PartiallyUpdateModelRequestDto =
  operations['partiallyUpdateModel']['requestBody']['content']['application/json'];
export type PartiallyUpdateFeatureRequestDto =
  operations['partiallyUpdateModelFeature']['requestBody']['content']['application/json'];

export type OrganizationInvitationsRequestDto =
  operations['createInvitations']['requestBody']['content']['application/json'];

export type DatasetsResponseDto =
  operations['getDatasets']['responses']['200']['content']['application/json'];
