export function deepEqual(a: unknown, b: unknown) {
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === "object" && a !== null) {
    if (a === b) {
      return true;
    }
    if (Array.isArray(a)) {
      if (a.length !== (b as unknown[]).length) {
        return false;
      }
      for (let index = 0; index < a.length; index++) {
        const elementA = a[index];
        const elementB = (b as unknown[])[index];
        const isEqual = deepEqual(elementA, elementB);
        if (!isEqual) {
          return false;
        }
      }
      return true;
    }
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b as object).length) {
      return false;
    }
    for (const key of keys) {
      const isEqual = deepEqual(
        a[key as keyof typeof a],
        (b as object)[key as keyof typeof b],
      );
      if (!isEqual) {
        return false;
      }
    }
    return true;
  }
  return a === b;
}
