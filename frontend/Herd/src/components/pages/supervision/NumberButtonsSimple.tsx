import { useEffect, useState } from "react";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  useIonAlert,
  useIonToast,
  IonRippleEffect,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";

import { RefresherEventDetail } from "@ionic/core";

import { chevronDownCircleOutline } from "ionicons/icons";

import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

import CounterButtonSimple from "./CounterButtonSimple";

import { numberButtonType } from "../../../types";

interface NumberButtonsSimpleProps {
  numberButtonList: numberButtonType[];
  numberButtonsSfxActivated: boolean;

  onValueChange: (buttonId: string, newValue: number) => void;

  numberSfx: { play: () => void; duration: number | null }[];
  numberSfxActivated: boolean;

  counterTopText: string;
  counterBottomText: string;
  isSlideActive?: boolean;
  initialActiveButton?: string;
  maxTotalAmount?: number;
  maxTotalAmountErrorMessage?: string;
}

const NumberButtonsSimple: React.FC<NumberButtonsSimpleProps> = ({
  numberButtonList,
  numberButtonsSfxActivated,
  onValueChange,
  numberSfx,
  numberSfxActivated,
  counterTopText,
  counterBottomText,
  isSlideActive = false,
  initialActiveButton = numberButtonList[0].buttonId,
  maxTotalAmount,
  maxTotalAmountErrorMessage = "Du kan ikke ha et totalt antall større enn " +
    maxTotalAmount,
}) => {
  const [activeButton, setActiveButton] = useState<string>(initialActiveButton);
  const [presentToast] = useIonToast();

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

  const onIncrement = () => {
    for (let button of numberButtonList) {
      if (button.buttonId === activeButton) {
        if (
          maxTotalAmount === undefined ||
          maxTotalAmount > calculateCurrentAmount()
        ) {
          onValueChange(activeButton, button.currentValue + 1);
          hapticsImpactIncrement();

          if (numberSfxActivated) {
            numberSfx[Math.min(31, button.currentValue + 1)].play();
          }
        } else {
          presentToast({
            header: "Maks antall nådd",
            message: maxTotalAmountErrorMessage,
            duration: 5000,
          });
        }
      }
    }
  };

  const onDecrement = () => {
    for (let button of numberButtonList) {
      if (button.buttonId === activeButton && button.currentValue > 0) {
        onValueChange(activeButton, button.currentValue - 1);
        hapticsImpactDecrement();

        if (numberSfxActivated) {
          numberSfx[Math.min(31, button.currentValue - 1)].play();
        }
      }
    }
  };

  const calculateCurrentAmount = () => {
    let currentAmount = 0;

    for (let button of numberButtonList) {
      currentAmount += button.currentValue;
    }

    return currentAmount;
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
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            ...buttonContainerStyle,
            paddingBottom: numberButtonList.length === 3 ? "3vw" : "6vw",
          }}
        >
          {numberButtonList.map((buttonProps: numberButtonType) => {
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
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {buttonProps.currentValue}
                  </div>
                </div>
                <IonRippleEffect></IonRippleEffect>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: "14px", marginTop: "-17px", color: "grey" }}>
          Trykk eller sveip ned for å bytte farge
        </div>
      </div>
      <div style={{ width: "100%", height: "70%" }}>
        <CounterButtonSimple
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          topText={counterTopText}
          bottomText={counterBottomText}
        ></CounterButtonSimple>
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
  marginBottom: "9px",
};

export default NumberButtonsSimple;
