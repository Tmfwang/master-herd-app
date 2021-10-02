import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { Map } from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { IonButton } from "@ionic/react";

import { generateOfflineTilelayer } from "../leaflet/leaflet.offline/TileLayerOffline";
import { generateControlSavetiles } from "../leaflet/leaflet.offline/ControlSaveTiles";
import { truncate } from "../leaflet/leaflet.offline/TileManager";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {}

const LeafletMap: React.FC<LeafletMapProps> = () => {
  const [map, setMap] = useState<Map | undefined>();

  useEffect(() => {
    setTimeout(() => {
      map?.invalidateSize();
    }, 250);
  }, [map]);

  const refreshMap = () => {
    map?.invalidateSize();

    const tileLayerOffline = generateOfflineTilelayer(
      "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}",
      {
        attribution: '<a href="http://www.kartverket.no/">Kartverket</a>',
        minZoom: 11,
      }
    );

    tileLayerOffline.addTo(map);

    const controlSaveTiles = generateControlSavetiles(tileLayerOffline, {
      zoomlevels: [13, 14, 15, 16], // optional zoomlevels to save, default current zoomlevel
    });

    controlSaveTiles.addTo(map!);

    const marker = L.marker([63.446827, 10.421906], { draggable: true });

    map!.addLayer(marker);
  };

  return (
    <div>
      <h1>YO</h1>
      <MapContainer
        style={{ width: "100vw", height: "20vh" }}
        center={[63.446827, 10.421906]}
        zoom={13}
        scrollWheelZoom={false}
        whenCreated={setMap}
        rotate={true}
      >
        {/* <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <IonButton onClick={refreshMap}></IonButton>
    </div>
  );
};

export default LeafletMap;
