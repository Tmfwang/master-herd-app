import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";

import {
  locationType,
  pathCoordinateType,
  fullObservationType,
} from "../../../types";

import {
  IonButton,
  IonItemDivider,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  useIonAlert,
} from "@ionic/react";

import L, { Map, Polyline } from "leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet.offline";
import "leaflet-rotatedmarker";
import "leaflet/dist/leaflet.css";

// @ts-ignore
import binocularIconImg from "../../../assets/icons/BinocularIcon.png";
// @ts-ignore
import gruppeSauIconImg from "../../../assets/icons/GruppeSauIcon.png";
// @ts-ignore
import soyeIconImg from "../../../assets/icons/SoyeIcon.png";
// @ts-ignore
import lamIconImg from "../../../assets/icons/LamIcon.png";
// @ts-ignore
import rovdyrIconImg from "../../../assets/icons/RovdyrIcon.png";
// @ts-ignore
import skadetSauIconImg from "../../../assets/icons/SkadetSauIcon.png";
// @ts-ignore
import dodSauIconImg from "../../../assets/icons/DodSauIcon.png";

const allObservationTypes = {
  gruppeSau: "gruppeSau",
  rovdyr: "rovdyr",
  skadetSau: "skadetSau",
  dodSau: "dodSau",
};

const allOwnerColorTypes = {
  rod: "rod",
  bla: "bla",
  gul: "gul",
  gronn: "gronn",
  sort: "sort",
  ikkeSpesifisert: "ikkeSpesifisert",
};

const allPredatorTypes = {
  jerv: "jerv",
  gaupe: "gaupe",
  bjorn: "bjorn",
  ulv: "ulv",
  orn: "orn",
  annet: "annet",
};

const allSheepDamageTypes = {
  halter: "halter",
  blor: "blor",
  hodeskade: "hodeskade",
  kroppskade: "kroppskade",
  annet: "annet",
};

const allSheepCausesOfDeathTypes = {
  sykdom: "sykdom",
  rovdyr: "rovdyr",
  fallulykke: "fallulykke",
  drukningsulykke: "drukningsulykke",
  annet: "annet",
};

const allSheepColorTypes = {
  hvitOrGra: "hvitOrGra",
  brun: "brun",
  sort: "sort",
  ikkeSpesifisert: "ikkeSpesifisert",
};

let binocularIcon = L.icon({
  iconUrl: binocularIconImg,
  iconAnchor: [45 / 2, 45 / 2],
  iconSize: new L.Point(45, 45),
});

