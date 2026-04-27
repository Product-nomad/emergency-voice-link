import { test } from "node:test";
import { strict as assert } from "node:assert";
import { CONSENT_KEY, getConsentState, setConsent } from "./consent.ts";

/** Minimal in-memory storage that matches the Storage subset our helpers use. */
function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map<string, string>(Object.entries(initial));
  return {
    getItem(key: string): string | null {
      return data.has(key) ? (data.get(key) as string) : null;
    },
    setItem(key: string, value: string): void {
      data.set(key, value);
    },
    snapshot(): Record<string, string> {
      return Object.fromEntries(data);
    },
  };
}

test("getConsentState: missing key is unknown", () => {
  assert.equal(getConsentState(fakeStorage()), "unknown");
});

test("getConsentState: legacy 'true' value still reads as accepted", () => {
  // Older sessions of the cookie banner stored "true" instead of "accepted".
  // Treat them as accepted so existing users aren't re-prompted.
  assert.equal(
    getConsentState(fakeStorage({ [CONSENT_KEY]: "true" })),
    "accepted",
  );
});

test("getConsentState: 'accepted' reads as accepted", () => {
  assert.equal(
    getConsentState(fakeStorage({ [CONSENT_KEY]: "accepted" })),
    "accepted",
  );
});

test("getConsentState: 'declined' reads as declined", () => {
  assert.equal(
    getConsentState(fakeStorage({ [CONSENT_KEY]: "declined" })),
    "declined",
  );
});

test("getConsentState: garbage values are unknown, not crash", () => {
  assert.equal(
    getConsentState(fakeStorage({ [CONSENT_KEY]: "yes-please" })),
    "unknown",
  );
  assert.equal(
    getConsentState(fakeStorage({ [CONSENT_KEY]: "" })),
    "unknown",
  );
});

test("setConsent: writes the canonical value", () => {
  const s = fakeStorage();
  setConsent(s, "accepted");
  assert.deepEqual(s.snapshot(), { [CONSENT_KEY]: "accepted" });

  setConsent(s, "declined");
  assert.deepEqual(s.snapshot(), { [CONSENT_KEY]: "declined" });
});

test("setConsent + getConsentState round-trip", () => {
  const s = fakeStorage();
  setConsent(s, "accepted");
  assert.equal(getConsentState(s), "accepted");

  setConsent(s, "declined");
  assert.equal(getConsentState(s), "declined");
});
