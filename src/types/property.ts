export type Amenity =
  | "garage"
  | "pool"
  | "central_air"
  | "fireplace"
  | "yard"
  | "balcony"
  | "parking";

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
}

export interface Property {
  property_id: string;
  address: PropertyAddress;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  amenities: Amenity[];
  zip_code: string;
  local_sponsors: string[];
}