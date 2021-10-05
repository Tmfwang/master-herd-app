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
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import GeolocatorForeground from "../../geolocators/GeolocatorMock";
import { locationType, pathCoordinateType } from "../../../types";
import LeafletMap from "./LeafletMapHomePage";
import "./HomePage.css";
import { useEffect, useState } from "react";

// @ts-ignore
import { truncate } from "leaflet.offline";

// @ts-ignore
import { getStorageLength } from "leaflet.offline/src/TileManager";

interface HomePageProps {}

const Home: React.FC<HomePageProps> = () => {
  const [latestLocation, setLatestLocation] = useState<
    locationType | undefined
  >();

  const [pathCoordinates, setPathCoordinates] = useState<pathCoordinateType[]>(
    [] as pathCoordinateType[]
  );

  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

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

  // Asks user for confirmation of map deletion, or give them a specific message if they have no downloaded maps
  async function handleDeleteMapsClicked() {
    const storageLength = await getStorageLength();

    if (storageLength > 0) {
      presentAlert({
        header: "Slett nedlastede kartutsnitt?",
        message:
          "Ønsker du å slette de " +
          storageLength +
          ' kartrutene du har nedlastet på din mobil? Dersom du sletter disse vil du være avhengig av internettforbindelse for å bruke kartet. Du kan laste ned et nytt kartutsnitt ved å trykke på "Last ned kart" i sidemenyen.',
        buttons: [
          "Avbryt",
          {
            text: "Slett",
            handler: (d) => {
              truncate()
                .then(
                  presentToast({
                    header: "Kartutsnittene ble slettet",
                    message:
                      storageLength +
                      " kartruter har blitt slettet fra din mobil",
                    duration: 7000,
                  })
                )
                .catch((err: any) => {
                  presentToast({
                    header: "Noe gikk galt",
                    message: "Prøv igjen senere",
                    duration: 5000,
                  });
                });
            },
          },
        ],
      });
    } else {
      presentAlert({
        header: "Ingen nedlastede kartutsnitt",
        message:
          'Du har ingen kartutsnitt nedlastet på din mobil. Dersom du ønsker å kunne bruke kartet uavhengig av internettforbindelse, kan du laste ned et nytt kartutsnitt ved å trykke på "Last ned kart" i sidemenyen.',
        buttons: ["OK"],
      });
    }
  }

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
            <IonItem href="/home">Gå til forsiden</IonItem>
            <IonItem href="/login">Logg inn</IonItem>
            <IonItem href="/register">Registrer bruker</IonItem>
            <IonItem href="/new-supervision">Start ny tilsynstur</IonItem>
            <IonItem href="/past-supervisions">
              Se tidligere tilsynsturer
            </IonItem>
            <IonItem href="/download-maps">Last ned kart</IonItem>
            <IonItem button onClick={handleDeleteMapsClicked}>
              Slett nedlastede kart
            </IonItem>

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
