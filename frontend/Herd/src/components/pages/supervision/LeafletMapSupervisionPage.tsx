import React, { useEffect, useState } from "react";

import { locationType, pathCoordinateType } from "../../../types";

import L, { Map, Marker, Polyline } from "leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet.offline";
import "leaflet-rotatedmarker";
import "leaflet/dist/leaflet.css";
import userPositionIconImg from "../../../assets/icons/GPSArrowIcon.png";
import crosshairIconImg from "../../../assets/icons/CrosshairIcon.png";

let userPositionIcon = L.icon({
  iconUrl: userPositionIconImg,
  iconAnchor: [80 / 2, 80 / 2],
  iconSize: new L.Point(80, 80),
});

let crosshairIcon = L.icon({
  iconUrl: crosshairIconImg,
  iconAnchor: [80 / 2, 80 / 2],
  iconSize: new L.Point(80, 80),
});

interface LeafletMapProps {
  latestLocation: locationType | undefined;
  crosshairLocation: pathCoordinateType | undefined;
  setCrosshairLocation: (location: pathCoordinateType) => void;
  pathCoordinates: pathCoordinateType[];
}

// This is a map component that's used to register observations. It shows the user's position as a marker
// on the map, as well as a "reticle" that can be moved to represent the location of the observed elements.
const LeafletMap: React.FC<LeafletMapProps> = ({
  latestLocation,
  crosshairLocation,
  setCrosshairLocation,
  pathCoordinates,
}) => {
  const [map, setMap] = useState<Map | undefined>();
  const [userPositionMarker, setUserPositionMarker] = useState<Marker<any>>();
  const [crosshairMarker, setCrosshairMarker] = useState<Marker<any>>();
  const [lineFromUserToCrosshair, setLineFromUserToCrosshair] =
    useState<Polyline<any>>();
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
        let newPolyline = L.polyline(polylinePoints, {
          weight: 6,
          stroke: true,
          color: "black",
        });
        setPathPolyline(newPolyline);

        newPolyline.addTo(map);
      }
    }
  }, [pathCoordinates]);

  // Creates marker for user position, and pans to user's position
  useEffect(() => {
    if (
      map &&
      latestLocation?.latitude &&
      latestLocation?.longitude &&
      latestLocation.bearing
    ) {
      updateLineFromUserToCrosshair();

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
          new L.LatLng(
            latestLocation.latitude + 0.0025,
            latestLocation.longitude
          ),
          15
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

      // Adds crosshair marker at center of screen
      if (!crosshairMarker) {
        const newCrosshairMarker = L.marker(map.getCenter(), {
          icon: crosshairIcon,
        });

        newCrosshairMarker.addTo(map);

        map.on("move", function (e) {
          if (map) {
            const mapSize = map.getSize();
            if (!mapSize["x"] || !mapSize["y"]) {
              map.invalidateSize();
            }
          }
          newCrosshairMarker.setLatLng(map.getCenter());
          setCrosshairLocation({
            latitude: map.getCenter().lat,
            longitude: map.getCenter().lng,
          });
        });

        setCrosshairMarker(newCrosshairMarker);
      }
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
        15
      );
    }
  }, [map]);

  useEffect(() => {
    updateLineFromUserToCrosshair();
  }, [crosshairLocation]);

  const updateLineFromUserToCrosshair = () => {
    if (userPositionMarker && crosshairMarker && map) {
      if (lineFromUserToCrosshair) {
        lineFromUserToCrosshair.setLatLngs([
          userPositionMarker.getLatLng(),
          crosshairMarker.getLatLng(),
        ]);
      } else {
        const polyline = L.polyline(
          [userPositionMarker.getLatLng(), crosshairMarker.getLatLng()],
          { color: "black", opacity: 0.7, dashArray: [10, 10] }
        );

        polyline.addTo(map);
        setLineFromUserToCrosshair(polyline);
      }
    }
  };

  return (
    <MapContainer
      style={{ width: "100%", height: "100%" }}
      center={[63.446827, 10.421906]}
      zoom={15}
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
