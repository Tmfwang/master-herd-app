import { useEffect, useState } from "react";

import {
  IonRippleEffect,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";

import { RefresherEventDetail } from "@ionic/core";

import { chevronDownCircleOutline } from "ionicons/icons";

import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

import CounterButtonAdvanced from "./CounterButtonAdvanced";

import { numberButtonAdvancedType } from "../../../types";

const typeOfSheepIds = {
  fargePaSoye: "fargePaSoye",
  fargePaLam: "fargePaLam",
  fargePaSau: "fargePaSau",
};

interface NumberButtonsSimpleProps {
  numberButtonList: numberButtonAdvancedType[];
  numberButtonsSfxActivated: boolean;

  onValueChange: (
    typeOfSheepId: string,
    buttonId: string,
    newValue: number
  ) => void;

  numberSfx: { play: () => void; duration: number | null }[];
  numberSfxActivated: boolean;

  firstCounterTopText: string;
  firstCounterBottomText: string;

  firstCounterTypeSfx: () => void;
  secondCounterTopText: string;
  secondCounterBottomText: string;
  secondCounterTypeSfx: () => void;

  thirdCounterTopText: string;
  thirdCounterBottomText: string;
  thirdCounterTypeSfx: () => void;

  isSlideActive: boolean;
  initialActiveButton?: string;
}

const NumberButtonsSimple: React.FC<NumberButtonsSimpleProps> = ({
  numberButtonList,
  numberButtonsSfxActivated,
  onValueChange,
  numberSfx,
  numberSfxActivated,
  firstCounterTopText,
  firstCounterBottomText,
  firstCounterTypeSfx,
  secondCounterTopText,
  secondCounterBottomText,
  secondCounterTypeSfx,
  thirdCounterTopText,
  thirdCounterBottomText,
  thirdCounterTypeSfx,
  isSlideActive,
  initialActiveButton = numberButtonList[0].buttonId,
}) => {
  const [activeButton, setActiveButton] = useState<string>(initialActiveButton);
  const [prevPressedSheepType, setPrevPressedSheepType] = useState<string>("");

  const setNextButtonActive = (event: CustomEvent<RefresherEventDetail>) => {
    event.detail.complete();
    for (let i = 0; i < numberButtonList.length; i++) {
      let button = numberButtonList[i];
      if (button.buttonId === activeButton) {
        const nextButton = numberButtonList[(i + 1) % numberButtonList.length];

        setActiveButton(nextButton.buttonId);

        if (nextButton.playSound && numberButtonsSfxActivated) {
          nextButton.playSound();
        }

        break;
      }
    }
  };

  const onIncrement = (typeOfSheepId: string) => {
    for (let button of numberButtonList) {
      if (button.buttonId === activeButton) {
        let currentValue = 0;
        let typeSfx: () => void = () => {
          return;
        };

        switch (typeOfSheepId) {
          case typeOfSheepIds.fargePaSoye:
            currentValue = button.currentValueFirst;
            typeSfx = firstCounterTypeSfx;
            break;

          case typeOfSheepIds.fargePaLam:
            currentValue = button.currentValueSecond;
            typeSfx = secondCounterTypeSfx;
            break;

          case typeOfSheepIds.fargePaSau:
            currentValue = button.currentValueThird;
            typeSfx = thirdCounterTypeSfx;
            break;
        }

        onValueChange(typeOfSheepId, activeButton, currentValue + 1);
        hapticsImpactIncrement();

        if (numberSfxActivated) {
          numberSfx[Math.min(31, currentValue + 1)].play();

          // Plays the sfx of the type of sheep if the type of sheep is different from the previous
          const sfxDuration =
            numberSfx[Math.min(31, currentValue + 1)].duration;
          if (sfxDuration != null && typeOfSheepId !== prevPressedSheepType) {
            setPrevPressedSheepType(typeOfSheepId);
            setTimeout(() => typeSfx(), sfxDuration);
          }
        }
      }
    }
  };

  const onDecrement = (typeOfSheepId: string) => {
    for (let button of numberButtonList) {
      let currentValue = 0;
      let typeSfx: () => void = () => {
        return;
      };

      switch (typeOfSheepId) {
        case typeOfSheepIds.fargePaSoye:
          currentValue = button.currentValueFirst;
          typeSfx = firstCounterTypeSfx;
          break;

        case typeOfSheepIds.fargePaLam:
          currentValue = button.currentValueSecond;
          typeSfx = secondCounterTypeSfx;
          break;

        case typeOfSheepIds.fargePaSau:
          currentValue = button.currentValueThird;
          typeSfx = thirdCounterTypeSfx;
          break;
      }

      if (button.buttonId === activeButton && currentValue > 0) {
        if (numberSfxActivated) {
          numberSfx[Math.min(31, currentValue - 1)].play();

          // Plays the sfx of the type of sheep if the type of sheep is different from the previous
          const sfxDuration =
            numberSfx[Math.min(31, currentValue + 1)].duration;
          if (sfxDuration != null && typeOfSheepId !== prevPressedSheepType) {
            setPrevPressedSheepType(typeOfSheepId);
            setTimeout(() => typeSfx(), sfxDuration);
          }
        }

        onValueChange(typeOfSheepId, activeButton, currentValue - 1);
        hapticsImpactDecrement();
      }
    }
  };

  const hapticsImpactIncrement = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };

  const hapticsImpactDecrement = async () => {
    await Haptics.notification({ type: NotificationType.Warning });
  };

  return (
    <div style={{ height: "79%", width: "100%" }}>
      <IonRefresher
        slot="fixed"
        onIonRefresh={setNextButtonActive}
        closeDuration="1ms"
        snapbackDuration="1ms"
        disabled={!isSlideActive}
        pullFactor={0.5}
      >
        <IonRefresherContent
          pullingIcon={chevronDownCircleOutline}
          pullingText="<br/>"
        ></IonRefresherContent>
      </IonRefresher>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "-10px",
        }}
      >
        <div
          style={{
            ...buttonContainerStyle,
            paddingBottom: numberButtonList.length === 3 ? "3vw" : "6vw",
          }}
        >
          {numberButtonList.map((buttonProps: numberButtonAdvancedType) => {
            return (
              <div
                className="ion-activatable"
                style={{
                  ...buttonStyle,
                  background:
                    activeButton === buttonProps.buttonId ? "yellow" : "white",
                  width: 85 / numberButtonList.length + "vw",
                  height: 85 / numberButtonList.length + "vw",
                }}
                onClick={() => setActiveButton(buttonProps.buttonId)}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "5%",
                  }}
                >
                  <div
                    style={{
                      fontSize: numberButtonList.length === 3 ? "18px" : "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {buttonProps.textLabel}
                  </div>

                  <div style={lineStyle} />
                  <div
                    style={{
                      fontSize: "16px",
                      marginTop: "3px",
                    }}
                  >
                    Søyer: <b>{buttonProps.currentValueFirst}</b>
                    <br />
                    Lam: <b>{buttonProps.currentValueSecond}</b>
                    <br />
                    Sau: <b>{buttonProps.currentValueThird}</b>
                  </div>
                </div>
                <IonRippleEffect></IonRippleEffect>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: "14px", marginTop: "-5px", color: "grey" }}>
          Trykk eller sveip ned for å bytte farge
        </div>
      </div>
      <div style={{ width: "100%", height: "70%" }}>
        <CounterButtonAdvanced
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          topTextFirstButton={firstCounterTopText}
          bottomTextFirstButton={firstCounterBottomText}
          topTextSecondButton={secondCounterTopText}
          bottomTextSecondButton={secondCounterBottomText}
          topTextThirdButton={thirdCounterTopText}
          bottomTextThirdButton={thirdCounterBottomText}
        ></CounterButtonAdvanced>
      </div>
    </div>
  );
};

const buttonStyle = {
  border: "2px solid black",
  position: "relative" as "relative",
  overflow: "hidden",
  borderRadius: "15px",
  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.25)",
};

const buttonContainerStyle = {
  // height: "30%",
  width: "100%",
  display: "flex",
  padding: "6vw",
  paddingTop: "7.5vw",
  gap: "2vw",
};

const lineStyle = {
  border: "none",
  borderBottom: "1px solid black",
  width: "84%",
  marginRight: "8%",
  marginLeft: "8%",
  marginTop: "5px",
  marginBottom: "5px",
};

export default NumberButtonsSimple;
