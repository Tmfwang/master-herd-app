import { useEffect, useState } from "react";

import { Storage } from "@capacitor/storage";

import { useHistory } from "react-router-dom";

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
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { locateOutline } from "ionicons/icons";

import CurrentObservationsModal from "./CurrentObservationsModal";
import SupervisionHamburgerMenu from "./SupervisionHamburgerMenu";
import BottomCenterButton from "../../shared/BottomCenterButton";
import SupervisionModal from "./SupervisionModal";

import GeolocatorForeground from "../../geolocators/GeolocatorForeground";
import GeolocatorPathTracking from "../../geolocators/Geolocator";
import LeafletMap from "./LeafletMapSupervisionPage";

import {
  locationType,
  pathCoordinateType,
  observationDetailsType,
  fullObservationType,
  supervisionType,
} from "../../../types";

import "leaflet/dist/leaflet.css";
import "./SupervisionPage.css";

interface SupervisionPageProps {}

// The main component for the supervision page
const SupervisionPage: React.FC<SupervisionPageProps> = () => {
  let history = useHistory();

  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const [newObservationModalOpen, setNewObservationModalOpen] =
    useState<boolean>(false);
  const [currentObservationsModalOpen, setCurrentObservationsModalOpen] =
    useState<boolean>(false);

  const [whenStarted, setWhenStarted] = useState<string>("");

  const [allObservations, setAllObservations] = useState<fullObservationType[]>(
    []
  );

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

  useIonViewDidEnter(() => {
    setWhenStarted(new Date().toISOString());

    presentToast({
      header: "Tilsynstur påbegynt",
      message:
        "Du kan nå bruke kartet til å registrere ulike observasjoner under denne tilsynsturen. Du kan fullføre eller avbryte tilsynsturen via sidemenyen.",
      duration: 8000,
    });
  });

  useIonViewWillLeave(() => {
    setAllObservations([]);
    setWhenStarted("");
    setLatestPathLocation(undefined);
    setLatestBearingLocation(undefined);
    setPathCoordinates([]);
  });

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

  const removeObservation = (observationIndex: number) => {
    if (observationIndex < allObservations.length) {
      let newAllObservations = [...allObservations];
      newAllObservations.splice(observationIndex, 1);

      setAllObservations(newAllObservations);
    }
  };

  const saveObservation = (observationDetails: observationDetailsType) => {
    let newObservation: fullObservationType = {
      observationDetails: observationDetails,
      observationLocation: {
        latitude: crosshairLocation!.latitude,
        longitude: crosshairLocation!.longitude,
      },
      userLocation: {
        latitude: latestPathLocation!.latitude!,
        longitude: latestPathLocation!.longitude!,
      },
      whenRegisteredDateTime: new Date().toISOString(),
    };

    let newAllObservations = [...allObservations, newObservation];
    setAllObservations(newAllObservations);

    presentToast({
      header: "Observasjonen ble registrert",
      duration: 4000,
    });
  };

  const saveAndEndSupervision = async () => {
    presentAlert({
      header: "Fullfør tilsynstur?",
      message:
        "Ønsker du å fullføre og lagre denne tilsynsturen? Du har registrert " +
        allObservations.length +
        (allObservations.length === 1 ? " observasjon" : " observasjoner") +
        " under denne tilsynsturen.",
      buttons: [
        "Nei",
        {
          text: "Ja",
          handler: (d) => {
            saveSupervision();
          },
        },
      ],
    });

    const saveSupervision = async () => {
      let allSupervisions = [] as supervisionType[];

      let value;
      await Storage.get({
        key: "allSupervisions",
      })
        .then((readValue) => (value = readValue.value))
        .catch(() => {});

      if (value) {
        try {
          allSupervisions = JSON.parse(value);
        } catch (err) {}
      }

      allSupervisions.push({
        id: "",
        allObservations: allObservations,
        fullPath: pathCoordinates,
        whenStarted: whenStarted,
        whenEnded: new Date().toISOString(),
      });

      await Storage.set({
        key: "allSupervisions",
        value: JSON.stringify(allSupervisions),
      });

      presentToast({
        header: "Tilsynstur fullført",
        message: "Tilsynsturen ble fullført og lagret.",
        duration: 5000,
      });

      history.push("/");
    };
  };

  const cancelSupervision = () => {
    presentAlert({
      header: "Avbryt tilsynstur?",
      message:
        "Ønsker du å avbryte denne tilsynsturen?" +
        (allObservations.length > 0
          ? " Du vil miste " +
            (allObservations.length === 1
              ? "den éne observasjonen"
              : "de " + allObservations.length + " observasjonene") +
            " du har registrert."
          : ""),
      buttons: [
        "Nei",
        {
          text: "Ja",
          handler: (d) => {
            presentToast({
              header: "Tilsynstur avbrutt",
              message:
                "Tilsynsturen ble avbrutt og eventuelle observasjoner som ble gjort under tilsynsturen har blitt fjernet.",
              duration: 7000,
            });
            history.push("/");
          },
        },
      ],
    });
  };

  return (
    <>
      <SupervisionHamburgerMenu
        finishSupervision={() => saveAndEndSupervision()}
        cancelSupervision={() => cancelSupervision()}
        seeCurrentObservations={() => setCurrentObservationsModalOpen(true)}
      />

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
            pathCoordinates={pathCoordinates}
          ></LeafletMap>

          <BottomCenterButton
            buttonText="Ny observasjon"
            buttonIcon={locateOutline}
            buttonIconSlotPosition="start"
            onClick={() => setNewObservationModalOpen(true)}
          />

          <SupervisionModal
            modalOpen={newObservationModalOpen}
            setModalOpen={setNewObservationModalOpen}
            saveObservation={saveObservation}
          ></SupervisionModal>

          <CurrentObservationsModal
            modalOpen={currentObservationsModalOpen}
            setModalOpen={setCurrentObservationsModalOpen}
            allObservations={allObservations}
            pathCoordinates={pathCoordinates}
            latestLocation={latestBearingLocation}
            removeObservation={removeObservation}
          ></CurrentObservationsModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default SupervisionPage;