let observationIcons = {
  gruppeSau: L.icon({
    iconUrl: gruppeSauIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  soye: L.icon({
    iconUrl: soyeIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  lam: L.icon({
    iconUrl: lamIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  rovdyr: L.icon({
    iconUrl: rovdyrIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  skadetSau: L.icon({
    iconUrl: skadetSauIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  dodSau: L.icon({
    iconUrl: dodSauIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
};

type markerPair = {
  userMarker: any;
  observationMarker: any;
  lineBetweenMarkers: any;
};

interface LeafletMapProps {
  allObservations: fullObservationType[];
  pathCoordinates: pathCoordinateType[];
  latestLocation: locationType | undefined;
  modalOpen: boolean;
  removeObservation: (observationIndex: number) => void;
}

// This is the leaflet map component for inspecting the observations for the current supervision.
// It draws the recorded path on the map, as well as all observations made during the supervision.
// The observation markers can be clicked to reveal more information about it in a popup.
const LeafletMap: React.FC<LeafletMapProps> = ({
  allObservations,
  pathCoordinates,
  latestLocation,
  modalOpen,
  removeObservation,
}) => {
  const [presentAlert] = useIonAlert();

  const [map, setMap] = useState<Map | undefined>();

  const [observationMarkerPairs, setObservationMarkerPairs] = useState<
    markerPair[]
  >([] as markerPair[]);

  const [pathPolyline, setPathPolyline] = useState<Polyline<any>>();

  // Fits the map to the observation markers and walked path
  useEffect(() => {
    const objectsToFit = [];

    if (map) {
      setTimeout(map.invalidateSize, 250);

      for (let markerPair of observationMarkerPairs) {
        objectsToFit.push(markerPair.userMarker);
        objectsToFit.push(markerPair.observationMarker);
      }

      if (pathPolyline) {
        objectsToFit.push(pathPolyline);
      }

      if (objectsToFit.length > 0) {
        let groupToFit = L.featureGroup(objectsToFit);

        map.fitBounds(groupToFit.getBounds());
      } else if (
        latestLocation &&
        latestLocation.latitude &&
        latestLocation.longitude
      ) {
        // Pans to user's location
        map.setView(
          new L.LatLng(latestLocation.latitude, latestLocation.longitude),
          15
        );
      }
    }
  }, [observationMarkerPairs, map, modalOpen]);

  // Draws the path that the user has walked
  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length >= 2) {
      let polylinePoints = pathCoordinates.map((coordinate) =>
        L.latLng(coordinate.latitude, coordinate.longitude)
      );

      if (pathPolyline) {
        pathPolyline.setLatLngs(polylinePoints);
      } else if (map) {
        let newPolyline = L.polyline(polylinePoints, {
          weight: 6,
          stroke: true,
          color: "black",
        });
        setPathPolyline(newPolyline);

        newPolyline.addTo(map);
      }
    }
  }, [pathCoordinates, map]);

  useEffect(() => {
    removeAllMarkers();
    addAllMarkers();

    if (map) {
      const mapSize = map.getSize();
      if (!mapSize["x"] || !mapSize["y"]) {
        map.invalidateSize();
      }
    }
  }, [allObservations, map]);

  const removeAllMarkers = () => {
    if (map) {
      for (let markerPair of observationMarkerPairs) {
        markerPair.userMarker.removeFrom(map);
        markerPair.observationMarker.removeFrom(map);
        markerPair.lineBetweenMarkers.removeFrom(map);
      }

      setObservationMarkerPairs([]);
    }
  };

  const addAllMarkers = () => {
    if (map) {
      let allNewMarkers = [] as markerPair[];

      for (let i = 0; i < allObservations.length; i++) {
        let observation = allObservations[i];

        if (
          observation.userLocation.latitude &&
          observation.userLocation.longitude &&
          observation.observationLocation.latitude &&
          observation.observationLocation.longitude
        ) {
          // @ts-ignore
          let userMarker = new L.marker(
            L.latLng(
              observation.userLocation.latitude,
              observation.userLocation.longitude
            ),
            { icon: binocularIcon }
          );

          // @ts-ignore
          let observationMarker = new L.marker(
            L.latLng(
              observation.observationLocation.latitude,
              observation.observationLocation.longitude
            ),
            {
              // @ts-ignore
              icon: observationIcons[
                observation.observationDetails.alle.typeObservasjon
              ],
            }
          );

          let lineBetweenMarkers = L.polyline(
            [userMarker.getLatLng(), observationMarker.getLatLng()],
            { weight: 4, color: "black", opacity: 0.5, dashArray: [10, 10] }
          );

          // Add a popup to the marker and listeners on popup open and close,
          // which them themselves add listeners to clicks on the button inside the popup
          observationMarker
            .addEventListener("popupopen", () => addPopupListener(i))
            .addEventListener("popupclose", () => removePopupListener(i))
            .bindPopup(generatePopupHtmlString(i), {
              closeButton: false,
            });

          userMarker
            .addEventListener("popupopen", () => addPopupListener(i))
            .addEventListener("popupclose", () => removePopupListener(i))
            .bindPopup(generatePopupHtmlString(i), {
              closeButton: false,
            });

          userMarker.addTo(map);
          observationMarker.addTo(map);
          lineBetweenMarkers.addTo(map);

          allNewMarkers.push({
            userMarker: userMarker,
            observationMarker: observationMarker,
            lineBetweenMarkers: lineBetweenMarkers,
          });
        }
      }

      setObservationMarkerPairs(allNewMarkers);
    }
  };

  // Adds click listener to the delete button in the popup, and scroll listener to the div
  const addPopupListener = (observationIndex: number) => {
    const buttonEl = L.DomUtil.get(
      "popup-delete-button-observation=" + observationIndex
    );

    if (buttonEl) {
      buttonEl.addEventListener("click", () =>
        handleObservationDelete(observationIndex)
      );
    }
  };

  const removePopupListener = (observationIndex: number) => {
    const buttonEl = L.DomUtil.get(
      "popup-delete-button-observation=" + observationIndex
    );

    if (buttonEl) {
      buttonEl.removeEventListener("click", () =>
        handleObservationDelete(observationIndex)
      );
    }
  };

  const handleObservationDelete = (observationIndex: number) => {
    presentAlert({
      header: "Slette observasjonen?",
      message:
        "Ønsker du å slette denne observasjonen? Denne handlingen kan ikke angres.",
      buttons: [
        "Avbryt",
        {
          text: "Slett",
          handler: (d) => {
            removeObservation(observationIndex);
          },
        },
      ],
    });
  };

  const calculateTotalSheep = (sheepType: string, observationIndex: number) => {
    let observation = allObservations[observationIndex];

    return (
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["hvitOrGra"] +
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["brun"] +
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["sort"]
    );
  };

  const generatePopupHtmlString = (observationIndex: number) => {
    let observation = allObservations[observationIndex];
    let dateRegistered = new Date(
      observation.whenRegisteredDateTime
    ).toLocaleTimeString("no-no");

    switch (observation["observationDetails"]["alle"]["typeObservasjon"]) {
      case allObservationTypes.gruppeSau:
        return ReactDOMServer.renderToString(
          <div
            style={{
              width: "210px",
              height: "330px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ height: "270px", overflowY: "auto" }}>
              <div
                style={{
                  position: "fixed",
                  width: "210px",
                  height: "40px",
                  bottom: "70px",
                  zIndex: 9999,
                  background:
                    "linear-gradient(to bottom,  rgba(255, 255, 255, 0),  rgba(255, 255, 255, 1) 100%)",
                }}
              ></div>
              <IonList>
                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Type observasjon</IonLabel>
                  </IonItemDivider>
                  <IonItem>
                    <IonLabel>Gruppe sau</IonLabel>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Når registrert</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>{dateRegistered}</IonLabel>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Antall</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>Generelle sau</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {calculateTotalSheep("fargePaSau", observationIndex)}
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Søyer</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {calculateTotalSheep("fargePaSoye", observationIndex)}
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Lam</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {calculateTotalSheep("fargePaLam", observationIndex)}
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>
                      <i>Sau totalt</i>
                    </IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      <i>
                        {calculateTotalSheep("fargePaSau", observationIndex) +
                          calculateTotalSheep("fargePaSoye", observationIndex) +
                          calculateTotalSheep("fargePaLam", observationIndex)}
                      </i>
                    </IonNote>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Farge på generell sau</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>Hvite/grå</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaSau"
                        ]["hvitOrGra"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Brune</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaSau"
                        ]["brun"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Sorte</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaSau"
                        ]["sort"]
                      }
                    </IonNote>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Farge på søyer</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>Hvite/grå</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaSoye"
                        ]["hvitOrGra"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Brune</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaSoye"
                        ]["brun"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Sorte</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaSoye"
                        ]["sort"]
                      }
                    </IonNote>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Farge på lam</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>Hvite/grå</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaLam"
                        ]["hvitOrGra"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Brune</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaLam"
                        ]["brun"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Sorte</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaLam"
                        ]["sort"]
                      }
                    </IonNote>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Farge på bjelleslipsene</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>Røde</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaBjelleslips"
                        ]["rod"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Blåe</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaBjelleslips"
                        ]["bla"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Gule/blanke</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaBjelleslips"
                        ]["gulOrIngen"]
                      }
                    </IonNote>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Grønne</IonLabel>
                    <IonNote slot="end" style={{ fontSize: "16px" }}>
                      {
                        observation["observationDetails"]["gruppeSau"][
                          "fargePaBjelleslips"
                        ]["gronn"]
                      }
                    </IonNote>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Observerte eiermerker</IonLabel>
                  </IonItemDivider>

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.rod) && (
                    <IonItem>
                      <IonLabel>Rødt</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.bla) && (
                    <IonItem>
                      <IonLabel>Blått</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.gul) && (
                    <IonItem>
                      <IonLabel>Gult</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.gronn) && (
                    <IonItem>
                      <IonLabel>Grønt</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.sort) && (
                    <IonItem>
                      <IonLabel>Sort</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].length === 0 && (
                    <IonItem>
                      <IonLabel>Ingen observert</IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>
              </IonList>
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IonButton
                id={"popup-delete-button-observation=" + observationIndex}
                color="danger"
              >
                Slett observasjon
              </IonButton>
            </div>
          </div>
        );

      case allObservationTypes.rovdyr:
        return ReactDOMServer.renderToString(
          <div
            style={{
              width: "200px",
              height: "330px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div>
              <IonList>
                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Type observasjon</IonLabel>
                  </IonItemDivider>
                  <IonItem>
                    <IonLabel>Rovdyr</IonLabel>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Når registrert</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>{dateRegistered}</IonLabel>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Type rovdyr</IonLabel>
                  </IonItemDivider>

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.jerv && (
                    <IonItem>
                      <IonLabel>Jerv</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.gaupe && (
                    <IonItem>
                      <IonLabel>Gaupe</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.bjorn && (
                    <IonItem>
                      <IonLabel>Bjørn</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.ulv && (
                    <IonItem>
                      <IonLabel>Ulv</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.orn && (
                    <IonItem>
                      <IonLabel>Ørn</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.annet && (
                    <IonItem>
                      <IonLabel>Annet</IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>
              </IonList>
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IonButton
                id={"popup-delete-button-observation=" + observationIndex}
                color="danger"
              >
                Slett observasjon
              </IonButton>
            </div>
          </div>
        );

      case allObservationTypes.skadetSau:
        return ReactDOMServer.renderToString(
          <div
            style={{
              width: "200px",
              height: "330px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ height: "270px", overflowY: "auto" }}>
              <div
                style={{
                  position: "fixed",
                  width: "200px",
                  height: "40px",
                  bottom: "70px",
                  zIndex: 9999,
                  background:
                    "linear-gradient(to bottom,  rgba(255, 255, 255, 0),  rgba(255, 255, 255, 1) 100%)",
                }}
              ></div>
              <IonList>
                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Type observasjon</IonLabel>
                  </IonItemDivider>
                  <IonItem>
                    <IonLabel>Skadet sau</IonLabel>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Når registrert</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>{dateRegistered}</IonLabel>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Type skade</IonLabel>
                  </IonItemDivider>

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.halter && (
                    <IonItem>
                      <IonLabel>Halter</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.blor && (
                    <IonItem>
                      <IonLabel>Blør</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.hodeskade && (
                    <IonItem>
                      <IonLabel>Skade på hodet</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.kroppskade && (
                    <IonItem>
                      <IonLabel>Skade på kropp</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.annet && (
                    <IonItem>
                      <IonLabel>Annen type skade</IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Farge på sauen</IonLabel>
                  </IonItemDivider>

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaSau"
                  ] === allSheepColorTypes.hvitOrGra && (
                    <IonItem>
                      <IonLabel>Hvit/grå</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaSau"
                  ] === allSheepColorTypes.brun && (
                    <IonItem>
                      <IonLabel>Brun</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaSau"
                  ] === allSheepColorTypes.sort && (
                    <IonItem>
                      <IonLabel>Sort</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaSau"
                  ] === allSheepColorTypes.ikkeSpesifisert && (
                    <IonItem>
                      <IonLabel>Ikke spesifisert</IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Farge på eiermerket</IonLabel>
                  </IonItemDivider>

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.rod && (
                    <IonItem>
                      <IonLabel>Rødt</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.bla && (
                    <IonItem>
                      <IonLabel>Blått</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.gul && (
                    <IonItem>
                      <IonLabel>Gult</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.gronn && (
                    <IonItem>
                      <IonLabel>Grønt</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.sort && (
                    <IonItem>
                      <IonLabel>Sort</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.ikkeSpesifisert && (
                    <IonItem>
                      <IonLabel>Ikke spesifisert</IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>
              </IonList>
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IonButton
                id={"popup-delete-button-observation=" + observationIndex}
                color="danger"
              >
                Slett observasjon
              </IonButton>
            </div>
          </div>
        );

      case allObservationTypes.dodSau:
        return ReactDOMServer.renderToString(
          <div
            style={{
              width: "200px",
              height: "330px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ height: "270px", overflowY: "auto" }}>
              <div
                style={{
                  position: "fixed",
                  width: "200px",
                  height: "40px",
                  bottom: "70px",
                  zIndex: 9999,
                  background:
                    "linear-gradient(to bottom,  rgba(255, 255, 255, 0),  rgba(255, 255, 255, 1) 100%)",
                }}
              ></div>
              <IonList>
                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Type observasjon</IonLabel>
                  </IonItemDivider>
                  <IonItem>
                    <IonLabel>Død sau</IonLabel>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Når registrert</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel>{dateRegistered}</IonLabel>
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Dødsårsak</IonLabel>
                  </IonItemDivider>

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.sykdom && (
                    <IonItem>
                      <IonLabel>Sykdom</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.rovdyr && (
                    <IonItem>
                      <IonLabel>Rovdyr</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.fallulykke && (
                    <IonItem>
                      <IonLabel>Fallulykke</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.drukningsulykke && (
                    <IonItem>
                      <IonLabel>Drukningsulykke</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.annet && (
                    <IonItem>
                      <IonLabel>Annet</IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Farge på sauen</IonLabel>
                  </IonItemDivider>

                  {observation["observationDetails"]["dodSau"]["fargePaSau"] ===
                    allSheepColorTypes.hvitOrGra && (
                    <IonItem>
                      <IonLabel>Hvit/grå</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["fargePaSau"] ===
                    allSheepColorTypes.brun && (
                    <IonItem>
                      <IonLabel>Brun</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["fargePaSau"] ===
                    allSheepColorTypes.sort && (
                    <IonItem>
                      <IonLabel>Sort</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["fargePaSau"] ===
                    allSheepColorTypes.ikkeSpesifisert && (
                    <IonItem>
                      <IonLabel>Ikke spesifisert</IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider>
                    <IonLabel>Farge på eiermerket</IonLabel>
                  </IonItemDivider>

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.rod && (
                    <IonItem>
                      <IonLabel>Rødt</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.bla && (
                    <IonItem>
                      <IonLabel>Blått</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.gul && (
                    <IonItem>
                      <IonLabel>Gult</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.gronn && (
                    <IonItem>
                      <IonLabel>Grønt</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.sort && (
                    <IonItem>
                      <IonLabel>Sort</IonLabel>
                    </IonItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.ikkeSpesifisert && (
                    <IonItem>
                      <IonLabel>Ikke spesifisert</IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>
              </IonList>
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IonButton
                id={"popup-delete-button-observation=" + observationIndex}
                color="danger"
              >
                Slett observasjon
              </IonButton>
            </div>
          </div>
        );

      default:
        return "Noe gikk galt";
    }
  };

  // Initializes Leaflet map with tilelayer
  useEffect(() => {
    // Updates the device size dimensions known to the leaflet map; won't display correctly if this is not done
    setTimeout(() => {
      map?.invalidateSize();
    }, 250);

    if (map) {
      // Uses a special tilelayer that supports use of offline/downloaded tiles
      //@ts-ignore
      const tileLayerOffline = L.tileLayer.offline(
        "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}",
        {
          attribution: '<a href="http://www.kartverket.no/">Kartverket</a>',
          minZoom: 12,
          maxZoom: 15,
        }
      );
      tileLayerOffline.addTo(map);

      map.on("move", function (e) {
        if (map) {
          const mapSize = map.getSize();
          if (!mapSize["x"] || !mapSize["y"]) {
            map.invalidateSize();
          }
        }
      });
    }
  }, [map]);

  return (
    <MapContainer
      style={{ width: "100%", height: "100%" }}
      center={[63.446827, 10.421906]}
      zoom={13}
      scrollWheelZoom={false}
      whenCreated={(newMap) => {
        newMap.invalidateSize();
        setMap(newMap);
      }}
      zoomControl={false}
    ></MapContainer>
  );
};

export default LeafletMap;
