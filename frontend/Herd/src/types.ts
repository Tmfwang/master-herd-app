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

export type pathCoordinateType = {
  // Longitude in degrees.
  longitude: number;
  // Latitude in degrees.
  latitude: number;
};

export type observationButtonType = {
  // The textual content of the button
  textContent: string;

  // An ID identifying the button that is active
  buttonId: string;
};

export type numberButtonType = {
  // The textual label of the button
  textLabel: string;

  // An ID identifying the button that is active
  buttonId: string;

  currentValue: number;
};

export type observationDetailsType = {
  alle: {
    typeObservasjon: string;
  };

  gruppeSau: {
    fargePaSau: { hvitOrGra: number; brun: number; sort: number };
    fargePaEiermerke: {
      rod: number;
      bla: number;
      gul: number;
      gronn: number;
    };
  };

  soye: {
    fargePaSau: { hvitOrGra: number; brun: number; sort: number };
    fargePaBjelleslips: {
      rod: number;
      bla: number;
      gulOrIngen: number;
      gronn: number;
    };
    fargePaEiermerke: {
      rod: number;
      bla: number;
      gul: number;
      gronn: number;
    };
  };

  lam: {
    fargePaSau: { hvitOrGra: number; brun: number; sort: number };
    fargePaEiermerke: {
      rod: number;
      bla: number;
      gul: number;
      gronn: number;
    };
  };

  rovdyr: {
    typeRovdyr: string;
  };

  skadetSau: {
    typeSkade: string;
    fargePaSau: string;
    fargePaEiermerke: string;
  };

  dodSau: {
    dodsarsak: string;
    fargePaSau: string;
    fargePaEiermerke: string;
  };
};
