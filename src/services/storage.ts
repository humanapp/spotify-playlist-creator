// ----------------------------------
// Local Storage (for simple key -> value mappings of small data)
// ----------------------------------

namespace LocalStorage {
  const KEY_PREFIX = "SPM";
  export const BEARER_TOKEN = [KEY_PREFIX, "SPOTIFY_TOKEN"].join("/");

  export function getValue(
    key: string,
    defaultValue?: string
  ): string | undefined {
    return localStorage.getItem(key) || defaultValue;
  }

  export function setValue(key: string, val: string) {
    localStorage.setItem(key, val);
  }

  export function delValue(key: string) {
    localStorage.removeItem(key);
  }
}

export function getBearerToken() {
  return LocalStorage.getValue(LocalStorage.BEARER_TOKEN);
}

export function setBearerToken(token: string) {
  LocalStorage.setValue(LocalStorage.BEARER_TOKEN, token);
}

export function delBearerToken() {
  LocalStorage.delValue(LocalStorage.BEARER_TOKEN);
}
