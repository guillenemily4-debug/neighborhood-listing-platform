# AI Normalization Review

## Context

For Lab 3, ChatGPT and Gemini were asked to review the fictional property data model for normalization problems and compare different approaches for storing amenities.

No real client or personal data was included.

## Data Model Reviewed

### Property
- property_id
- address
- price
- bedrooms
- bathrooms
- square_feet
- amenities
- zip_code
- local_sponsors

### Sponsor
- sponsor_id
- name

### PropertySponsor
- property_id
- sponsor_id

## ChatGPT Review

ChatGPT identified the following issues:

- Sponsor relationships should use PropertySponsor as the relational many-to-many relationship rather than duplicating full sponsor data.
- ZIP codes should remain strings because they may contain leading zeroes.
- Free-text amenities could create inconsistent values such as "central air", "central_air", and "AC".
- Controlled amenity values are appropriate for the current JSON application.
- A separate Amenity and PropertyAmenity relationship could be considered later for a larger relational system.

## Gemini Review

Gemini identified the following issues:

- Postal address fields should be grouped consistently.
- Maintaining both local_sponsors and a PropertySponsor relationship could cause data drift if both were independently persisted.
- Bathrooms should support partial values such as 1.5 and 2.5.
- Free-text amenities create spelling, capitalization, and filtering problems.
- Controlled values provide consistent data with low complexity.
- Separate Amenity and PropertyAmenity tables provide stronger normalization but add complexity.

Gemini recommended controlled amenity values for this small JSON-based application.

## Accepted Decisions

### Amenities

Amenities will use controlled values:

- garage
- pool
- central_air
- fireplace
- yard
- balcony
- parking

This prevents inconsistent spelling and makes validation and filtering simpler.

### Bathrooms

Bathrooms remain a number rather than an integer so values such as 1.5 and 2.5 are supported.

### Sponsors

Sponsor data is modeled separately from Property.

PropertySponsor represents the normalized relationship between properties and sponsors.

The local_sponsors field in the JSON contract contains sponsor identifiers for the API representation rather than duplicating complete Sponsor records.

### ZIP Codes

ZIP codes remain strings so leading zeroes can be preserved.

## Alternatives Rejected

### Free-Text Amenities

Rejected because inconsistent spelling and terminology would make validation and filtering unreliable.

### Amenity Join Table

Not selected for the current JSON-based application because it adds unnecessary complexity.

A separate Amenity and PropertyAmenity model may be appropriate later if the application moves to a larger relational database.

## Final Decision

For the current Lab 3 application, amenities use controlled string values enforced by the JSON Schema.

The JSON Schema remains the runtime data contract, and AJV validates records before they are passed to the user interface.