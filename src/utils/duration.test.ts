import { test } from "node:test";
import { strict as assert } from "node:assert";
import { formatDuration } from "./duration.ts";

test("formatDuration: zero is 0:00", () => {
  assert.equal(formatDuration(0), "0:00");
});

test("formatDuration: under a minute pads seconds", () => {
  assert.equal(formatDuration(7), "0:07");
  assert.equal(formatDuration(59), "0:59");
});

test("formatDuration: minute boundary", () => {
  assert.equal(formatDuration(60), "1:00");
  assert.equal(formatDuration(61), "1:01");
});

test("formatDuration: many minutes", () => {
  assert.equal(formatDuration(599), "9:59");
  assert.equal(formatDuration(600), "10:00");
  assert.equal(formatDuration(3661), "61:01");
});

test("formatDuration: floors fractional seconds", () => {
  assert.equal(formatDuration(7.9), "0:07");
  assert.equal(formatDuration(59.999), "0:59");
});

test("formatDuration: invalid input is 0:00, not a crash", () => {
  assert.equal(formatDuration(-5), "0:00");
  assert.equal(formatDuration(NaN), "0:00");
  assert.equal(formatDuration(Infinity), "0:00");
});
