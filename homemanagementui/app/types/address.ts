export interface AddressSuggestion {
  text?: string;
  street_line: string;
  secondary?: string;
  city: string;
  state: string;
  zipcode?: string;
  entries?: number;
}

export interface SmartyAutocompleteResponse {
  suggestions: AddressSuggestion[];
}

export interface SelectedAddress {
  street: string;
  secondary?: string;
  city: string;
  state: string;
  zipcode: string;
  fullAddress: string;
}
