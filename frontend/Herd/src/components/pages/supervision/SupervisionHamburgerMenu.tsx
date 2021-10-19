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

import { menuController } from "@ionic/core";

interface SupervisionHamburgerMenuProps {
  finishSupervision: () => void;
  cancelSupervision: () => void;
  seeCurrentObservations: () => void;
}

const SupervisionHamburgerMenu: React.FC<SupervisionHamburgerMenuProps> = ({
  finishSupervision,
  cancelSupervision,
  seeCurrentObservations,
}) => {
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();


  const handleCurrentObservations = () => {
    menuController.toggle()
    seeCurrentObservations()
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
          <IonItem button onClick={finishSupervision}>
            Fullfør tilsynstur
          </IonItem>
          <IonItem button onClick={cancelSupervision}>
            Avbryt tilsynstur
          </IonItem>
          <IonItem button onClick={handleCurrentObservations}>
            Tilsynsturens observasjoner
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SupervisionHamburgerMenu;
