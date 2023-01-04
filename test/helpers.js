import Storage from "dom-storage";

export function initLocalStorage () {
  window.localStorage = new Storage();
  window.localStorage.clear();
}
