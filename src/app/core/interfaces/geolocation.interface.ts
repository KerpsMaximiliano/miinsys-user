// Success.
export interface IGeoPosition {
  coords: IGeoCoordinates;
  timestamp: number;
}

export interface IGeoCoordinates {
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
