export interface Property {
  id: string;
  title: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  imageUrl: string;
  imageAlt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  headline: string;
  targetUrl: string;
  imageUrl?: string;
}