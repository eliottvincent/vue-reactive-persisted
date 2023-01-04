import { watch } from "vue";
import { get, set } from "dotly";

var DEFAULT_KEY = "reactive_persisted";

/**
 * Persists a Vue reactive object
 * @public
 * @param  {object} object
 * @param  {object} [options]
 * @return {object} The Vue reactive object
 */
var persist = function(object, options = {}) {
  if (!object) {
    throw new Error("Please provide a reactive object");
  }

  let _storage = window.localStorage,
    _key = options.key || DEFAULT_KEY,
    _paths = options.paths || null;

  let _store = __assertStore(_storage, _key);

  // Sync reactive object with local store
  __syncReactiveWithLocal(object, _store, _paths);

  // Sync local store with reactive object
  watch(
    object,
    newObject => {
      __syncLocalWithReactive(newObject, _storage, _key, _paths);
    },
    { deep: true }
  );

  return object;
};

/**
 * Asserts store
 * @private
 * @param  {object} storage
 * @param  {string} key
 * @return {object} The store
 */
var __assertStore = function(storage, key) {
  let _store = storage.getItem(key);

  if (!_store) {
    storage.setItem(key, JSON.stringify({}));
  }

  return __getStore(storage, key);
};

/**
 * Gets store
 * @private
 * @param  {object} storage
 * @param  {string} key
 * @return {object} The store
 */
var __getStore = function(storage, key) {
  let _store = storage.getItem(key);

  try {
    if (typeof _store === "string") {
      _store = JSON.parse(_store);

      if (typeof _store === "object") {
        return _store;
      }
    }
  } catch (error) {
    // Ignore
  }

  return undefined;
};

/**
 * Syncs reactive object with local store
 * @private
 * @param  {object} object
 * @param  {object} store
 * @param  {object} [paths]
 * @return {undefined}
 */
var __syncReactiveWithLocal = function(object, store, paths = null) {
  if (paths) {
    paths.forEach(path => {
      let _value = get(store, path);

      if (_value !== undefined) {
        set(object, path, _value);
      }
    });
  } else {
    object = Object.assign(object, store);
  }
};

/**
 * Syncs local store with reactive object
 * @private
 * @param  {object} object
 * @param  {object} storage
 * @param  {string} key
 * @param  {object} [paths]
 * @return {undefined}
 */
var __syncLocalWithReactive = function(object, storage, key, paths = null) {
  let _store = {};

  if (paths) {
    paths.forEach(path => {
      set(_store, path, get(object, path));
    });
  } else {
    _store = Object.assign({}, object);
  }

  storage.setItem(key, JSON.stringify(_store));
};

export default persist;

export { persist };
