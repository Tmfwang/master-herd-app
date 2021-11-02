import { useEffect, useState } from "react";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";

import GeolocatorForeground from "../../geolocators/GeolocatorForeground";
import LeafletMap from "./LeafletMapDownloadPage";

import { locationType, pathCoordinateType } from "../../../types";

import "./MapDownloadPage.css";
import "leaflet/dist/leaflet.css";

interface MapDownloadPageProps {}

// This is the main component for the map download page
const MapDownloadPage: React.FC<MapDownloadPageProps> = () => {
  const [latestLocation, setLatestLocation] = useState<
    locationType | undefined
  >();

  const [pathCoordinates, setPathCoordinates] = useState<pathCoordinateType[]>(
    [] as pathCoordinateType[]
  );

  useEffect(() => {
    if (latestLocation && latestLocation.longitude && latestLocation.latitude) {
      setPathCoordinates([
        ...pathCoordinates,
        {
          longitude: latestLocation.longitude,
          latitude: latestLocation.latitude,
        },
      ]);
    }
  }, [latestLocation]);

  return (
    <>
      <MainHamburgerMenu />

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle size="large" className="titleStyle">
              Herd
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <GeolocatorForeground
            latestLocationUpdateCallback={setLatestLocation}
          />

          <LeafletMap latestLocation={latestLocation}></LeafletMap>
        </IonContent>
      </IonPage>
    </>
  );
};

export default MapDownloadPage;
