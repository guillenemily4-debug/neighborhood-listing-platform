# ADR 001: Property Data Contract

## Status

Accepted

## Context

The neighborhood listing application needs a consistent way to represent property data before it reaches the user interface.

Property data may come from generated JSON or other external sources, so the application must validate records before rendering them.

The required property fields are:

- property_id
- address
- price
- bedrooms
- bathrooms
- square_feet
- amenities
- zip_code
- local_sponsors

The application also needs separate Property, Sponsor, and PropertySponsor concepts to avoid unnecessary duplication and support property-to-sponsor relationships.

## Decision

JSON Schema will be used as the runtime data contract for Property records.

AJV will validate property records against `schemas/property.schema.json` before the records are passed to the UI.

TypeScript interfaces will provide compile-time type checking.

Amenities will use controlled string values rather than unrestricted free text.

Allowed amenities are:

- garage
- pool
- central_air
- fireplace
- yard
- balcony
- parking

Bathrooms will use a number type so partial bathrooms such as 1.5 and 2.5 can be represented.

ZIP codes will remain strings so leading zeroes can be preserved.

Sponsors are modeled separately from properties. A PropertySponsor relationship represents the normalized many-to-many relationship between properties and sponsors.

The JSON `local_sponsors` field contains sponsor identifiers for the API representation rather than duplicating complete sponsor objects.

## Alternatives Considered

### Free-Text Amenities

Free-text amenities were considered but rejected because they could create inconsistent values such as:

- central air
- central_air
- AC

This would make validation and filtering less reliable.

### Amenity Join Table

A separate Amenity and PropertyAmenity relationship would provide stronger relational normalization.

This was not selected for the current application because the project is currently small and JSON-based. It would introduce unnecessary complexity.

### TypeScript-Only Validation

Using only TypeScript types was considered but rejected because TypeScript does not validate data at runtime.

External or generated JSON could still contain invalid values.

### Zod as the Source of Truth

Using Zod as a single source for runtime validation and TypeScript types was considered.

JSON Schema and AJV were selected because the lab specifically focuses on JSON Schema and structured AI output.

## Consequences

### Positive

- Invalid property records are rejected before reaching the UI.
- Property data follows one explicit contract.
- Controlled amenities improve consistency and filtering.
- TypeScript provides compile-time safety.
- JSON Schema provides runtime validation.
- AI-generated data can be checked before use.

### Negative

- The JSON Schema and TypeScript interfaces must remain synchronized.
- Adding a new amenity requires updating the controlled list.
- AI Studio may use a slightly different wrapper structure for structured output.

## Validation Strategy

The application tests:

1. A valid property record.
2. A property missing `property_id`.
3. A property with a negative price.
4. A property with an invalid ZIP code.
5. A property containing an unknown field.

Invalid records fail validation and are not passed to the PropertyCard UI.

## AI Structured Output

Google AI Studio was used to generate five synthetic property listings.

The generated records were saved separately from the local seed records.

AI Studio required a root object containing a `listings` array, while the local seed file uses a direct array of properties.

The integration layer reads the `listings` array before validating each property against the local JSON Schema.

All data used in the experiment was synthetic and contained no real client or personal data.