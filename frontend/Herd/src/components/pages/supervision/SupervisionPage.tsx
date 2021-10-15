import { useEffect, useState } from "react";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { locateOutline } from "ionicons/icons";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";
import BottomCenterButton from "../../shared/BottomCenterButton";
import SupervisionModal from "./SupervisionModal";

import GeolocatorForeground from "../../geolocators/GeolocatorForeground";
import GeolocatorPathTracking from "../../geolocators/Geolocator";
import LeafletMap from "./LeafletMapSupervisionPage";

import { locationType, pathCoordinateType } from "../../../types";

import "leaflet/dist/leaflet.css";
import "./SupervisionPage.css";

interface SupervisionPageProps {}

const SupervisionPage: React.FC<SupervisionPageProps> = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [crosshairLocation, setCrosshairLocation] =
    useState<pathCoordinateType>();

  const [latestBearingLocation, setLatestBearingLocation] = useState<
    locationType | undefined
  >();

  const [latestPathLocation, setLatestPathLocation] = useState<
    locationType | undefined
  >();

  const [pathCoordinates, setPathCoordinates] = useState<pathCoordinateType[]>(
    [] as pathCoordinateType[]
  );

  // Legger nye path-koordinater til i listen
  useEffect(() => {
    if (
      latestPathLocation &&
      latestPathLocation.longitude &&
      latestPathLocation.latitude
    ) {
      setPathCoordinates([
        ...pathCoordinates,
        {
          longitude: latestPathLocation.longitude,
          latitude: latestPathLocation.latitude,
        },
      ]);
    }
  }, [latestPathLocation]);

  return (
    <>
      <MainHamburgerMenu />

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
            latestLocationUpdateCallback={setLatestBearingLocation}
          />
          <GeolocatorPathTracking
            latestLocationUpdateCallback={setLatestPathLocation}
          />

          <LeafletMap
            latestLocation={latestBearingLocation}
            crosshairLocation={crosshairLocation}
            setCrosshairLocation={setCrosshairLocation}
          ></LeafletMap>

          <BottomCenterButton
            buttonText="Ny observasjon"
            buttonIcon={locateOutline}
            buttonIconSlotPosition="start"
            onClick={() => setModalOpen(true)}
          />

          <SupervisionModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            observationLocation={crosshairLocation}
            userLocation={
              pathCoordinates.length > 0 ? pathCoordinates[pathCoordinates.length-1] : undefined
            }
          ></SupervisionModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default SupervisionPage;
