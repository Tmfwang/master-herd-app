import { useEffect, useState } from "react";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonModal,
  IonButton,
  IonicSwiper,
  useIonAlert,
} from "@ionic/react";

import LeafletMap from "./LeafletMapCurrentObservations";

import {
  observationDetailsType,
  fullObservationType,
  pathCoordinateType,
} from "../../../types";

import "leaflet/dist/leaflet.css";

interface CurrentObservationsModalProps {
  modalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  allObservations: fullObservationType[];
  pathCoordinates: pathCoordinateType[];
}

const CurrentObservationsModal: React.FC<CurrentObservationsModalProps> = ({
  modalOpen,
  setModalOpen,
  allObservations,
  pathCoordinates,
}) => {
  const [presentAlert] = useIonAlert();

  return (
    <IonModal isOpen={modalOpen}>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Tilsynsturens observasjoner</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Lukk
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <LeafletMap
          allObservations={allObservations}
          pathCoordinates={pathCoordinates}
        />
      </IonContent>
    </IonModal>
  );
};

export default CurrentObservationsModal;
