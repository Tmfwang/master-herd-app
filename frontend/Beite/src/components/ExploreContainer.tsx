import "./ExploreContainer.css";

import { IonButton, IonContent } from "@ionic/react";
import { registerPlugin } from "@capacitor/core";
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { useEffect, useState } from "react";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  "BackgroundGeolocation"
);

type locationType = {
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

interface ContainerProps {}

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [latestLocation, setLatestLocation] = useState<
    locationType | undefined
  >();

  useEffect(() => {
    alert("YO");
    BackgroundGeolocation.addWatcher(
      {
        backgroundMessage:
          "Posisjonen din brukes til å lagre ruten din under tilsynet",
        backgroundTitle: "GPS er aktivert",
        requestPermissions: true,
        stale: false,
        distanceFilter: 5,
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

        setLatestLocation({
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

        return console.log(location);
      }
    ).then(function after_the_watcher_has_been_added(watcher_id) {
      // When a watcher is no longer needed, it should be removed by calling
      // 'removeWatcher' with an object containing its ID.
      /* BackgroundGeolocation.removeWatcher({
        id: watcher_id,
      }); */
      alert(watcher_id);
    });
  }, []);

  return (
    <div className="container">
      <strong>HELLO WORLD!</strong>
      <p>
        {"Lon: " +
          latestLocation?.longitude +
          ", Lat: " +
          latestLocation?.latitude}
      </p>
      <IonContent>
        {/*-- Default --*/}
        <IonButton>Update location</IonButton>
      </IonContent>
    </div>
  );
};

export default ExploreContainer;
