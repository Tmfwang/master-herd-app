import { useState } from "react";

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
import LeafletMap from "./LeafletMapHomePage";

import { locationType } from "../../../types";

import "leaflet/dist/leaflet.css";
import "./HomePage.css";

interface HomePageProps {}

// This is the main component for the home page
const HomePage: React.FC<HomePageProps> = () => {
  const [latestLocation, setLatestLocation] = useState<
    locationType | undefined
  >();

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

export default HomePage;
