// Success.
export interface IGeoPosition {
  coords: ICoordinates;
  timestamp: number;
}

export interface ICoordinates {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
}

// Error.
export interface IGeoError {
  code: number;
  message: string;
}

// ! Address. (en desuso)
export interface IGeoAddress {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address: IAddress;
}

// ! (en desuso)
export interface IAddress {
  city?: string;
  country: string;
  country_code: string;
  postcode?: string;
  road?: string;
  state?: string;
  suburb?: string;
}
