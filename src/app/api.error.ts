import { components } from './api.schema.d';

export type ApiErrorCode = components['schemas']['ErrorCode'];

export const EMAIL_NOT_VERIFIED: ApiErrorCode = '1001';
