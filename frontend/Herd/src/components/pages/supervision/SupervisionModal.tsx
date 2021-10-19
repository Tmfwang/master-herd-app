import { useEffect, useState } from "react";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonModal,
  IonButton,
  IonicSwiper,
  useIonAlert,
} from "@ionic/react";
import {
  arrowForwardOutline,
  arrowBackOutline,
  checkmarkOutline,
} from "ionicons/icons";

import ObservationButtonGroup from "./ObservationButtonGroup";
import BottomNavigationButtons from "./BottomNavigationButtons";
import NumberButtons from "./NumberButtons";

import { observationDetailsType } from "../../../types";

import "leaflet/dist/leaflet.css";
import "./SupervisionPage.css";
import "swiper/swiper-bundle.min.css";
import "@ionic/react/css/ionic-swiper.css";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade } from "swiper";
SwiperCore.use([IonicSwiper, EffectFade]);

const allObservationTypes = {
  gruppeSau: "gruppeSau",
  soye: "soye",
  lam: "lam",
  rovdyr: "rovdyr",
  skadetSau: "skadetSau",
  dodSau: "dodSau",
};

const allSheepColorTypes = {
  hvitOrGra: "hvitOrGra",
  brun: "brun",
  sort: "sort",
  ikkeSpesifisert: "ikkeSpesifisert",
};

const allOwnerColorTypes = {
  rod: "rod",
  bla: "bla",
  gul: "gul",
  gronn: "gronn",
  ikkeSpesifisert: "ikkeSpesifisert",
};

