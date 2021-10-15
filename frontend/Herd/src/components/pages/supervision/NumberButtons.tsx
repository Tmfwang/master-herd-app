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
} from "@ionic/react";

import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

import CounterButton from "./CounterButton";

import { numberButtonType } from "../../../types";

interface NumberButtonsProps {
  numberButtonList: numberButtonType[];
  onValueChange: (buttonId: string, newValue: number) => void;
  counterTopText: string;
  counterBottomText: string;
  initialActiveButton?: string;
  maxTotalAmount?: number;
  maxTotalAmountErrorMessage?: string;
}

const NumberButtons: React.FC<NumberButtonsProps> = ({
  numberButtonList,
  onValueChange,
  counterTopText,
  counterBottomText,
  initialActiveButton = numberButtonList[0].buttonId,
  maxTotalAmount,
  maxTotalAmountErrorMessage = "Du kan ikke ha et totalt antall større enn " +
    maxTotalAmount,
}) => {
  const [activeButton, setActiveButton] = useState<string>(initialActiveButton);
  const [presentToast] = useIonToast();

  const onIncrement = () => {
    for (let button of numberButtonList) {
      if (button.buttonId === activeButton) {
        if (
          maxTotalAmount === undefined ||
          maxTotalAmount > calculateCurrentAmount()
        ) {
          onValueChange(activeButton, button.currentValue + 1);
          hapticsImpactIncrement();
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
                    fontSize: numberButtonList.length === 3 ? "18px" : "16px",
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
      <div style={{ width: "100%", height: "70%" }}>
        <CounterButton
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          topText={counterTopText}
          bottomText={counterBottomText}
        ></CounterButton>
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

export default NumberButtons;
