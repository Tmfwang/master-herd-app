import React from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonList,
  IonItem,
  useIonAlert,
  useIonToast,
} from "@ionic/react";

// @ts-ignore
import { truncate } from "leaflet.offline";

// @ts-ignore
import { getStorageLength } from "leaflet.offline/src/TileManager";

interface MainHamburgerMenuProps {}

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
          <IonItem href="/home">Gå til forsiden</IonItem>
          <IonItem href="/login">Logg inn</IonItem>
          <IonItem href="/register">Registrer bruker</IonItem>
          <IonItem href="/new-supervision">Start ny tilsynstur</IonItem>
          <IonItem href="/past-supervisions">Se tidligere tilsynsturer</IonItem>
          <IonItem href="/download-maps">Last ned kart</IonItem>
          <IonItem button onClick={handleDeleteMapsClicked}>
            Slett nedlastede kart
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default MainHamburgerMenu;
