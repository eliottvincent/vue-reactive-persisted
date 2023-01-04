import { initLocalStorage } from "./helpers.js";
import { reactive } from "vue";

import persist from "./../src/";

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

it("should assert the local store (default key)", () => {
  initLocalStorage();
  persist(reactive({ foo: "bar" }));

  expect(window.localStorage.getItem("reactive_persisted")).toBe(JSON.stringify({}));
});

it("should assert the local store (custom key)", () => {
  initLocalStorage();

  persist(
    reactive({ foo: "bar" }),

    {
      key : "custom_key"
    }
  );

  expect(window.localStorage.getItem("reactive_persisted")).not.toBe(JSON.stringify({}));
  expect(window.localStorage.getItem("custom_key")).toBe(JSON.stringify({}));
});
