import React, { useEffect, useRef, useState } from "react";

import {
  locationType,
  pathCoordinateType,
  fullObservationType,
} from "../../../types";

import L, { Map, Polyline } from "leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet.offline";
import "leaflet-rotatedmarker";
import "leaflet/dist/leaflet.css";

import binocularIconImg from "../../../assets/icons/BinocularIcon.png";
import gruppeSauIconImg from "../../../assets/icons/GruppeSauIcon.png";
import soyeIconImg from "../../../assets/icons/SoyeIcon.png";
import lamIconImg from "../../../assets/icons/LamIcon.png";
import rovdyrIconImg from "../../../assets/icons/RovdyrIcon.png";
import skadetSauIconImg from "../../../assets/icons/SkadetSauIcon.png";
import dodSauIconImg from "../../../assets/icons/DodSauIcon.png";

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
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  allObservations,
  pathCoordinates,
}) => {
  const [map, setMap] = useState<Map | undefined>();

  const [observationMarkerPairs, setObservationMarkerPairs] = useState<
    markerPair[]
  >([] as markerPair[]);

  const [pathPolyline, setPathPolyline] = useState<Polyline<any>>();

  // Draws the path that the user has walked
  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length >= 2) {
      let polylinePoints = pathCoordinates.map((coordinate) =>
        L.latLng(coordinate.latitude, coordinate.longitude)
      );

      if (pathPolyline) {
        pathPolyline.setLatLngs(polylinePoints);
      } else if (map) {
        let newPolyline = L.polyline(polylinePoints, { weight: 6 });
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

      for (let observation of allObservations) {
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
            { weight: 4, color: "black" }
          );

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
    ></MapContainer>
  );
};

export default LeafletMap;
