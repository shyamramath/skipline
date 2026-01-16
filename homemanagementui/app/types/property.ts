export interface PropertyFeatures {
  architectureType: string;
  cooling: boolean;
  coolingType: string;
  floorCount: number;
  foundationType: string;
  garage: boolean;
  garageType: string;
  heating: boolean;
  heatingType: string;
}

export interface TaxAssessment {
  year: number;
  value: number;
  land: number;
  improvements: number;
}

export interface PropertyTax {
  year: number;
  total: number;
}

export interface MailingAddress {
  id: string;
  formattedAddress: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  stateFips: string;
  zipCode: string;
}

export interface Owner {
  names: string[];
  mailingAddress: MailingAddress;
}

export interface Property {
  id: string;
  formattedAddress: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  stateFips?: string;
  zipCode: string;
  county?: string;
  countyFips?: string;
  latitude?: number;
  longitude?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  lotSize?: number;
  yearBuilt?: number;
  assessorID?: string;
  legalDescription?: string;
  subdivision?: string;
  lastSaleDate?: string;
  features?: PropertyFeatures;
  taxAssessments?: Record<string, TaxAssessment>;
  propertyTaxes?: Record<string, PropertyTax>;
  owner?: Owner;
  ownerOccupied?: boolean;
}
