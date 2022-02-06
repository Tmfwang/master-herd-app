import { useState, useEffect, useRef } from "react";

import { Storage } from "@capacitor/storage";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

import axios from "axios";

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
  IonLoading,
  IonItemSliding,
  useIonViewWillEnter,
  useIonViewDidLeave,
  useIonAlert,
  useIonToast,
  IonItemOptions,
  IonItemOption,
  IonToast,
} from "@ionic/react";

import {
  cloudOfflineOutline,
  trashBinOutline,
  cloudUploadOutline,
  cloudDoneOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";
import InspectSupervisionModal from "./InspectSupervisionModal";

import {
  fullObservationType,
  observationDetailsType,
  supervisionType,
} from "../../../types";

import "leaflet/dist/leaflet.css";
import "./PreviousSupervisionsPage.css";

const allObservationTypes = {
  gruppeSau: "gruppeSau",
  rovdyr: "rovdyr",
  skadetSau: "skadetSau",
  dodSau: "dodSau",
};

interface PreviousSupervisionsPageProps {}

// This is the main component for the previous supervisions page; it lists all previous supervisions.
const PreviousSupervisionsPage: React.FC<
  PreviousSupervisionsPageProps
> = () => {
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState("");

  const [slidedSupervision, setSlidedSupervision] = useState<supervisionType>();

  const listRef = useRef(null);

  const [allLocalSupervisions, setAllLocalSupervisions] = useState<
    supervisionType[]
  >([] as supervisionType[]);

  const [allOnlineSupervisions, setAllOnlineSupervisions] = useState<
    supervisionType[]
  >([] as supervisionType[]);

  const [allSupervisions, setAllSupervisions] = useState<supervisionType[]>(
    [] as supervisionType[]
  );

  const [currentInspectedSupervision, setCurrentInspectedSupervision] =
    useState<supervisionType | null>(null);

  useEffect(() => {
    removeLocalDuplicateSupervisions();

    let newAllSupervisions = [
      ...allLocalSupervisions,
      ...allOnlineSupervisions,
    ];

    newAllSupervisions.sort(function (a, b) {
      return ("" + a.whenStarted).localeCompare(b.whenStarted);
    });

    setAllSupervisions(newAllSupervisions);
  }, [allLocalSupervisions, allOnlineSupervisions]);

  useEffect(() => {
    if (listRef.current) {
      // @ts-ignore
      listRef.current.closeSlidingItems();
    }
  }, [allSupervisions]);

  useEffect(() => {
    if (authToken) {
      setShowToast(true);
      fetchOnlineSupervisions();
    } else {
      setShowToast(false);
    }
  }, [authToken]);

  useIonViewDidLeave(() => {
    setIsLoading(true);
  });

  // Loads locally-stored supervisions
  useIonViewWillEnter(async () => {
    let value;
    await Storage.get({
      key: "allSupervisions",
    })
      .then((readValue) => {
        value = readValue.value;
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    if (value) {
      try {
        let allStoredSupervisions = JSON.parse(value);
        setAllLocalSupervisions(allStoredSupervisions);
      } catch (err) {}
    }
  });

  // Checks if user is logged in
  useIonViewWillEnter(async () => {
    let value;
    await SecureStoragePlugin.get({
      key: "authenticationToken",
    })
      // @ts-ignore
      .then((readValue) => {
        value = readValue.value;

        if (value) {
          setAuthToken(value);
        } else {
          setAuthToken("");
        }
      })
      .catch(() => setAuthToken(""));
  });

  const fetchOnlineSupervisions = async () => {
    axios
      .get("https://master-herd-api.herokuapp.com/supervision/", {
        headers: {
          Authorization: "Token " + authToken,
        },
      })
      .then(async (response) => {
        setShowToast(false);
        setAllOnlineSupervisions(response.data);
      })
      .catch((e) => {
        setShowToast(false);
      });
  };

  // Removes from the local storage any supervisions that have been uploaded
  const removeLocalDuplicateSupervisions = async () => {
    if (allLocalSupervisions.length > 0) {
      let updatedLocalSupervisions: supervisionType[] = [
        ...allLocalSupervisions,
      ];
      for (let onlineSupervision of allOnlineSupervisions) {
        updatedLocalSupervisions = updatedLocalSupervisions.filter(
          (localSupervision) =>
            localSupervision.whenStarted !== onlineSupervision.whenStarted
        );
      }

      if (allLocalSupervisions.length != updatedLocalSupervisions.length) {
        await Storage.set({
          key: "allSupervisions",
          value: JSON.stringify(updatedLocalSupervisions),
        });

        setAllLocalSupervisions(updatedLocalSupervisions);
      }
    }
  };

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

  const calculateTotalSheep = (supervision: supervisionType) => {
    let totalSheep = 0;

    for (let observation of supervision.allObservations) {
      totalSheep += calculateTotalSheepbyType("fargePaSau", observation);
      totalSheep += calculateTotalSheepbyType("fargePaSoye", observation);
      totalSheep += calculateTotalSheepbyType("fargePaLam", observation);

      if (
        observation.observationDetails.alle.typeObservasjon ===
          allObservationTypes.dodSau ||
        observation.observationDetails.alle.typeObservasjon ===
          allObservationTypes.skadetSau
      ) {
        totalSheep += 1;
      }
    }
    return totalSheep;
  };

  const calculateTotalSheepbyType = (
    sheepType: string,
    observation: fullObservationType
  ) => {
    return (
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["hvitOrGra"] +
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["brun"] +
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["sort"]
    );
  };

  // Asks user for confirmation of supervision upload
  const handleSupervisionUploadConfirmation = (
    supervision: supervisionType
  ) => {
    if (authToken) {
      presentAlert({
        header: "Last opp tilsynsturen?",
        message:
          "Ønsker du å laste opp tilsynsturen? Dette vil gjøre tilsynsturen tilgjengelig på nett.",
        buttons: [
          "Avbryt",
          {
            text: "Last opp",
            handler: () => {
              handleSupervisionUpload(supervision);
            },
          },
        ],
      });
    } else {
      presentAlert({
        header: "Ikke innlogget",
        message:
          "Du må være innlogget dersom du ønsker å laste opp denne tilsynsturen.",
        buttons: ["OK"],
      });
    }
  };

  const handleSupervisionUpload = (supervision: supervisionType) => {
    axios
      .post("https://master-herd-api.herokuapp.com/supervision/", supervision, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + authToken,
        },
      })
      .then(async (response) => {
        presentToast({
          header: "Opplasting vellykket",
          message:
            "Tilsynsturen ble lastet opp, og fjernet fra din mobils lokale lager",
          duration: 6000,
        });

        fetchOnlineSupervisions();
      })
      .catch((e) => {
        presentToast({
          header: "Noe gikk galt",
          message: "Sjekk at du er logget inn, og prøv igjen senere",
          duration: 6000,
        });
      });
  };

  const handleSupervisionDeleteConfirmation = (
    supervision: supervisionType
  ) => {
    // Asks user for confirmation of supervision deletion
    presentAlert({
      header: "Slette tilsynsturen?",
      message: "Ønsker du å slette denne tilsynsturen? Dette kan ikke angres.",
      buttons: [
        "Avbryt",
        {
          text: "Slett",
          handler: () => {
            handleSupervisionDelete(supervision);
          },
        },
      ],
    });
  };

  const handleSupervisionDelete = async (supervision: supervisionType) => {
    if (!supervision.id) {
      let updatedSupervisionList = [...allLocalSupervisions];

      for (let i = 0; i < updatedSupervisionList.length; i++) {
        if (updatedSupervisionList[i] === supervision) {
          updatedSupervisionList.splice(i, 1);
          i = i - 1;
        }
      }

      setAllLocalSupervisions(updatedSupervisionList);

      await Storage.set({
        key: "allSupervisions",
        value: JSON.stringify(updatedSupervisionList),
      }).then(() => {
        presentToast({
          header: "Tilsynsturen ble slettet",
          duration: 5000,
        });
      });
    } else {
      axios
        .delete(
          "https://master-herd-api.herokuapp.com/supervision/" +
            supervision.id +
            "/",
          {
            headers: {
              Authorization: "Token " + authToken,
            },
          }
        )
        .then(async (response) => {
          presentToast({
            header: "Sletting vellykket",
            message: "Tilsynsturen ble slettet",
            duration: 5000,
          });

          fetchOnlineSupervisions();
        })
        .catch((e) => {
          presentToast({
            header: "Noe gikk galt",
            message: "Sjekk at du har internettforbindelse og prøv igjen",
            duration: 5000,
          });
        });
    }
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

          <IonToast
            isOpen={showToast}
            message="Laster inn tilsynsturer som er lagret på nett..."
            position="bottom"
          ></IonToast>

          {allSupervisions.length > 0 && (
            <IonList ref={listRef}>
              <IonListHeader lines="inset" style={{ fontSize: "18px" }}>
                <IonLabel>Tidligere tilsynsturer</IonLabel>
              </IonListHeader>

              {allSupervisions
                .map((supervision: supervisionType) => {
                  return (
                    <IonItemSliding
                      onIonDrag={async (e) => {
                        // @ts-ignore
                        let openRatio = await e.target.getSlidingRatio();
                        if (openRatio === 1) {
                          setSlidedSupervision(supervision);
                        } else {
                          setSlidedSupervision(undefined);
                        }
                      }}
                    >
                      <IonItem button>
                        <IonIcon
                          slot="start"
                          icon={
                            supervision.id
                              ? cloudDoneOutline
                              : cloudOfflineOutline
                          }
                          style={{ marginLeft: "10px", marginRight: "0px" }}
                          onClick={() => {
                            if (!supervision.id) {
                              handleSupervisionUploadConfirmation(supervision);
                            }
                          }}
                        ></IonIcon>
                        <IonLabel>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                            onClick={() =>
                              setCurrentInspectedSupervision(supervision)
                            }
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
                                    marginRight: "30px",
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
                                  Varighet:
                                </div>
                                <div>
                                  {createTimeDifferenceString(
                                    supervision.whenStarted,
                                    supervision.whenEnded
                                  )}
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
                                    marginRight: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Observasjoner:
                                </div>
                                <div>{supervision.allObservations.length}</div>
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
                                  Antall sau:
                                </div>
                                <div>{calculateTotalSheep(supervision)}</div>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "auto",
                                marginRight: "-9px",
                                marginLeft: "0px",
                                width: "20px",
                              }}
                            >
                              <IonIcon
                                icon={
                                  slidedSupervision === supervision
                                    ? chevronForwardOutline
                                    : chevronBackOutline
                                }
                              ></IonIcon>
                            </div>
                          </div>
                        </IonLabel>
                      </IonItem>

                      <IonItemOptions side="end">
                        {!supervision.id && (
                          <IonItemOption
                            onClick={() => {
                              handleSupervisionUploadConfirmation(supervision);
                            }}
                          >
                            <IonIcon
                              slot="icon-only"
                              icon={cloudUploadOutline}
                            />
                          </IonItemOption>
                        )}
                        <IonItemOption
                          color="danger"
                          onClick={() => {
                            handleSupervisionDeleteConfirmation(supervision);
                          }}
                        >
                          <IonIcon slot="icon-only" icon={trashBinOutline} />
                        </IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>
                  );
                })
                .reverse()}
            </IonList>
          )}
          {allSupervisions.length === 0 && !isLoading && !showToast && (
            <div>
              <div
                style={{
                  height: "100px",
                }}
              ></div>
              <div
                style={{
                  width: "60%",
                  height: "50%",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                Du har ingen lagrede tilsynturer. <br />
                <br />
                Du kan utføre en ny tilsyntur ved å trykke på "Start ny
                tilsynstur" i sidemenyen.
              </div>
            </div>
          )}

          <IonLoading isOpen={isLoading} message="Laster..."></IonLoading>
        </IonContent>
      </IonPage>
    </>
  );
};

export default PreviousSupervisionsPage;
