import { supervisionType } from "../../../types";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonModal,
  IonButton,
} from "@ionic/react";

import LeafletMap from "./LeafletMapInspectSupervision";

import "leaflet/dist/leaflet.css";

interface InspectSupervisionModalProps {
  supervision: supervisionType | null;
  setSupervision: (supervision: supervisionType | null) => void;
}

// This is a modal component for inspecting a single supervision; it mainly contains the leaflet map component
const InspectSupervisionModal: React.FC<InspectSupervisionModalProps> = ({
  supervision,
  setSupervision,
}) => {
  return (
    <IonModal isOpen={supervision !== null}>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Tilsynsturens observasjoner</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setSupervision(null);
              }}
            >
              Lukk
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {supervision !== null && <LeafletMap supervision={supervision} />}
      </IonContent>
    </IonModal>
  );
};

export default InspectSupervisionModal;
