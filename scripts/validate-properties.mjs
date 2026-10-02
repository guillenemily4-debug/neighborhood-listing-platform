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

let allValid = true;

properties.forEach((property, index) => {
  const valid = validate(property);

  if (valid) {
    console.log(`✅ Property ${index + 1} (${property.property_id}) is valid.`);
  } else {
    allValid = false;
    console.log(`❌ Property ${index + 1} is invalid:`);
    console.log(validate.errors);
  }
});

if (allValid) {
  console.log("\n✅ All property records passed validation.");
} else {
  console.log("\n❌ Some property records failed validation.");
  process.exitCode = 1;
}