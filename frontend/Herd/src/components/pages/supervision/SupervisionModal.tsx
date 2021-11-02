import { useState } from "react";

import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

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
  useIonViewWillEnter,
} from "@ionic/react";

import useSound from "use-sound";

// @ts-ignore
import blaSfx from "../../../assets/sounds/colors/Bla.mp3";
// @ts-ignore
import brunSfx from "../../../assets/sounds/colors/Brun.mp3";
// @ts-ignore
import gronnSfx from "../../../assets/sounds/colors/Gronn.mp3";
// @ts-ignore
import gulEllerBlankSfx from "../../../assets/sounds/colors/GulEllerBlank.mp3";
// @ts-ignore
import hvitEllerGraSfx from "../../../assets/sounds/colors/HvitEllerGra.mp3";
// @ts-ignore
import rodSfx from "../../../assets/sounds/colors/Rod.mp3";
// @ts-ignore
import sortSfx from "../../../assets/sounds/colors/Sort.mp3";

// @ts-ignore
import zeroSfx from "../../../assets/sounds/numbers/0.mp3";
// @ts-ignore
import oneSfx from "../../../assets/sounds/numbers/1.mp3";
// @ts-ignore
import twoSfx from "../../../assets/sounds/numbers/2.mp3";
// @ts-ignore
import threeSfx from "../../../assets/sounds/numbers/3.mp3";
// @ts-ignore
import fourSfx from "../../../assets/sounds/numbers/4.mp3";
// @ts-ignore
import fiveSfx from "../../../assets/sounds/numbers/5.mp3";
// @ts-ignore
import sixSfx from "../../../assets/sounds/numbers/6.mp3";
// @ts-ignore
import sevenSfx from "../../../assets/sounds/numbers/7.mp3";
// @ts-ignore
import eightSfx from "../../../assets/sounds/numbers/8.mp3";
// @ts-ignore
import nineSfx from "../../../assets/sounds/numbers/9.mp3";
// @ts-ignore
import tenSfx from "../../../assets/sounds/numbers/10.mp3";
// @ts-ignore
import elevenSfx from "../../../assets/sounds/numbers/11.mp3";
// @ts-ignore
import twelveSfx from "../../../assets/sounds/numbers/12.mp3";
// @ts-ignore
import thirteenSfx from "../../../assets/sounds/numbers/13.mp3";
// @ts-ignore
import fourteenSfx from "../../../assets/sounds/numbers/14.mp3";
// @ts-ignore
import fifteenSfx from "../../../assets/sounds/numbers/15.mp3";
// @ts-ignore
import sixteenSfx from "../../../assets/sounds/numbers/16.mp3";
// @ts-ignore
import seventeenSfx from "../../../assets/sounds/numbers/17.mp3";
// @ts-ignore
import eighteenSfx from "../../../assets/sounds/numbers/18.mp3";
// @ts-ignore
import nineteenSfx from "../../../assets/sounds/numbers/19.mp3";
// @ts-ignore
import twentySfx from "../../../assets/sounds/numbers/20.mp3";
// @ts-ignore
import twentyOneSfx from "../../../assets/sounds/numbers/21.mp3";
// @ts-ignore
import twentyTwoSfx from "../../../assets/sounds/numbers/22.mp3";
// @ts-ignore
import twentyThreeSfx from "../../../assets/sounds/numbers/23.mp3";
// @ts-ignore
import twentyFourSfx from "../../../assets/sounds/numbers/24.mp3";
// @ts-ignore
import twentyFiveSfx from "../../../assets/sounds/numbers/25.mp3";
// @ts-ignore
import twentySixSfx from "../../../assets/sounds/numbers/26.mp3";
// @ts-ignore
import twentySevenSfx from "../../../assets/sounds/numbers/27.mp3";
// @ts-ignore
import twentyEightSfx from "../../../assets/sounds/numbers/28.mp3";
// @ts-ignore
import twentyNineSfx from "../../../assets/sounds/numbers/29.mp3";
// @ts-ignore
import thirtySfx from "../../../assets/sounds/numbers/30.mp3";
// @ts-ignore
import overThirtySfx from "../../../assets/sounds/numbers/Over30.mp3";

