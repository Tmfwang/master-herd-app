import React from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  useIonAlert,
  useIonToast,
} from "@ionic/react";

import { checkmarkOutline, closeOutline, locateOutline } from "ionicons/icons";

import { menuController } from "@ionic/core";

interface SupervisionHamburgerMenuProps {
  finishSupervision: () => void;
  cancelSupervision: () => void;
  seeCurrentObservations: () => void;
}

// This is the hamburger/side menu specific for when on the supervision page
const SupervisionHamburgerMenu: React.FC<SupervisionHamburgerMenuProps> = ({
  finishSupervision,
  cancelSupervision,
  seeCurrentObservations,
}) => {
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const handleCurrentObservations = () => {
    menuController.toggle();
    seeCurrentObservations();
  };

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
          <IonItem button onClick={finishSupervision}>
            <IonIcon slot="start" icon={checkmarkOutline}></IonIcon>
            <IonLabel>Fullfør tilsynstur</IonLabel>
          </IonItem>
          <IonItem button onClick={cancelSupervision}>
            <IonIcon slot="start" icon={closeOutline}></IonIcon>
            <IonLabel>Avbryt tilsynstur</IonLabel>
          </IonItem>
          <IonItem button onClick={handleCurrentObservations}>
            <IonIcon slot="start" icon={locateOutline}></IonIcon>
            <IonLabel>Turens observasjoner</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SupervisionHamburgerMenu;
