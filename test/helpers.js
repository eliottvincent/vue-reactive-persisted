import Storage from "dom-storage";


/**
 * Initializes local storage
 * @public
 * @param  {object} hosts
 * @return {object} Promise object
 */
var initLocalStorage = function(key = null, object = null) {
  window.localStorage = new Storage();
  window.localStorage.clear();

  if (key && object) {
    window.localStorage.setItem(key, object);
  }
};

export { initLocalStorage };
