import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { locationType } from "../../../types";
import { MapContainer } from "react-leaflet";
import L, { Map, Marker } from "leaflet";
import userPositionIconImg from "../../../assets/icons/GPSArrowIcon.png";
import "leaflet.offline";
import "leaflet-rotatedmarker";

let userPositionIcon = L.icon({
  iconUrl: userPositionIconImg,
  iconAnchor: [80 / 2, 80 / 2],
  iconSize: new L.Point(80, 80),
});

interface LeafletMapProps {
  latestLocation: locationType | undefined;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ latestLocation }) => {
  const [map, setMap] = useState<Map | undefined>();
  const [userPositionMarker, setUserPositionMarker] = useState<Marker<any>>();

  // Creates marker for user position, and pans to user's position
  useEffect(() => {
    if (
      map &&
      latestLocation?.latitude &&
      latestLocation?.longitude &&
      latestLocation.bearing
    ) {
      // Recalibrates the map size if the current height or width is 0
      const mapSize = map.getSize();
      if (!mapSize["x"] || !mapSize["y"]) {
        map.invalidateSize();
      }

      if (!userPositionMarker) {
        // Adds marker at user's location
        const newUserMarker = L.marker(
          [latestLocation.latitude, latestLocation.longitude],
          // @ts-ignore
          { icon: userPositionIcon, rotationAngle: latestLocation.bearing }
        );

        // @ts-ignore
        newUserMarker.setRotationOrigin("center center");
        map.addLayer(newUserMarker);
        setUserPositionMarker(newUserMarker);

        // Pans to user's location
        map.setView(
          new L.LatLng(latestLocation.latitude, latestLocation.longitude),
          13
        );
      } else {
        // @ts-ignore
        userPositionMarker.setRotationAngle(latestLocation.bearing);
        userPositionMarker.setLatLng([
          latestLocation.latitude,
          latestLocation.longitude,
        ]);
      }
    }
  }, [latestLocation]);

  // Initializes Leaflet map with tilelayer
  useEffect(() => {
    // Updates the device size dimensions known to the leaflet map; won't display correctly if this is not done
    setTimeout(() => {
      map?.invalidateSize();
    }, 250);

    // Uses a special tilelayer that supports use of offline/downloaded tiles
    if (map) {
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
    }

    if (
      !userPositionMarker &&
      map &&
      latestLocation?.latitude &&
      latestLocation?.longitude
    ) {
      // Pans to user's location
      map.setView(
        new L.LatLng(latestLocation.latitude, latestLocation.longitude),
        13
      );
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
