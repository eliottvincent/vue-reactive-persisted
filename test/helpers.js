import Storage from "dom-storage";

export function initLocalStorage(key = null, object = null) {
  window.localStorage = new Storage();
  window.localStorage.clear();

  if (key && object) {
    window.localStorage.setItem(key, object);
  }
}
