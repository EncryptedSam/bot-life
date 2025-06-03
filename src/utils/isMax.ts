export function isMax(keys: string[], filtered: string[], key: string): boolean {
  const keyIndex = keys.indexOf(key);

  if (keyIndex >= 0) {
    filtered = filtered.filter((el) => el !== key);
    for (let i = 0; i < filtered.length; i++) {
      const index = keys.indexOf(filtered[i]);
      if (index > keyIndex) return false;
    }

    return true;
  }

  return false;
}
