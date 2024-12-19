export const isNullOrUndefinedOrEmpty = (value: any): boolean => {
  return value === null || value === undefined || value.toString() === '';
};
