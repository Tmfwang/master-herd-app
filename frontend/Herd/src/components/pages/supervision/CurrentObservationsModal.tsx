import { locationType } from "../../../types";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonModal,
  IonButton,
} from "@ionic/react";

import LeafletMap from "./LeafletMapCurrentObservations";

import { fullObservationType, pathCoordinateType } from "../../../types";

import "leaflet/dist/leaflet.css";

interface CurrentObservationsModalProps {
  modalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  allObservations: fullObservationType[];
  pathCoordinates: pathCoordinateType[];
  latestLocation: locationType | undefined;
  removeObservation: (observationIndex: number) => void;
}

// This is a component containing a modal for inspecting all current observations made during the supervision
const CurrentObservationsModal: React.FC<CurrentObservationsModalProps> = ({
  modalOpen,
  setModalOpen,
  allObservations,
  pathCoordinates,
  latestLocation,
  removeObservation,
}) => {
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
          latestLocation={latestLocation}
          modalOpen={modalOpen}
          removeObservation={removeObservation}
        />
      </IonContent>
    </IonModal>
  );
};

export default CurrentObservationsModal;
