import Ajv2020 from "ajv/dist/2020";
import schema from "../../schemas/property.schema.json";
import rawProperties from "../../data/generated/properties.json";

import type { Property as DataProperty } from "../types/property";
import type { Property as UIProperty } from "../types";

const ajv = new Ajv2020({ allErrors: true });
const validate = ajv.compile(schema);

function toUIProperty(property: DataProperty): UIProperty {
  return {
    id: property.property_id,

    title: `${property.bedrooms}-Bedroom Home in ${property.address.city}`,

    price: property.price,

    location: {
      address: property.address.street,
      city: property.address.city,
      state: property.address.state,
      zipCode: property.zip_code,
    },

    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.square_feet,

    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",

    imageAlt: `Property located at ${property.address.street}, ${property.address.city}`,
  };
}

export const validatedProperties: UIProperty[] = [];

for (const record of rawProperties) {
  if (validate(record)) {
    validatedProperties.push(
      toUIProperty(record as DataProperty)
    );
  } else {
    console.error(
      "Invalid property record rejected:",
      record,
      validate.errors
    );
  }
}