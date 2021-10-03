export type locationType = {
  // Longitude in degrees.
  longitude: number | undefined;
  // Latitude in degrees.
  latitude: number | undefined;
  // Radius of horizontal uncertainty in metres, with 68% confidence.
  accuracy: number | undefined;
  // Metres above sea level (or null).
  altitude: number | null | undefined;
  // Vertical uncertainty in metres, with 68% confidence (or null).
  altitudeAccuracy: number | null | undefined;
  // Deviation from true north in degrees (or null).
  bearing: number | null | undefined;
  // Speed in metres per second (or null).
  speed: number | null | undefined;
  // Time the location was produced, in milliseconds since the unix epoch.
  time: number | null | undefined;
};
