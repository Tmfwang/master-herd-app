import { App } from "@capacitor/app";

import { locationType } from "../types";
import { registerPlugin } from "@capacitor/core";
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { useEffect, useState } from "react";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  "BackgroundGeolocation"
);

interface GeolocatorProps {
  latestLocationUpdateCallback: (location: locationType) => void;
}

// This geolocator stops listening to location updates whenever the app is backgrounded.
// This can be used to provide information like user orientation only when the
// app is foregrounded (to save power and space)
const GeolocatorForeground: React.FC<GeolocatorProps> = ({
  latestLocationUpdateCallback,
}) => {
  const [geoWatcherId, setGeoWatcherId] = useState<string>("");
  const [appIsActive, setAppIsActive] = useState<boolean>(false);

  // Adds a listener to whether or not the app is in the foreground (active),
  // which removes the geolocator watcher whenever the app is backgrounded and
  // adds another watcher whenever the app is foregrounded again.
  useEffect(() => {
    App.addListener("appStateChange", ({ isActive }) => {
      setAppIsActive(isActive);
    });

    setAppIsActive(true);

    return cleanup;
  }, []);

  useEffect(() => {
    if (appIsActive) {
      addForegroundWatcher();
    } else {
      cleanup();
    }
  }, [appIsActive]);

  const addForegroundWatcher = () => {
    cleanup();

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
  };

  const cleanup = () => {
    if (geoWatcherId) {
      BackgroundGeolocation.removeWatcher({
        id: geoWatcherId,
      });

      setGeoWatcherId("");
    }
  };

  return <div />;
};

export default GeolocatorForeground;
