import { initLocalStorage } from "./helpers.js";
import { reactive, nextTick } from "vue";

import persist from "./../src/";

const DEFAULT_KEY = "reactive_persisted";
const CUSTOM_KEY = "custom_key";


it("should throw an error when no reactive object is passed", () => {
  initLocalStorage();

  expect(() => persist()).toThrow();
});

it("should be created with no options", () => {
  const object = reactive({ foo: "bar" });

  expect(() => persist(object)).not.toThrow();
});

it("should return the reactive object", () => {
  initLocalStorage();
  const object = reactive({ foo: "bar" });
  const store = persist(object);

  expect(JSON.stringify(store)).toBe(JSON.stringify(object));
});

it("should assert the local store", () => {
  initLocalStorage();
  persist(reactive({ foo: "bar" }));

  expect(window.localStorage.getItem(DEFAULT_KEY)).toBe(JSON.stringify({}));
});

it("should assert the local store (custom key)", () => {
  initLocalStorage();

  persist(
    reactive({ foo: "bar" }),

    {
      key : CUSTOM_KEY
    }
  );

  expect(window.localStorage.getItem(DEFAULT_KEY)).not.toBe(JSON.stringify({}));
  expect(window.localStorage.getItem(CUSTOM_KEY)).toBe(JSON.stringify({}));
});

it("should sync the reactive object with local store on initialization", () => {
  initLocalStorage(DEFAULT_KEY, JSON.stringify({ foo: "baz" }));
  const state = reactive({ foo: "bar" });

  persist(state);

  expect(JSON.stringify(state)).toBe(JSON.stringify({foo: "baz"}));
});

it("should sync the reactive object with local store on initialization (merge)", () => {
  initLocalStorage(DEFAULT_KEY, JSON.stringify({ bar: "foo" }));
  const state = reactive({ foo: "bar" });

  persist(state);

  expect(JSON.stringify(state)).toBe(JSON.stringify({ foo: "bar", bar: "foo" }));
});

it("should not sync the reactive object with local store on initialization (invalid JSON)", () => {
  initLocalStorage(DEFAULT_KEY, "<invalid JSON>");
  const state = reactive({ foo: "bar" });

  persist(state);

  expect(JSON.stringify(state)).toBe(JSON.stringify({foo: "bar"}));
});

it("should not sync the reactive object with local store on initialization (null)", () => {
  initLocalStorage(DEFAULT_KEY, "<invalid JSON>");
  const state = reactive({ foo: "bar" });

  persist(state);

  expect(JSON.stringify(state)).toBe(JSON.stringify({foo: "bar"}));
});

it("should persist the changed reactive object back to local store", async () => {
  initLocalStorage();
  const state = reactive({ foo: "bar" });

  persist(state);

  state.foo = "baz";

  await nextTick();

  expect(window.localStorage.getItem(DEFAULT_KEY)).toBe(JSON.stringify({foo: "baz"}));
});

it("should persist the changed reactive object back to local store (custom key)", async () => {
  initLocalStorage();
  const state = reactive({ foo: "bar" });

  persist(
    state,

    {
      key : CUSTOM_KEY
    }
  );

  state.foo = "baz";

  await nextTick();

  expect(window.localStorage.getItem(CUSTOM_KEY)).toBe(JSON.stringify({foo: "baz"}));
  expect(window.localStorage.getItem(DEFAULT_KEY)).not.toBe(JSON.stringify({foo: "baz"}));
});
