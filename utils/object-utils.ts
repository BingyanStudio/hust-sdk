type Prettify<T> = {
  [K in keyof T]: T[K] extends object ? Prettify<T[K]> : T[K];
} & {};

type DeepRenameKeys<T, K> = Prettify<{
  [P in keyof T as P extends keyof K
    ? K[P] extends string
      ? K[P]
      : P
    : P]: P extends keyof K
    ? K[P] extends string
      ? T[P]
      : T[P] extends Record<string, any>
        ? K[P] extends Record<string, any>
          ? DeepRenameKeys<T[P], K[P]>
          : T[P]
        : T[P]
    : T[P];
}>;

export function renameKeys<
  T extends Record<string, any>,
  M extends Record<string, string | Record<string, any>>,
>(keysMap: M) {
  return function <U extends T>(obj: U): DeepRenameKeys<U, M> {
    function rename(target: any, map: any): any {
      if (typeof target !== 'object' || target === null) {
        return target;
      }

      return Object.entries(target).reduce((acc, [key, value]) => {
        if (key in map) {
          const mapValue = map[key];
          if (typeof mapValue === 'string') {
            acc[mapValue] = value;
          } else if (typeof mapValue === 'object') {
            acc[key] = rename(value, mapValue);
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
    }

    return rename(obj, keysMap);
  };
}
