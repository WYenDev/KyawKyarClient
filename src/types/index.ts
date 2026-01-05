export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color?: string;
  status: 'available' | 'sold' | 'reserved';
  location: string;
  features: string[];
  description: string;
  isFeatured?: boolean;
  isPopular?: boolean;
}

export interface FilterOptions {
  brand: string; // empty string means "All"
  model: string; // empty string means "All"
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];
  showrooms?: string[];
  steeringPositions?: string[];
  status: Array<'available' | 'sold' | 'reserved'>;
}


export type Role = "ADMIN" | "SUPER_ADMIN";

export interface User {
  username: string;
  accessToken: string;
  needPasswordChange: boolean;
  role: Role
}