// @ts-ignore
import soyeSfx from "../../../assets/sounds/numbers/Soye.mp3";
// @ts-ignore
import lamSfx from "../../../assets/sounds/numbers/Lam.mp3";
// @ts-ignore
import sauSfx from "../../../assets/sounds/numbers/Sau.mp3";

import {
  arrowForwardOutline,
  arrowBackOutline,
  checkmarkOutline,
} from "ionicons/icons";

import ObservationButtonGroup from "./ObservationButtonGroup";
import ObservationButtonGroupMultiselect from "./ObservationButtonGroupMultiselect";
import BottomNavigationButtons from "./BottomNavigationButtons";
import NumberButtonsSimple from "./NumberButtonsSimple";
import NumberButtonsAdvanced from "./NumberButtonsAdvanced";

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
  sort: "sort",
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
  gruppeSauFargePaBjelleslips: 2,
  gruppeSauFargePaEiermerke: 3,
  rovdyrType: 4,
  skadetSauTypeSkade: 5,
  skadetSauFargePaSau: 6,
  skadetSauFargePaEiermerke: 7,
  dodSauDodsarsak: 8,
  dodSauFargePaSau: 9,
  dodSauFargePaEiermerke: 10,
};

const allFinalModalSlidesId = [
  allModalSlidesId["gruppeSauFargePaEiermerke"],
  allModalSlidesId["rovdyrType"],
  allModalSlidesId["skadetSauFargePaEiermerke"],
  allModalSlidesId["dodSauFargePaEiermerke"],
];

