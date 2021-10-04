import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonList,
  IonItem,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";

import GeolocatorForeground from "../../geolocators/GeolocatorForeground";
import { locationType, pathCoordinateType } from "../../../types";
import LeafletMap from "./LeafletMapHomePage";
import "./Home.css";
import { useEffect, useState } from "react";

interface HomePageProps {}

const Home: React.FC<HomePageProps> = () => {
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
      <IonMenu
        side="start"
        swipeGesture={false}
        menuId="first"
        contentId="main-content"
      >
        <IonHeader>
          <IonToolbar color="black">
            <IonTitle>Alternativer</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem href="/login">Logg inn</IonItem>
            <IonItem href="/register">Registrer bruker</IonItem>
            <IonItem href="/new-supervision">Start ny tilsynstur</IonItem>
            <IonItem href="/past-supervisions">
              Se tidligere tilsynsturer
            </IonItem>
            <IonItem href="/download-maps">Last ned kart</IonItem>
            <IonItem href="delete-maps">Slett nedlastede kart</IonItem>

            <IonItem>{latestLocation?.longitude}</IonItem>

            <IonItem>{latestLocation?.latitude}</IonItem>
            <IonItem>{latestLocation?.bearing}</IonItem>
            <IonItem>{pathCoordinates.length}</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

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

export default Home;
