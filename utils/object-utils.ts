type MapObject = { [key: string]: string | object };

const renameKeys =
  (keysMap: MapObject) =>
  (obj: MapObject): MapObject =>
    Object.entries(obj).reduce(
      (a, [k, v]) =>
        k in keysMap
          ? typeof keysMap[k] === 'object'
            ? {
                ...a,
                [k]:
                  typeof v === 'object'
                    ? renameKeys(keysMap[k] as MapObject)(v as MapObject)
                    : v,
              }
            : { ...a, [keysMap[k] as string]: v }
          : { ...a, [k]: v },
      {},
    );
