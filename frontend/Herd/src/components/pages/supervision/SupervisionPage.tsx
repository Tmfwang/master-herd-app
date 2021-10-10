import { useEffect, useState } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonModal,
  useIonAlert,
  useIonToast,
  IonButton,
  IonicSwiper,
  IonRippleEffect,
} from "@ionic/react";
import { locateOutline } from "ionicons/icons";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";
import BottomCenterButton from "../../shared/BottomCenterButton";

import GeolocatorForeground from "../../geolocators/GeolocatorForeground";
import GeolocatorPathTracking from "../../geolocators/Geolocator";
import LeafletMap from "./LeafletMapSupervisionPage";

import { locationType, pathCoordinateType } from "../../../types";

import "leaflet/dist/leaflet.css";
import "./SupervisionPage.css";
import "swiper/swiper-bundle.min.css";
import "@ionic/react/css/ionic-swiper.css";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade } from "swiper";
SwiperCore.use([IonicSwiper, EffectFade]);

interface SupervisionPageProps {}

const SupervisionPage: React.FC<SupervisionPageProps> = () => {
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [modalContentId, setModalContentId] = useState<string>("");
  const [modalHeaderTitle, setModalHeaderTitle] = useState<string>("");

  const [swiperInstance, setSwiperInstance] = useState<any>(null);

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

  const handleNewObservationClicked = () => {
    setModalContentId("initial");
    setModalHeaderTitle("Type observasjon");
  };

  const hapticsImpactLight = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };

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
            onClick={handleNewObservationClicked}
          />

          <IonModal
            isOpen={modalContentId !== ""}
            onDidPresent={() => swiperInstance.update()}
          >
            <IonHeader translucent>
              <IonToolbar>
                <IonTitle>{modalHeaderTitle}</IonTitle>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() => {
                      setModalContentId("");
                      setModalHeaderTitle("");
                    }}
                  >
                    Avbryt
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
              <Swiper
                effect="fade"
                fadeEffect={{ crossFade: true }}
                style={{ height: "70%" }}
                onSwiper={(swiper) => setSwiperInstance(swiper)}
              >
                <SwiperSlide>
                  <div
                    className="ion-activatable"
                    style={{
                      width: "40%",
                      height: "40%",
                      border: "1px solid black",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <IonRippleEffect></IonRippleEffect>
                  </div>
                  <div
                    className="ion-activatable"
                    style={{
                      width: "40%",
                      height: "40%",
                      border: "1px solid black",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <IonRippleEffect></IonRippleEffect>
                  </div>
                  <div
                    className="ion-activatable"
                    style={{
                      width: "40%",
                      height: "40%",
                      border: "1px solid black",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <IonRippleEffect></IonRippleEffect>
                  </div>
                </SwiperSlide>
                <SwiperSlide>-------</SwiperSlide>
                <SwiperSlide>YOOOOOOOOO</SwiperSlide>
              </Swiper>
              <IonButton
                onClick={() => {
                  setModalHeaderTitle("EHY");
                  swiperInstance.slideTo(3, 500);
                  hapticsImpactLight();
                }}
              >
                Avbryt
              </IonButton>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default SupervisionPage;
