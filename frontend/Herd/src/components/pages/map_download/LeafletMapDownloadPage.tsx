import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { locationType } from "../../../types";
import { MapContainer } from "react-leaflet";
import L, { Map, Marker } from "leaflet";
import userPositionIconImg from "../../../assets/GPSArrowIcon.png";
import "leaflet.offline";
import "leaflet-rotatedmarker";
import {
  IonButton,
  IonIcon,
  IonLoading,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { downloadOutline } from "ionicons/icons";

// @ts-ignore
import { getTileUrls } from "leaflet.offline";

// @ts-ignore
import { downloadTile, saveTile } from "leaflet.offline/src/TileManager";

let userPositionIcon = L.icon({
  iconUrl: userPositionIconImg,
  iconAnchor: [50 / 2, 50 / 2],
  iconSize: new L.Point(50, 50),
});

interface LeafletMapProps {
  latestLocation: locationType | undefined;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ latestLocation }) => {
  const [map, setMap] = useState<Map | undefined>();
  const [tileLayer, setTileLayer] = useState<any>();
  const [userPositionMarker, setUserPositionMarker] = useState<Marker<any>>();

  const totalTilesRef = useRef<number>(0);
  const tilesDownloadedRef = useRef<number>(0);
  const [tileProgressOpen, setTileProgressOpen] = useState<boolean>(false);
  const loaderRef = useRef<HTMLIonLoadingElement>(null);

  const [downloadFailed, setDownloadFailed] = useState<boolean>(false);

  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

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
    }, 100);

    // Uses a special tilelayer that supports use of offline/downloaded tiles
    if (map) {
      //@ts-ignore
      const tileLayerOffline = L.tileLayer.offline(
        "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}",
        {
          attribution: '<a href="http://www.kartverket.no/">Kartverket</a>',
          minZoom: 11,
          maxZoom: 15,
        }
      );
      tileLayerOffline.addTo(map);
      setTileLayer(tileLayerOffline);
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

  // Gives an error message to the user if map downloading failed
  useEffect(() => {
    if (downloadFailed) {
      tilesDownloadedRef.current = 0;
      totalTilesRef.current = 0;
      presentToast({
        header: "Noe gikk galt",
        message: "Sjekk at du har tilgang til internett, og prøv igjen",
        duration: 5000,
      });

      setTileProgressOpen(false);
      setDownloadFailed(false);
    }
  }, [downloadFailed]);

  // Runs when the download map button is clicked. Here is where the map tiles are downloaded.
  const handleDownloadMapButtonClicked = () => {
    if (map && tileLayer) {
      const minZoomlevel = 11;
      const maxZoomLevel = 15;
      const latlngBounds = map.getBounds();
      let tiles = [] as any[];
      let bounds;

      for (
        let zoomlevel = minZoomlevel;
        zoomlevel <= maxZoomLevel;
        zoomlevel += 1
      ) {
        bounds = L.bounds(
          map.project(latlngBounds.getNorthWest(), zoomlevel),
          map.project(latlngBounds.getSouthEast(), zoomlevel)
        );
        tiles = tiles.concat(getTileUrls(tileLayer, bounds, zoomlevel));
      }

      // Asks user for confirmation of tile download
      presentAlert({
        header: "Start nedlasting?",
        message:
          "Ønsker du å laste ned de " +
          tiles.length +
          ' kartrutene som utgjør kartområdet på skjermen? Disse kan når som helst slettes ved å trykke på "Slett nedlastede kart" fra alternativene i sidemenyen. Du kan teste ut det nedlastede kartutsnittet ved å skru av internett på mobilen din.',
        buttons: [
          "Avbryt",
          {
            text: "Last ned",
            handler: (d) => {
              totalTilesRef.current = tiles.length;
              tilesDownloadedRef.current = 0;
              setTileProgressOpen(true);
              downloadAllTiles(tiles);
            },
          },
        ],
      });
    }
  };

  async function downloadAllTiles(tiles: any) {
    await Promise.all(
      tiles.map(async (tile: any) => {
        await downloadSingleTile(tile);
      })
    );
  }

  async function downloadSingleTile(tile: any) {
    if (totalTilesRef.current > 0) {
      // @ts-ignore
      downloadTile(tile.url)
        .then((blob: any) =>
          saveTile(tile, blob)
            .then(() => {
              tilesDownloadedRef.current = tilesDownloadedRef.current + 1;

              if (loaderRef.current) {
                loaderRef.current.message =
                  "Lastet ned " +
                  tilesDownloadedRef.current +
                  " av " +
                  totalTilesRef.current +
                  " kartruter";
              }

              // When all tiles have downloaded, close the loading window and display a success message
              if (
                totalTilesRef.current > 0 &&
                tilesDownloadedRef.current >= totalTilesRef.current
              ) {
                const toastTotalTiles = totalTilesRef.current;

                totalTilesRef.current = 0;
                tilesDownloadedRef.current = 0;

                setTileProgressOpen(false);

                presentToast({
                  header: "Nedlasting vellykket",
                  message:
                    "Lastet ned " +
                    toastTotalTiles +
                    " kartruter, som nå kan brukes offline",
                  duration: 5000,
                });
              }
            })
            .catch((err: any) => {
              tilesDownloadedRef.current = 0;
              totalTilesRef.current = 0;
              setDownloadFailed(true);
            })
        )
        .catch((err: any) => {
          tilesDownloadedRef.current = 0;
          totalTilesRef.current = 0;
          setDownloadFailed(true);
        });
    }
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={[63.446827, 10.421906]}
        zoom={13}
        scrollWheelZoom={false}
        whenCreated={setMap}
        rotate={true}
      ></MapContainer>

      <IonLoading
        ref={loaderRef}
        isOpen={tileProgressOpen}
        message={""}
        backdropDismiss={false}
      />

      <div
        style={{
          zIndex: 9999,
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          width: "100vw",
          top: "90vh",
        }}
      >
        <IonButton color="primary" onClick={handleDownloadMapButtonClicked}>
          <IonIcon slot="start" icon={downloadOutline} />
          Last ned dette kartutsnittet
        </IonButton>
      </div>
    </div>
  );
};

export default LeafletMap;
