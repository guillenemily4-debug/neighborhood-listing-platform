import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(
  fs.readFileSync(
    new URL("../schemas/property.schema.json", import.meta.url),
    "utf8"
  )
);

const properties = JSON.parse(
  fs.readFileSync(
    new URL("../data/generated/properties.json", import.meta.url),
    "utf8"
  )
);

const ajv = new Ajv2020({ allErrors: true });
const validate = ajv.compile(schema);

function copyRecord() {
  return JSON.parse(JSON.stringify(properties[0]));
}

test("valid property passes validation", () => {
  const property = copyRecord();

  const valid = validate(property);

  assert.equal(valid, true);
});

test("property missing ID fails validation", () => {
  const property = copyRecord();

  delete property.property_id;

  const valid = validate(property);

  assert.equal(valid, false);
});

test("negative price fails validation", () => {
  const property = copyRecord();

  property.price = -500000;

  const valid = validate(property);

  assert.equal(valid, false);
});

test("bad ZIP code fails validation", () => {
  const property = copyRecord();

  property.zip_code = "ABC";

  const valid = validate(property);

  assert.equal(valid, false);
});

test("unknown property field fails validation", () => {
  const property = copyRecord();

  property.unknown_field = "should fail";

  const valid = validate(property);

  assert.equal(valid, false);
});