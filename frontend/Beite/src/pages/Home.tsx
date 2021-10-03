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

import Geolocator from "../components/Geolocator";
import { locationType } from "../types";
import LeafletMap from "../components/LeafletMapHomePage";
import "./Home.css";
import { useState } from "react";

interface HomePageProps {}

const Home: React.FC<HomePageProps> = () => {
  const [latestLocation, setLatestLocation] = useState<
    locationType | undefined
  >();

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
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle size="large" style={titleStyle}>
              Herd
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <Geolocator latestLocationUpdateCallback={setLatestLocation} />
          <LeafletMap latestLocation={latestLocation}></LeafletMap>
        </IonContent>
      </IonPage>
    </>
  );
};

const titleStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  textAlign: "center",
};

export default Home;
