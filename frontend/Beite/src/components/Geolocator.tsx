import { locationType } from "../types";
import { registerPlugin } from "@capacitor/core";
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  "BackgroundGeolocation"
);

interface GeolocatorProps {
  latestLocationUpdateCallback: Dispatch<
    SetStateAction<locationType | undefined>
  >;
}

const Geolocator: React.FC<GeolocatorProps> = ({
  latestLocationUpdateCallback,
}) => {
  const [geoWatcherId, setGeoWatcherId] = useState<string>("");

  const cleanup = () => {
    BackgroundGeolocation.removeWatcher({
      id: geoWatcherId,
    });
    alert("CLEAN");
  };

  useEffect(() => {
    BackgroundGeolocation.addWatcher(
      {
        backgroundMessage:
          "Posisjonen din brukes til å lagre ruten din under tilsynet",
        backgroundTitle: "GPS er aktivert",
        requestPermissions: true,
        stale: false,
        distanceFilter: 0,
      },

      function callback(location, error) {
        if (error) {
          if (error.code === "NOT_AUTHORIZED") {
            if (
              window.confirm(
                "Denne appen trenger din posisjon, " +
                  "men har ikke tilgang til dette.\n\n" +
                  "Åpne innstillinger for å gi tilgang?"
              )
            ) {
              BackgroundGeolocation.openSettings();
            }
          }
          alert(error);
          return console.error(error);
        }

        // Fires the callback (provided as prop) whenever the latest location updates
        latestLocationUpdateCallback({
          // Longitude in degrees.
          longitude: location?.longitude,
          // Latitude in degrees.
          latitude: location?.latitude,
          // Radius of horizontal uncertainty in metres, with 68% confidence.
          accuracy: location?.accuracy,
          // Metres above sea level (or null).
          altitude: location?.altitude,
          // Vertical uncertainty in metres, with 68% confidence (or null).
          altitudeAccuracy: location?.altitudeAccuracy,
          // Deviation from true north in degrees (or null).
          bearing: location?.bearing,
          // Speed in metres per second (or null).
          speed: location?.speed,
          // Time the location was produced, in milliseconds since the unix epoch.
          time: location?.time,
        });
      }
    ).then(function after_the_watcher_has_been_added(watcher_id) {
      setGeoWatcherId(watcher_id);
    });

    return cleanup;
  }, []);

  return <div />;
};

export default Geolocator;
