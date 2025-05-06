const camelToSnake = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const convertKeysToSnakeCase = <T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = obj[key];
    }
  }

  return result;
};

export { camelToSnake, convertKeysToSnakeCase };