const allTieColorTypes = {
  rod: "rod",
  bla: "bla",
  gulOrIngen: "gulOrIngen",
  gronn: "gronn",
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

const allModalSlidesId = {
  typeObservasjon: 0,
  gruppeSauFargePaSau: 1,
  gruppeSauFargePaEiermerke: 2,
  soyeFargePaSau: 3,
  soyeFargePaBjelleslips: 4,
  soyeFargePaEiermerke: 5,
  lamFargePaSau: 6,
  lamFargePaEiermerke: 7,
  rovdyrType: 8,
  skadetSauTypeSkade: 9,
  skadetSauFargePaSau: 10,
  skadetSauFargePaEiermerke: 11,
  dodSauDodsarsak: 12,
  dodSauFargePaSau: 13,
  dodSauFargePaEiermerke: 14,
};

const allFinalModalSlidesId = [
  allModalSlidesId["gruppeSauFargePaEiermerke"],
  allModalSlidesId["soyeFargePaEiermerke"],
  allModalSlidesId["lamFargePaEiermerke"],
  allModalSlidesId["rovdyrType"],
  allModalSlidesId["skadetSauFargePaEiermerke"],
  allModalSlidesId["dodSauFargePaEiermerke"],
];

const allModalSlidesHeaders = [
  "Type observasjon",
  "Farge på sauene",
  "Farge på eiermerkene",
  "Farge på søyene",
  "Farge på bjelleslipsene",
  "Farge på eiermerkene",
  "Farge på lammene",
  "Farge på eiermerkene",
  "Type rovdyr",
  "Type skade",
  "Farge på skadet sau",
  "Farge på eiermerket",
  "Dødsårsak",
  "Farge på død sau",
  "Farge på eiermerket",
];

const defaultObservationDetails: observationDetailsType = {
  alle: {
    typeObservasjon: allObservationTypes.gruppeSau,
  },

  gruppeSau: {
    fargePaSau: { hvitOrGra: 0, brun: 0, sort: 0 },
    fargePaEiermerke: {
      rod: 0,
      bla: 0,
      gul: 0,
      gronn: 0,
    },
  },

  soye: {
    fargePaSau: { hvitOrGra: 0, brun: 0, sort: 0 },
    fargePaBjelleslips: {
      rod: 0,
      bla: 0,
      gulOrIngen: 0,
      gronn: 0,
    },
    fargePaEiermerke: {
      rod: 0,
      bla: 0,
      gul: 0,
      gronn: 0,
    },
  },

  lam: {
    fargePaSau: { hvitOrGra: 0, brun: 0, sort: 0 },
    fargePaEiermerke: {
      rod: 0,
      bla: 0,
      gul: 0,
      gronn: 0,
    },
  },

  rovdyr: {
    typeRovdyr: "",
  },

  skadetSau: {
    typeSkade: "",
    fargePaSau: "ikkeSpesifisert",
    fargePaEiermerke: "ikkeSpesifisert",
  },

  dodSau: {
    dodsarsak: "",
    fargePaSau: "ikkeSpesifisert",
    fargePaEiermerke: "ikkeSpesifisert",
  },
};

interface SupervisionModalProps {
  modalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  saveObservation: (observationDetails: observationDetailsType) => void;
}

const SupervisionModal: React.FC<SupervisionModalProps> = ({
  modalOpen,
  setModalOpen,
  saveObservation,
}) => {
  const [presentAlert] = useIonAlert();

  const [observationDetails, setObservationDetails] =
    useState<observationDetailsType>(
      JSON.parse(JSON.stringify(defaultObservationDetails))
    );

  const [slideIndexHistory, setSlideIndexHistory] = useState<number[]>([]);
  const [slideContentHistory, setSlideContentHistory] = useState<
    observationDetailsType[]
  >([]);

  const [modalTitle, setModalTitle] = useState<string>(
    allModalSlidesHeaders[0]
  );

  const [swiperInstance, setSwiperInstance] = useState<any>();

  const calculateTotalSheep = () => {
    return (
      observationDetails["gruppeSau"]["fargePaSau"]["hvitOrGra"] +
      observationDetails["gruppeSau"]["fargePaSau"]["brun"] +
      observationDetails["gruppeSau"]["fargePaSau"]["sort"] +
      observationDetails["soye"]["fargePaSau"]["hvitOrGra"] +
      observationDetails["soye"]["fargePaSau"]["brun"] +
      observationDetails["soye"]["fargePaSau"]["sort"] +
      observationDetails["lam"]["fargePaSau"]["hvitOrGra"] +
      observationDetails["lam"]["fargePaSau"]["brun"] +
      observationDetails["lam"]["fargePaSau"]["sort"]
    );
  };

  const resetModal = () => {
    setModalTitle(allModalSlidesHeaders[0]);
    setObservationDetails(
      JSON.parse(JSON.stringify(defaultObservationDetails))
    );
    setSlideIndexHistory([]);
    setSlideContentHistory([]);
    if (swiperInstance) {
      // @ts-ignore
      swiperInstance.slideTo(1, 0);
    }
  };

  // This is a method that can be used to set the value of a specific field in the ObservationDetails-object
  // The observationField-parameter is used to define what field to update. It is a list of keys as strings,
  // where the keys are orderly looped through. Example: to change the "brun" field within the "fargePaSau"
  // field within the "gruppeSau" field, the observationField-parameter has to be
  // ["gruppeSau", "fargePaSau", "brun"]
  const setObservationField = (
    observationField: string[],
    newValue: string | number
  ) => {
    if (observationField.length > 0) {
      const newObservationDetails = JSON.parse(
        JSON.stringify(observationDetails)
      );

      let field = newObservationDetails;

      for (
        let fieldIndex = 0;
        fieldIndex < observationField.length - 1;
        fieldIndex++
      ) {
        if (field[observationField[fieldIndex]] !== undefined) {
          field = field[observationField[fieldIndex]];
        } else {
          alert("Noe gikk galt");
          return;
        }
      }

      if (field[observationField[observationField.length - 1]] !== undefined) {
        field[observationField[observationField.length - 1]] = newValue;
        setObservationDetails(newObservationDetails);
      } else {
        alert("Noe gikk galt");
        return;
      }
    }
  };

  const goToNextSlide = () => {
    if (swiperInstance) {
      let oldActiveSlide = swiperInstance.activeIndex;
      let activeSlide = swiperInstance.activeIndex;

      if (activeSlide === allModalSlidesId["typeObservasjon"]) {
        switch (observationDetails["alle"]["typeObservasjon"]) {
          case allObservationTypes.gruppeSau:
            activeSlide = allModalSlidesId["gruppeSauFargePaSau"];
            break;

          case allObservationTypes.soye:
            activeSlide = allModalSlidesId["soyeFargePaSau"];
            break;

          case allObservationTypes.lam:
            activeSlide = allModalSlidesId["lamFargePaSau"];
            break;

          case allObservationTypes.rovdyr:
            activeSlide = allModalSlidesId["rovdyrType"];
            break;

          case allObservationTypes.skadetSau:
            activeSlide = allModalSlidesId["skadetSauTypeSkade"];
            break;

          case allObservationTypes.dodSau:
            activeSlide = allModalSlidesId["dodSauDodsarsak"];
            break;
        }
      } else if (allFinalModalSlidesId.includes(activeSlide)) {
        saveObservation(observationDetails);
        setModalOpen(false);
        return;
      } else {
        activeSlide = activeSlide + 1;
      }

      // Keeps track of the slide index history
      const newSlideIndexHistory = [...slideIndexHistory, oldActiveSlide];
      setSlideIndexHistory(newSlideIndexHistory);

      // Keeps track of the slide content (i.e. state variables) history
      setSlideContentHistory([...slideContentHistory, observationDetails]);

      setModalTitle(allModalSlidesHeaders[activeSlide]);
      swiperInstance.slideTo(activeSlide, 250);
    }
  };

  const goToPreviousSlide = () => {
    if (swiperInstance) {
      // Uses the index history to go to the previous slide
      const newSlideIndexHistory = [...slideIndexHistory];
      const previousSlideIndex = newSlideIndexHistory.pop();

      if (previousSlideIndex !== undefined) {
        setModalTitle(allModalSlidesHeaders[previousSlideIndex]);
        swiperInstance.slideTo(previousSlideIndex, 250);
        setSlideIndexHistory(newSlideIndexHistory);
      }

      // Uses the slide content history to go to the previous variables state
      const newSlideContentHistory = [...slideContentHistory];
      const previousSlideContent = newSlideContentHistory.pop();

      if (previousSlideContent !== undefined) {
        setObservationDetails(JSON.parse(JSON.stringify(previousSlideContent)));
        setSlideContentHistory(newSlideContentHistory);
      }
    }
  };

  const confirmObservationSave = (confirmationMessage: string) => {
    presentAlert({
      header: "Fullfør observasjon?",
      message: confirmationMessage,
      buttons: [
        "Nei",
        {
          text: "Ja",
          handler: (d) => {
            saveObservation(observationDetails);
            setModalOpen(false);
          },
        },
      ],
    });
  };

  return (
    <IonModal
      isOpen={modalOpen}
      onDidPresent={() => {
        if (swiperInstance) {
          // @ts-ignore
          swiperInstance.update();
        }
      }}
      onDidDismiss={resetModal}
    >
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>{modalTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Avbryt
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Swiper
          allowTouchMove={false}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          style={{ height: "100%" }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {/* TYPE OBSERVASJON */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <ObservationButtonGroup
                observationButtonList={[
                  {
                    textContent: "Gruppe sau",
                    buttonId: allObservationTypes.gruppeSau,
                  },
                  {
                    textContent: "Søye",
                    buttonId: allObservationTypes.soye,
                  },
                  {
                    textContent: "Lam",
                    buttonId: allObservationTypes.lam,
                  },
                  {
                    textContent: "Rovdyr",
                    buttonId: allObservationTypes.rovdyr,
                  },
                  {
                    textContent: "Skadet sau",
                    buttonId: allObservationTypes.skadetSau,
                  },
                  {
                    textContent: "Død sau",
                    buttonId: allObservationTypes.dodSau,
                  },
                ]}
                onActiveChange={(buttonId) =>
                  setObservationField(["alle", "typeObservasjon"], buttonId)
                }
                activeButton={observationDetails["alle"]["typeObservasjon"]}
              ></ObservationButtonGroup>

              <BottomNavigationButtons
                prevButtonLabel="Avbryt"
                prevButtonOnClick={() => setModalOpen(false)}
                nextButtonLabel="Neste"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* GRUPPE SAU -> FARGE PÅ SAU */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <NumberButtons
                numberButtonList={[
                  {
                    textLabel: "Hvit/Grå",
                    buttonId: allSheepColorTypes.hvitOrGra,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaSau"][
                        "hvitOrGra"
                      ],
                  },
                  {
                    textLabel: "Brun",
                    buttonId: allSheepColorTypes.brun,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaSau"]["brun"],
                  },
                  {
                    textLabel: "Sort",
                    buttonId: allSheepColorTypes.sort,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaSau"]["sort"],
                  },
                ]}
                onValueChange={(buttonId: string, newValue: number) => {
                  setObservationField(
                    ["gruppeSau", "fargePaSau", buttonId],
                    newValue
                  );
                }}
                counterTopText="Trykk for å legge til en sau med denne fargen"
                counterBottomText="Hold inne i minst 1 sekund for å fjerne en sau med denne fargen"
              ></NumberButtons>
              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => {
                  goToPreviousSlide();
                }}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Eiermerke"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                nextButtonDisabled={calculateTotalSheep() === 0}
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
                finishButtonDisabled={calculateTotalSheep() === 0}
                finishButtonOnClick={() =>
                  confirmObservationSave(
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargene på sauenes eiermerker."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* GRUPPE SAU -> FARGE PÅ EIERMERKE */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <NumberButtons
                numberButtonList={[
                  {
                    textLabel: "Rød",
                    buttonId: allOwnerColorTypes.rod,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaEiermerke"][
                        "rod"
                      ],
                  },
                  {
                    textLabel: "Blå",
                    buttonId: allOwnerColorTypes.bla,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaEiermerke"][
                        "bla"
                      ],
                  },
                  {
                    textLabel: "Gul",
                    buttonId: allOwnerColorTypes.gul,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaEiermerke"][
                        "gul"
                      ],
                  },
                  {
                    textLabel: "Grønn",
                    buttonId: allOwnerColorTypes.gronn,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaEiermerke"][
                        "gronn"
                      ],
                  },
                ]}
                onValueChange={(buttonId: string, newValue: number) => {
                  setObservationField(
                    ["gruppeSau", "fargePaEiermerke", buttonId],
                    newValue
                  );
                }}
                maxTotalAmount={calculateTotalSheep()}
                maxTotalAmountErrorMessage={
                  "Du registrerte " +
                  calculateTotalSheep() +
                  " sau, og kan derfor ikke ha flere eiermerker enn dette."
                }
                counterTopText="Trykk for å legge til et eiermerke med denne fargen"
                counterBottomText="Hold inne i minst 1 sekund for å fjerne et eiermerke med denne fargen"
              ></NumberButtons>
              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => {
                  goToPreviousSlide();
                }}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Fullfør"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={checkmarkOutline}
                nextButtonDisabled={calculateTotalSheep() === 0}
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* SØYE -> FARGE PÅ SAU */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <NumberButtons
                numberButtonList={[
                  {
                    textLabel: "Hvit/Grå",
                    buttonId: allSheepColorTypes.hvitOrGra,
                    currentValue:
                      observationDetails["soye"]["fargePaSau"]["hvitOrGra"],
                  },
                  {
                    textLabel: "Brun",
                    buttonId: allSheepColorTypes.brun,
                    currentValue:
                      observationDetails["soye"]["fargePaSau"]["brun"],
                  },
                  {
                    textLabel: "Sort",
                    buttonId: allSheepColorTypes.sort,
                    currentValue:
                      observationDetails["soye"]["fargePaSau"]["sort"],
                  },
                ]}
                onValueChange={(buttonId: string, newValue: number) => {
                  setObservationField(
                    ["soye", "fargePaSau", buttonId],
                    newValue
                  );
                }}
                counterTopText="Trykk for å legge til en søye med denne fargen"
                counterBottomText="Hold inne i minst 1 sekund for å fjerne en søye med denne fargen"
              ></NumberButtons>
              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => {
                  goToPreviousSlide();
                }}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Bjelleslips"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                nextButtonDisabled={calculateTotalSheep() === 0}
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
                finishButtonDisabled={calculateTotalSheep() === 0}
                finishButtonOnClick={() =>
                  confirmObservationSave(
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargene på søyenes bjelleslips og eiermerker."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* SØYE -> FARGE PÅ BJELLESLIPS */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <NumberButtons
                numberButtonList={[
                  {
                    textLabel: "Rød",
                    buttonId: allTieColorTypes.rod,
                    currentValue:
                      observationDetails["soye"]["fargePaBjelleslips"]["rod"],
                  },
                  {
                    textLabel: "Blå",
                    buttonId: allTieColorTypes.bla,
                    currentValue:
                      observationDetails["soye"]["fargePaBjelleslips"]["bla"],
                  },
                  {
                    textLabel: "Gul/Blank",
                    buttonId: allTieColorTypes.gulOrIngen,
                    currentValue:
                      observationDetails["soye"]["fargePaBjelleslips"][
                        "gulOrIngen"
                      ],
                  },
                  {
                    textLabel: "Grønn",
                    buttonId: allTieColorTypes.gronn,
                    currentValue:
                      observationDetails["soye"]["fargePaBjelleslips"]["gronn"],
                  },
                ]}
                onValueChange={(buttonId: string, newValue: number) => {
                  setObservationField(
                    ["soye", "fargePaBjelleslips", buttonId],
                    newValue
                  );
                }}
                maxTotalAmount={calculateTotalSheep()}
                maxTotalAmountErrorMessage={
                  "Du registrerte " +
                  calculateTotalSheep() +
                  (calculateTotalSheep() === 1 ? " søye" : " søyer") +
                  ", og kan derfor ikke ha flere bjelleslips enn dette."
                }
                counterTopText="Trykk for å legge til et bjelleslips med denne fargen"
                counterBottomText="Hold inne i minst 1 sekund for å fjerne et bjelleslips med denne fargen"
              ></NumberButtons>
              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => {
                  goToPreviousSlide();
                }}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Eiermerke"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                nextButtonDisabled={calculateTotalSheep() === 0}
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
                finishButtonOnClick={() =>
                  confirmObservationSave(
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargene på søyenes eiermerker."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* SØYE -> FARGE PÅ EIERMERKE */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <NumberButtons
                numberButtonList={[
                  {
                    textLabel: "Rød",
                    buttonId: allOwnerColorTypes.rod,
                    currentValue:
                      observationDetails["soye"]["fargePaEiermerke"]["rod"],
                  },
                  {
                    textLabel: "Blå",
                    buttonId: allOwnerColorTypes.bla,
                    currentValue:
                      observationDetails["soye"]["fargePaEiermerke"]["bla"],
                  },
                  {
                    textLabel: "Gul",
                    buttonId: allOwnerColorTypes.gul,
                    currentValue:
                      observationDetails["soye"]["fargePaEiermerke"]["gul"],
                  },
                  {
                    textLabel: "Grønn",
                    buttonId: allOwnerColorTypes.gronn,
                    currentValue:
                      observationDetails["soye"]["fargePaEiermerke"]["gronn"],
                  },
                ]}
                onValueChange={(buttonId: string, newValue: number) => {
                  setObservationField(
                    ["soye", "fargePaEiermerke", buttonId],
                    newValue
                  );
                }}
                maxTotalAmount={calculateTotalSheep()}
                maxTotalAmountErrorMessage={
                  "Du registrerte " +
                  calculateTotalSheep() +
                  (calculateTotalSheep() === 1 ? " søye" : " søyer") +
                  ", og kan derfor ikke ha flere eiermerker enn dette."
                }
                counterTopText="Trykk for å legge til et eiermerke med denne fargen"
                counterBottomText="Hold inne i minst 1 sekund for å fjerne et eiermerke med denne fargen"
              ></NumberButtons>
              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => {
                  goToPreviousSlide();
                }}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Fullfør"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={checkmarkOutline}
                nextButtonDisabled={calculateTotalSheep() === 0}
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* LAM -> FARGE PÅ SAU */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <NumberButtons
                numberButtonList={[
                  {
                    textLabel: "Hvit/Grå",
                    buttonId: allSheepColorTypes.hvitOrGra,
                    currentValue:
                      observationDetails["lam"]["fargePaSau"]["hvitOrGra"],
                  },
                  {
                    textLabel: "Brun",
                    buttonId: allSheepColorTypes.brun,
                    currentValue:
                      observationDetails["lam"]["fargePaSau"]["brun"],
                  },
                  {
                    textLabel: "Sort",
                    buttonId: allSheepColorTypes.sort,
                    currentValue:
                      observationDetails["lam"]["fargePaSau"]["sort"],
                  },
                ]}
                onValueChange={(buttonId: string, newValue: number) => {
                  setObservationField(
                    ["lam", "fargePaSau", buttonId],
                    newValue
                  );
                }}
                counterTopText="Trykk for å legge til et lam med denne fargen"
                counterBottomText="Hold inne i minst 1 sekund for å fjerne et lam med denne fargen"
              ></NumberButtons>
              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => {
                  goToPreviousSlide();
                }}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Eiermerke"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                nextButtonDisabled={calculateTotalSheep() === 0}
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
                finishButtonDisabled={calculateTotalSheep() === 0}
                finishButtonOnClick={() =>
                  confirmObservationSave(
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargene på lammenes eiermerker."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* LAM -> FARGE PÅ EIERMERKE */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <NumberButtons
                numberButtonList={[
                  {
                    textLabel: "Rød",
                    buttonId: allOwnerColorTypes.rod,
                    currentValue:
                      observationDetails["lam"]["fargePaEiermerke"]["rod"],
                  },
                  {
                    textLabel: "Blå",
                    buttonId: allOwnerColorTypes.bla,
                    currentValue:
                      observationDetails["lam"]["fargePaEiermerke"]["bla"],
                  },
                  {
                    textLabel: "Gul",
                    buttonId: allOwnerColorTypes.gul,
                    currentValue:
                      observationDetails["lam"]["fargePaEiermerke"]["gul"],
                  },
                  {
                    textLabel: "Grønn",
                    buttonId: allOwnerColorTypes.gronn,
                    currentValue:
                      observationDetails["lam"]["fargePaEiermerke"]["gronn"],
                  },
                ]}
                onValueChange={(buttonId: string, newValue: number) => {
                  setObservationField(
                    ["lam", "fargePaEiermerke", buttonId],
                    newValue
                  );
                }}
                maxTotalAmount={calculateTotalSheep()}
                maxTotalAmountErrorMessage={
                  "Du registrerte " +
                  calculateTotalSheep() +
                  " lam, og kan derfor ikke ha flere eiermerker enn dette."
                }
                counterTopText="Trykk for å legge til et eiermerke med denne fargen"
                counterBottomText="Hold inne i minst 1 sekund for å fjerne et eiermerke med denne fargen"
              ></NumberButtons>
              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => {
                  goToPreviousSlide();
                }}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Fullfør"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={checkmarkOutline}
                nextButtonDisabled={calculateTotalSheep() === 0}
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* ROVDYR -> TYPE ROVDYR */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <ObservationButtonGroup
                observationButtonList={[
                  {
                    textContent: "Jerv",
                    buttonId: allPredatorTypes.jerv,
                  },
                  {
                    textContent: "Gaupe",
                    buttonId: allPredatorTypes.gaupe,
                  },
                  {
                    textContent: "Bjørn",
                    buttonId: allPredatorTypes.bjorn,
                  },
                  {
                    textContent: "Ulv",
                    buttonId: allPredatorTypes.ulv,
                  },
                  {
                    textContent: "Ørn",
                    buttonId: allPredatorTypes.orn,
                  },
                  {
                    textContent: "Annet",
                    buttonId: allPredatorTypes.annet,
                  },
                ]}
                onActiveChange={(buttonId) =>
                  setObservationField(["rovdyr", "typeRovdyr"], buttonId)
                }
                activeButton={observationDetails["rovdyr"]["typeRovdyr"]}
              ></ObservationButtonGroup>

              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => goToPreviousSlide()}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Fullfør"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={checkmarkOutline}
                nextButtonDisabled={
                  observationDetails["rovdyr"]["typeRovdyr"] === ""
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* SKADET SAU -> TYPE SKADE */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <ObservationButtonGroup
                observationButtonList={[
                  {
                    textContent: "Halter",
                    buttonId: allSheepDamageTypes.halter,
                  },
                  {
                    textContent: "Blør",
                    buttonId: allSheepDamageTypes.blor,
                  },
                  {
                    textContent: "Skade på hodet",
                    buttonId: allSheepDamageTypes.hodeskade,
                  },
                  {
                    textContent: "Skade på kropp",
                    buttonId: allSheepDamageTypes.kroppskade,
                  },
                  {
                    textContent: "Annet",
                    buttonId: allSheepDamageTypes.annet,
                  },
                ]}
                onActiveChange={(buttonId) =>
                  setObservationField(["skadetSau", "typeSkade"], buttonId)
                }
                activeButton={observationDetails["skadetSau"]["typeSkade"]}
              ></ObservationButtonGroup>

              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => goToPreviousSlide()}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Sauefarge"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                nextButtonDisabled={
                  observationDetails["skadetSau"]["typeSkade"] === ""
                }
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
                finishButtonDisabled={
                  observationDetails["skadetSau"]["typeSkade"] === ""
                }
                finishButtonOnClick={() =>
                  confirmObservationSave(
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargen på sauen og eiermerket."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* SKADET SAU -> FARGE PÅ SAU */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <div style={{ marginTop: "21.7%", marginBottom: "-25%" }}>
                <ObservationButtonGroup
                  observationButtonList={[
                    {
                      textContent: "Hvit/Grå",
                      buttonId: allSheepColorTypes.hvitOrGra,
                    },
                    {
                      textContent: "Brun",
                      buttonId: allSheepColorTypes.brun,
                    },
                    {
                      textContent: "Sort",
                      buttonId: allSheepColorTypes.sort,
                    },
                    {
                      textContent: "Ikke spesifisert",
                      buttonId: allSheepColorTypes.ikkeSpesifisert,
                    },
                  ]}
                  onActiveChange={(buttonId) =>
                    setObservationField(["skadetSau", "fargePaSau"], buttonId)
                  }
                  activeButton={observationDetails["skadetSau"]["fargePaSau"]}
                ></ObservationButtonGroup>
              </div>

              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => goToPreviousSlide()}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Eiermerke"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
                finishButtonOnClick={() =>
                  confirmObservationSave(
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargen på sauens eiermerke."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* SKADET SAU -> FARGE PÅ EIERMERKE */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <ObservationButtonGroup
                observationButtonList={[
                  {
                    textContent: "Rød",
                    buttonId: allOwnerColorTypes.rod,
                  },
                  {
                    textContent: "Blå",
                    buttonId: allOwnerColorTypes.bla,
                  },
                  {
                    textContent: "Gul",
                    buttonId: allOwnerColorTypes.gul,
                  },
                  {
                    textContent: "Grønn",
                    buttonId: allOwnerColorTypes.gronn,
                  },
                  {
                    textContent: "Ikke spesifisert",
                    buttonId: allOwnerColorTypes.ikkeSpesifisert,
                  },
                ]}
                onActiveChange={(buttonId) =>
                  setObservationField(
                    ["skadetSau", "fargePaEiermerke"],
                    buttonId
                  )
                }
                activeButton={
                  observationDetails["skadetSau"]["fargePaEiermerke"]
                }
              ></ObservationButtonGroup>

              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => goToPreviousSlide()}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Fullfør"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={checkmarkOutline}
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* DØD SAU -> DØDSÅRSAK */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <ObservationButtonGroup
                observationButtonList={[
                  {
                    textContent: "Sykdom",
                    buttonId: allSheepCausesOfDeathTypes.sykdom,
                  },
                  {
                    textContent: "Rovdyr",
                    buttonId: allSheepCausesOfDeathTypes.rovdyr,
                  },
                  {
                    textContent: "Fallulykke",
                    buttonId: allSheepCausesOfDeathTypes.fallulykke,
                  },
                  {
                    textContent: "Druknings- ulykke",
                    buttonId: allSheepCausesOfDeathTypes.drukningsulykke,
                  },
                  {
                    textContent: "Annet",
                    buttonId: allSheepCausesOfDeathTypes.annet,
                  },
                ]}
                onActiveChange={(buttonId) =>
                  setObservationField(["dodSau", "dodsarsak"], buttonId)
                }
                activeButton={observationDetails["dodSau"]["dodsarsak"]}
              ></ObservationButtonGroup>

              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => goToPreviousSlide()}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Sauefarge"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                nextButtonDisabled={
                  observationDetails["dodSau"]["dodsarsak"] === ""
                }
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
                finishButtonDisabled={
                  observationDetails["dodSau"]["dodsarsak"] === ""
                }
                finishButtonOnClick={() =>
                  confirmObservationSave(
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargen på sauen og eiermerket."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* DØD SAU -> FARGE PÅ SAU */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <div style={{ marginTop: "21.7%", marginBottom: "-25%" }}>
                <ObservationButtonGroup
                  observationButtonList={[
                    {
                      textContent: "Hvit/Grå",
                      buttonId: allSheepColorTypes.hvitOrGra,
                    },
                    {
                      textContent: "Brun",
                      buttonId: allSheepColorTypes.brun,
                    },
                    {
                      textContent: "Sort",
                      buttonId: allSheepColorTypes.sort,
                    },
                    {
                      textContent: "Ikke spesifisert",
                      buttonId: allSheepColorTypes.ikkeSpesifisert,
                    },
                  ]}
                  onActiveChange={(buttonId) =>
                    setObservationField(["dodSau", "fargePaSau"], buttonId)
                  }
                  activeButton={observationDetails["dodSau"]["fargePaSau"]}
                ></ObservationButtonGroup>
              </div>

              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => goToPreviousSlide()}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Eiermerke"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
                finishButtonOnClick={() =>
                  confirmObservationSave(
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargen på sauens eiermerke."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* DØD SAU -> FARGE PÅ EIERMERKE */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <ObservationButtonGroup
                observationButtonList={[
                  {
                    textContent: "Rød",
                    buttonId: allOwnerColorTypes.rod,
                  },
                  {
                    textContent: "Blå",
                    buttonId: allOwnerColorTypes.bla,
                  },
                  {
                    textContent: "Gul",
                    buttonId: allOwnerColorTypes.gul,
                  },
                  {
                    textContent: "Grønn",
                    buttonId: allOwnerColorTypes.gronn,
                  },
                  {
                    textContent: "Ikke spesifisert",
                    buttonId: allOwnerColorTypes.ikkeSpesifisert,
                  },
                ]}
                onActiveChange={(buttonId) =>
                  setObservationField(["dodSau", "fargePaEiermerke"], buttonId)
                }
                activeButton={observationDetails["dodSau"]["fargePaEiermerke"]}
              ></ObservationButtonGroup>

              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => goToPreviousSlide()}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Fullfør"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={checkmarkOutline}
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonModal>
  );
};

export default SupervisionModal;
