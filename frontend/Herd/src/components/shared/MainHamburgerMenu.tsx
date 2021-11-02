import React from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonList,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonIcon,
  useIonAlert,
  useIonToast,
} from "@ionic/react";

import {
  locateOutline,
  calendarOutline,
  cloudDownloadOutline,
  trashOutline,
  homeOutline,
  settingsOutline,
  logInOutline,
  createOutline,
} from "ionicons/icons";

// @ts-ignore
import { truncate } from "leaflet.offline";

// @ts-ignore
import { getStorageLength } from "leaflet.offline/src/TileManager";

interface MainHamburgerMenuProps {}

// A shared component containing the hamburger/side menu and all its contents
const MainHamburgerMenu: React.FC<MainHamburgerMenuProps> = () => {
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

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
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Diverse</IonLabel>
            </IonItemDivider>

            <IonItem href="/home">
              <IonIcon slot="start" icon={homeOutline}></IonIcon>
              <IonLabel>Gå til forsiden</IonLabel>
            </IonItem>
            <IonItem href="/settings">
              <IonIcon slot="start" icon={settingsOutline}></IonIcon>
              <IonLabel>Innstillinger</IonLabel>
            </IonItem>
          </IonItemGroup>

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Tilsyn</IonLabel>
            </IonItemDivider>

            <IonItem href="/new-supervision">
              <IonIcon slot="start" icon={locateOutline}></IonIcon>
              <IonLabel>Start ny tilsynstur</IonLabel>
            </IonItem>
            <IonItem href="/previous-supervisions">
              <IonIcon slot="start" icon={calendarOutline}></IonIcon>
              <IonLabel>Se tidligere tilsynsturer</IonLabel>
            </IonItem>
          </IonItemGroup>

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Kart</IonLabel>
            </IonItemDivider>

            <IonItem href="/download-maps">
              <IonIcon slot="start" icon={cloudDownloadOutline}></IonIcon>
              <IonLabel>Last ned kart</IonLabel>
            </IonItem>
            <IonItem button onClick={handleDeleteMapsClicked}>
              <IonIcon slot="start" icon={trashOutline}></IonIcon>
              <IonLabel>Slett nedlastede kart</IonLabel>
            </IonItem>
          </IonItemGroup>

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Brukerprofil</IonLabel>
            </IonItemDivider>

            <IonItem href="/">
              <IonIcon slot="start" icon={logInOutline}></IonIcon>
              <IonLabel>Logg inn</IonLabel>
            </IonItem>
            <IonItem href="/">
              <IonIcon slot="start" icon={createOutline}></IonIcon>
              <IonLabel>Registrer bruker</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default MainHamburgerMenu;
