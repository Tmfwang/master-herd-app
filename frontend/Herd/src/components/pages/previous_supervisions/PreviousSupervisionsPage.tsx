import { useEffect, useState } from "react";

import { Storage } from "@capacitor/storage";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";

import { cloudOfflineOutline } from "ionicons/icons";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";
import InspectSupervisionModal from "./InspectSupervisionModal";

import { supervisionType } from "../../../types";

import "leaflet/dist/leaflet.css";
import "./PreviousSupervisionsPage.css";

interface PreviousSupervisionsPageProps {}

const PreviousSupervisionsPage: React.FC<PreviousSupervisionsPageProps> =
  () => {
    const [allSupervisions, setAllSupervisions] = useState<supervisionType[]>(
      [] as supervisionType[]
    );

    const [currentInspectedSupervision, setCurrentInspectedSupervision] =
      useState<supervisionType | null>(null);

    useIonViewWillEnter(async () => {
      const { value } = await Storage.get({ key: "allSupervisions" });

      if (value) {
        try {
          let allStoredSupervisions = JSON.parse(value);
          setAllSupervisions(allStoredSupervisions);
        } catch (err) {}
      }
    });

    const createTimeDifferenceString = (startTime: string, endTime: string) => {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      const difference = endDate.getTime() - startDate.getTime();
      const hourDuration = Math.floor(Math.round(difference / 60000) / 60);
      const minuteDuration = Math.round(difference / 60000) % 60;

      return hourDuration + "t " + minuteDuration + "m";
    };

    const createDateString = (dateIso: string) => {
      const localeDateArray = new Date(dateIso)
        .toLocaleDateString("no-no")
        .split(".");

      return (
        // Day
        localeDateArray[0] +
        "/" +
        // Month
        localeDateArray[1] +
        "/" +
        // Year
        localeDateArray[2].substring(2, 4)
      );
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
            <InspectSupervisionModal
              supervision={currentInspectedSupervision}
              setSupervision={setCurrentInspectedSupervision}
            />

            {allSupervisions.length > 0 && (
              <IonList>
                <IonListHeader lines="inset" style={{ fontSize: "18px" }}>
                  <IonLabel>Tidligere tilsynsturer</IonLabel>
                </IonListHeader>

                {allSupervisions
                  .map((supervision) => {
                    return (
                      <IonItem
                        button
                        onClick={() =>
                          setCurrentInspectedSupervision(supervision)
                        }
                      >
                        <IonIcon
                          slot="start"
                          icon={cloudOfflineOutline}
                          style={{ marginLeft: "10px", marginRight: "0px" }}
                        ></IonIcon>
                        <IonLabel>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: "5px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Dato:
                                </div>
                                <div>
                                  {createDateString(supervision.whenStarted)}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: "5px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Starttid:
                                </div>
                                <div>
                                  {new Date(supervision.whenStarted)
                                    .toLocaleTimeString("no-no")
                                    .substring(0, 5)}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: "5px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Varighet:
                                </div>
                                <div>
                                  {createTimeDifferenceString(
                                    supervision.whenStarted,
                                    supervision.whenEnded
                                  )}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: "5px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Observasjoner:
                                </div>
                                <div>{supervision.allObservations.length}</div>
                              </div>
                            </div>
                          </div>
                        </IonLabel>
                      </IonItem>
                    );
                  })
                  .reverse()}
              </IonList>
            )}
            {allSupervisions.length === 0 && (
              <div
                style={{
                  width: "60%",
                  textAlign: "center",
                  marginTop: "50px",
                  margin: "auto",
                }}
              >
                Du har ingen lagrede tilsynturer. <br />
                <br />
                Du kan utføre en ny tilsyntur ved å trykke på "Start ny
                tilsynstur" i sidemenyen.
              </div>
            )}
          </IonContent>
        </IonPage>
      </>
    );
  };

export default PreviousSupervisionsPage;
