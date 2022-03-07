export const isObject = (object: any) => {
  return typeof object === "object";
};

export const isArray = (array: any[]) => {
  return Array.isArray(array);
};

export const isString = (variable: any) => {
  return typeof variable === "string";
};
