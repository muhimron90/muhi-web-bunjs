export function pickPropConfig<O extends unknown, K extends keyof O>(
  obj: O extends object ? O : never,
  ...keys: K[] extends infer U ? U : never
): Pick<O, K> {
  return keys.reduce(
    (newObj, prop) => {
      newObj[prop] = obj[prop];
      return newObj;
    },
    {} as Pick<O, K>,
  );
}
export function omitPropConfig<O extends unknown, K extends keyof O>(
  obj: O extends object ? O : never,
  ...keys: K[] extends infer U ? U : never
): Omit<O, K> {
  /* store in new object for preventing delete original source  */
  let newObj = { ...obj };
  keys.forEach((k) => {
    delete newObj[k];
  });
  return newObj as Omit<O, K>;
}
