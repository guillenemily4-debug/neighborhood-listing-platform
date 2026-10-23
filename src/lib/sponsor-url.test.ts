
import test from "node:test";
import assert from "node:assert/strict";
import { validateSponsorUrl } from "./sponsor-url";

test("Allows valid HTTPS website", () => {
  const result = validateSponsorUrl(
    "https://sponsor.example"
  );
  assert.equal(result?.hostname, "sponsor.example");
});

test("Rejects HTTP website", () => {
  assert.equal(
    validateSponsorUrl("http://sponsor.example"),
    null
  );
});

test("Rejects JavaScript URL", () => {
  assert.equal(
    validateSponsorUrl("javascript:alert(1)"),
    null
  );
});

test("Rejects localhost", () => {
  assert.equal(
    validateSponsorUrl("https://localhost"),
    null
  );
});

test("Rejects URL credentials", () => {
  assert.equal(
    validateSponsorUrl("https://user:pass@sponsor.example"),
    null
  );
});

test("Rejects missing URL", () => {
  assert.equal(validateSponsorUrl(null), null);
});
test("Rejects private loopback IPv4 URL", () => {
  assert.equal(
    validateSponsorUrl("https://127.0.0.1"),
    null
  );
});

test("Rejects FTP sponsor URL", () => {
  assert.equal(
    validateSponsorUrl("ftp://example.com"),
    null
  );
});

test("Rejects URL with surrounding whitespace", () => {
  assert.equal(
    validateSponsorUrl(" https://example.com "),
    null
  );
});
test("Rejects IPv6 loopback URL", () => {
  assert.equal(
    validateSponsorUrl("https://[::1]"),
    null
  );
});