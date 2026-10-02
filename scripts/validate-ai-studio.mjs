import fs from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(
  fs.readFileSync(
    new URL("../schemas/property.schema.json", import.meta.url),
    "utf8"
  )
);

const raw = JSON.parse(
  fs.readFileSync(
    new URL("../data/generated/ai-studio-regenerated.json", import.meta.url),
    "utf8"
  )
);

const ajv = new Ajv2020({ allErrors: true });
const validate = ajv.compile(schema);

console.log("Validating raw AI Studio output...\n");

if (!Array.isArray(raw)) {
  console.log("❌ Raw AI Studio output does not match the local seed-file shape.");
  console.log('Expected: an array of property records.');
  console.log('Received: an object containing a "listings" array.\n');
}

const listings = raw.listings;

if (!Array.isArray(listings)) {
  console.log('❌ Could not find a valid "listings" array.');
  process.exitCode = 1;
} else {
  let allValid = true;

  listings.forEach((property, index) => {
    const valid = validate(property);

    if (valid) {
      console.log(`✅ Listing ${index + 1} (${property.property_id}) is valid.`);
    } else {
      allValid = false;
      console.log(`❌ Listing ${index + 1} failed validation:`);
      console.log(validate.errors);
    }
  });

  if (allValid) {
    console.log("\n✅ All individual AI Studio listings passed the local schema.");
    console.log("⚠️ The only mismatch is the outer listings wrapper.");
  } else {
    console.log("\n❌ One or more AI Studio listings failed validation.");
    process.exitCode = 1;
  }
}