const allModalSlidesHeaders = [
  "Type observasjon",

  "Farge på sauene",
  "Farge på bjelleslipsene",
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
    fargePaSoye: { hvitOrGra: 0, brun: 0, sort: 0 },
    fargePaLam: { hvitOrGra: 0, brun: 0, sort: 0 },
    fargePaBjelleslips: {
      rod: 0,
      bla: 0,
      gulOrIngen: 0,
      gronn: 0,
    },
    fargePaEiermerke: [],
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

// This is the supervision modal; it contains all buttons and steps for registering an observation
const SupervisionModal: React.FC<SupervisionModalProps> = ({
  modalOpen,
  setModalOpen,
  saveObservation,
}) => {
  const [playZeroSfx, playZeroSfxData] = useSound(zeroSfx);
  const [playOneSfx, playOneSfxData] = useSound(oneSfx);
  const [playTwoSfx, playTwoSfxData] = useSound(twoSfx);
  const [playThreeSfx, playThreeSfxData] = useSound(threeSfx);
  const [playFourSfx, playFourSfxData] = useSound(fourSfx);
  const [playFiveSfx, playFiveSfxData] = useSound(fiveSfx);
  const [playSixSfx, playSixSfxData] = useSound(sixSfx);
  const [playSevenSfx, playSevenSfxData] = useSound(sevenSfx);
  const [playEightSfx, playEightSfxData] = useSound(eightSfx);
  const [playNineSfx, playNineSfxData] = useSound(nineSfx);
  const [playTenSfx, playTenSfxData] = useSound(tenSfx);
  const [playElevenSfx, playElevenSfxData] = useSound(elevenSfx);
  const [playTwelveSfx, playTwelveSfxData] = useSound(twelveSfx);
  const [playThirteenSfx, playThirteenSfxData] = useSound(thirteenSfx);
  const [playFourteenSfx, playFourteenSfxData] = useSound(fourteenSfx);
  const [playFifteenSfx, playFifteenSfxData] = useSound(fifteenSfx);
  const [playSixteenSfx, playSixteenSfxData] = useSound(sixteenSfx);
  const [playSeventeenSfx, playSeventeenSfxData] = useSound(seventeenSfx);
  const [playEighteenSfx, playEighteenSfxData] = useSound(eighteenSfx);
  const [playNineteenSfx, playNineteenSfxData] = useSound(nineteenSfx);
  const [playTwentySfx, playTwentySfxData] = useSound(twentySfx);
  const [playTwentyOneSfx, playTwentyOneSfxData] = useSound(twentyOneSfx);
  const [playTwentyTwoSfx, playTwentyTwoSfxData] = useSound(twentyTwoSfx);
  const [playTwentyThreeSfx, playTwentyThreeSfxData] = useSound(twentyThreeSfx);
  const [playTwentyFourSfx, playTwentyFourSfxData] = useSound(twentyFourSfx);
  const [playTwentyFiveSfx, playTwentyFiveSfxData] = useSound(twentyFiveSfx);
  const [playTwentySixSfx, playTwentySixSfxData] = useSound(twentySixSfx);
  const [playTwentySevenSfx, playTwentySevenSfxData] = useSound(twentySevenSfx);
  const [playTwentyEightSfx, playTwentyEightSfxData] = useSound(twentyEightSfx);
  const [playTwentyNineSfx, playTwentyNineSfxData] = useSound(twentyNineSfx);
  const [playThirtySfx, playThirtySfxData] = useSound(thirtySfx);
  const [playOverThirtySfx, playOverThirtySfxData] = useSound(overThirtySfx);

  const numberSfx = [
    { play: playZeroSfx, duration: playZeroSfxData.duration },
    { play: playOneSfx, duration: playOneSfxData.duration },
    { play: playTwoSfx, duration: playTwoSfxData.duration },
    { play: playThreeSfx, duration: playThreeSfxData.duration },
    { play: playFourSfx, duration: playFourSfxData.duration },
    { play: playFiveSfx, duration: playFiveSfxData.duration },
    { play: playSixSfx, duration: playSixSfxData.duration },
    { play: playSevenSfx, duration: playSevenSfxData.duration },
    { play: playEightSfx, duration: playEightSfxData.duration },
    { play: playNineSfx, duration: playNineSfxData.duration },
    { play: playTenSfx, duration: playTenSfxData.duration },
    { play: playElevenSfx, duration: playElevenSfxData.duration },
    { play: playTwelveSfx, duration: playTwelveSfxData.duration },
    { play: playThirteenSfx, duration: playThirteenSfxData.duration },
    { play: playFourteenSfx, duration: playFourteenSfxData.duration },
    { play: playFifteenSfx, duration: playFifteenSfxData.duration },
    { play: playSixteenSfx, duration: playSixteenSfxData.duration },
    { play: playSeventeenSfx, duration: playSeventeenSfxData.duration },
    { play: playEighteenSfx, duration: playEighteenSfxData.duration },
    { play: playNineteenSfx, duration: playNineteenSfxData.duration },
    { play: playTwentySfx, duration: playTwentySfxData.duration },
    { play: playTwentyOneSfx, duration: playTwentyOneSfxData.duration },
    { play: playTwentyTwoSfx, duration: playTwentyTwoSfxData.duration },
    { play: playTwentyThreeSfx, duration: playTwentyThreeSfxData.duration },
    { play: playTwentyFourSfx, duration: playTwentyFourSfxData.duration },
    { play: playTwentyFiveSfx, duration: playTwentyFiveSfxData.duration },
    { play: playTwentySixSfx, duration: playTwentySixSfxData.duration },
    { play: playTwentySevenSfx, duration: playTwentySevenSfxData.duration },
    { play: playTwentyEightSfx, duration: playTwentyEightSfxData.duration },
    { play: playTwentyNineSfx, duration: playTwentyNineSfxData.duration },
    { play: playThirtySfx, duration: playThirtySfxData.duration },
    { play: playOverThirtySfx, duration: playOverThirtySfxData.duration },
  ];

  const [playSoyeSfx] = useSound(soyeSfx);
  const [playLamSfx] = useSound(lamSfx);
  const [playSauSfx] = useSound(sauSfx);

  const [playBlaSfx] = useSound(blaSfx);
  const [playBrunSfx] = useSound(brunSfx);
  const [playGronnSfx] = useSound(gronnSfx);
  const [playGulEllerBlankSfx] = useSound(gulEllerBlankSfx);
  const [playHvitEllerGraSfx] = useSound(hvitEllerGraSfx);
  const [playRodSfx] = useSound(rodSfx);
  const [playSortSfx] = useSound(sortSfx);

  const [shouldReadNumberOfSheepsToggle, setShouldReadNumberOfSheepsToggle] =
    useState<boolean>(true);

  const [shouldReadNumberOfTiesToggle, setShouldReadNumberOfTiesToggle] =
    useState<boolean>(true);

  const [shouldReadColorOfSheepsToggle, setShouldReadColorOfSheepsToggle] =
    useState<boolean>(true);

  const [shouldReadColorOfTiesToggle, setShouldReadColorOfTiesToggle] =
    useState<boolean>(true);

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

  // Følgende 4 funksjoner henter 4 ulike lokalt-lagrede variabler som bestemmer om taleopplesning skal være aktivt
  useIonViewWillEnter(async () => {
    let shouldReadNumberOfSheeps = true;
    let value;

    await SecureStoragePlugin.get({
      key: "shouldReadNumberOfSheeps",
    }).then((readValue) => (value = readValue.value));

    if (value) {
      try {
        shouldReadNumberOfSheeps = JSON.parse(value);
      } catch (err) {}
    }

    await SecureStoragePlugin.set({
      key: "shouldReadNumberOfSheeps",
      value: JSON.stringify(shouldReadNumberOfSheeps),
    });

    setShouldReadNumberOfSheepsToggle(shouldReadNumberOfSheeps);
  });

  useIonViewWillEnter(async () => {
    let shouldReadNumberOfTies = true;
    let value;

    await SecureStoragePlugin.get({
      key: "shouldReadNumberOfTies",
    }).then((readValue) => (value = readValue.value));

    if (value) {
      try {
        shouldReadNumberOfTies = JSON.parse(value);
      } catch (err) {}
    }

    await SecureStoragePlugin.set({
      key: "shouldReadNumberOfTies",
      value: JSON.stringify(shouldReadNumberOfTies),
    });

    setShouldReadNumberOfTiesToggle(shouldReadNumberOfTies);
  });

  useIonViewWillEnter(async () => {
    let shouldReadColorOfSheeps = true;
    let value;

    await SecureStoragePlugin.get({
      key: "shouldReadColorOfSheeps",
    }).then((readValue) => (value = readValue.value));

    if (value) {
      try {
        shouldReadColorOfSheeps = JSON.parse(value);
      } catch (err) {}
    }

    await SecureStoragePlugin.set({
      key: "shouldReadColorOfSheeps",
      value: JSON.stringify(shouldReadColorOfSheeps),
    });

    setShouldReadColorOfSheepsToggle(shouldReadColorOfSheeps);
  });

  useIonViewWillEnter(async () => {
    let shouldReadColorOfTies = true;
    let value;

    await SecureStoragePlugin.get({
      key: "shouldReadColorOfTies",
    }).then((readValue) => (value = readValue.value));

    if (value) {
      try {
        shouldReadColorOfTies = JSON.parse(value);
      } catch (err) {}
    }

    await SecureStoragePlugin.set({
      key: "shouldReadColorOfTies",
      value: JSON.stringify(shouldReadColorOfTies),
    });

    setShouldReadColorOfTiesToggle(shouldReadColorOfTies);
  });

  const calculateTotalSheep = () => {
    return (
      observationDetails["gruppeSau"]["fargePaSau"]["hvitOrGra"] +
      observationDetails["gruppeSau"]["fargePaSau"]["brun"] +
      observationDetails["gruppeSau"]["fargePaSau"]["sort"] +
      observationDetails["gruppeSau"]["fargePaLam"]["hvitOrGra"] +
      observationDetails["gruppeSau"]["fargePaLam"]["brun"] +
      observationDetails["gruppeSau"]["fargePaLam"]["sort"] +
      observationDetails["gruppeSau"]["fargePaSoye"]["hvitOrGra"] +
      observationDetails["gruppeSau"]["fargePaSoye"]["brun"] +
      observationDetails["gruppeSau"]["fargePaSoye"]["sort"]
    );
  };

  const calculateTotalSheepExcludingLambs = () => {
    return (
      observationDetails["gruppeSau"]["fargePaSau"]["hvitOrGra"] +
      observationDetails["gruppeSau"]["fargePaSau"]["brun"] +
      observationDetails["gruppeSau"]["fargePaSau"]["sort"] +
      observationDetails["gruppeSau"]["fargePaSoye"]["hvitOrGra"] +
      observationDetails["gruppeSau"]["fargePaSoye"]["brun"] +
      observationDetails["gruppeSau"]["fargePaSoye"]["sort"]
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
    newValue: string | string[] | number
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

  const isSlideActive = (slideIndex: number) => {
    if (!swiperInstance) {
      return false;
    }

    return slideIndex === swiperInstance.activeIndex;
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
              <div style={{ marginTop: "21.7%", marginBottom: "-25%" }}>
                <ObservationButtonGroup
                  observationButtonList={[
                    {
                      textContent: "Gruppe sau",
                      buttonId: allObservationTypes.gruppeSau,
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
              </div>
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
              <NumberButtonsAdvanced
                numberButtonList={[
                  {
                    textLabel: "Hvit/Grå",
                    playSound: playHvitEllerGraSfx,
                    buttonId: allSheepColorTypes.hvitOrGra,
                    currentValueFirst:
                      observationDetails["gruppeSau"]["fargePaSoye"][
                        "hvitOrGra"
                      ],
                    currentValueSecond:
                      observationDetails["gruppeSau"]["fargePaLam"][
                        "hvitOrGra"
                      ],
                    currentValueThird:
                      observationDetails["gruppeSau"]["fargePaSau"][
                        "hvitOrGra"
                      ],
                  },
                  {
                    textLabel: "Brun",
                    playSound: playBrunSfx,
                    buttonId: allSheepColorTypes.brun,
                    currentValueFirst:
                      observationDetails["gruppeSau"]["fargePaSoye"]["brun"],
                    currentValueSecond:
                      observationDetails["gruppeSau"]["fargePaLam"]["brun"],
                    currentValueThird:
                      observationDetails["gruppeSau"]["fargePaSau"]["brun"],
                  },
                  {
                    textLabel: "Sort",
                    playSound: playSortSfx,
                    buttonId: allSheepColorTypes.sort,
                    currentValueFirst:
                      observationDetails["gruppeSau"]["fargePaSoye"]["sort"],
                    currentValueSecond:
                      observationDetails["gruppeSau"]["fargePaLam"]["sort"],
                    currentValueThird:
                      observationDetails["gruppeSau"]["fargePaSau"]["sort"],
                  },
                ]}
                numberButtonsSfxActivated={shouldReadColorOfSheepsToggle}
                onValueChange={(
                  typeOfSheepId: string,
                  buttonId: string,
                  newValue: number
                ) => {
                  setObservationField(
                    ["gruppeSau", typeOfSheepId, buttonId],
                    newValue
                  );
                }}
                numberSfx={numberSfx}
                numberSfxActivated={shouldReadNumberOfSheepsToggle}
                firstCounterTopText="Trykk for å legge til en søye med denne fargen"
                firstCounterBottomText="Hold inne for å fjerne en søye med denne fargen"
                firstCounterTypeSfx={playSoyeSfx}
                secondCounterTopText="Trykk for å legge til et lam med denne fargen"
                secondCounterBottomText="Hold inne for å fjerne et lam med denne fargen"
                secondCounterTypeSfx={playLamSfx}
                thirdCounterTopText="Trykk for å legge til en generell sau (søyer/lam) med denne fargen"
                thirdCounterBottomText="Hold inne for å fjerne en sau med denne fargen"
                thirdCounterTypeSfx={playSauSfx}
                isSlideActive={isSlideActive(
                  allModalSlidesId["gruppeSauFargePaSau"]
                )}
              ></NumberButtonsAdvanced>
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
                    "Ønsker du å fullføre observasjonen? Du kan fremdeles registrere fargene på sauenes bjelleslips og eiermerker."
                  )
                }
              ></BottomNavigationButtons>
            </div>
          </SwiperSlide>

          {/* GRUPPE SAU -> FARGE PÅ BJELLESLIPS */}
          <SwiperSlide>
            <div style={{ height: "100%", width: "100%" }}>
              <NumberButtonsSimple
                numberButtonList={[
                  {
                    textLabel: "Rød",
                    playSound: playRodSfx,
                    buttonId: allTieColorTypes.rod,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaBjelleslips"][
                        "rod"
                      ],
                  },
                  {
                    textLabel: "Blå",
                    playSound: playBlaSfx,
                    buttonId: allTieColorTypes.bla,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaBjelleslips"][
                        "bla"
                      ],
                  },
                  {
                    textLabel: "Gul/Blank",
                    playSound: playGulEllerBlankSfx,
                    buttonId: allTieColorTypes.gulOrIngen,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaBjelleslips"][
                        "gulOrIngen"
                      ],
                  },
                  {
                    textLabel: "Grønn",
                    playSound: playGronnSfx,
                    buttonId: allTieColorTypes.gronn,
                    currentValue:
                      observationDetails["gruppeSau"]["fargePaBjelleslips"][
                        "gronn"
                      ],
                  },
                ]}
                numberButtonsSfxActivated={shouldReadColorOfTiesToggle}
                onValueChange={(buttonId: string, newValue: number) => {
                  setObservationField(
                    ["gruppeSau", "fargePaBjelleslips", buttonId],
                    newValue
                  );
                }}
                numberSfx={numberSfx}
                numberSfxActivated={shouldReadNumberOfTiesToggle}
                maxTotalAmount={calculateTotalSheepExcludingLambs()}
                maxTotalAmountErrorMessage={
                  "Du registrerte " +
                  calculateTotalSheepExcludingLambs() +
                  " sau (lam ekskludert), og kan derfor ikke ha flere bjelleslips enn dette."
                }
                counterTopText="Trykk for å legge til et bjelleslips med denne fargen"
                counterBottomText="Hold inne i minst 1 sekund for å fjerne et bjelleslips med denne fargen"
                isSlideActive={isSlideActive(
                  allModalSlidesId["gruppeSauFargePaBjelleslips"]
                )}
              ></NumberButtonsSimple>
              <BottomNavigationButtons
                prevButtonLabel="Tilbake"
                prevButtonOnClick={() => {
                  goToPreviousSlide();
                }}
                prevButtonIcon={arrowBackOutline}
                nextButtonLabel="Eiermerke"
                nextButtonOnClick={() => goToNextSlide()}
                nextButtonIcon={arrowForwardOutline}
                finishButtonLabel="Fullfør observasjon"
                finishButtonIcon={checkmarkOutline}
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
              <ObservationButtonGroupMultiselect
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
                    textContent: "Sort",
                    buttonId: allOwnerColorTypes.sort,
                  },
                ]}
                onActiveChange={(newActiveButtons) =>
                  setObservationField(
                    ["gruppeSau", "fargePaEiermerke"],
                    newActiveButtons
                  )
                }
                activeButtons={
                  observationDetails["gruppeSau"]["fargePaEiermerke"]
                }
              ></ObservationButtonGroupMultiselect>

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
                    textContent: "Sort",
                    buttonId: allOwnerColorTypes.sort,
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
                    textContent: "Sort",
                    buttonId: allOwnerColorTypes.sort,
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
