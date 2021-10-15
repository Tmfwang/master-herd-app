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

import { observationButtonType } from "../../../types";

interface ObservationButtonGroupProps {
  observationButtonList: observationButtonType[];
  onActiveChange: (buttonId: string) => void;
  activeButton: string;
}

const ObservationButtonGroup: React.FC<ObservationButtonGroupProps> = ({
  observationButtonList,
  onActiveChange,
  activeButton,
}) => {
  const handleButtonClick = (buttonId: string) => {
    onActiveChange(buttonId);
  };

  return (
    <div style={{ height: "79%" }}>
      <div style={buttonContainerStyle}>
        {observationButtonList.map((buttonProps: observationButtonType) => {
          return (
            <div
              className="ion-activatable"
              style={{
                ...buttonStyle,
                background:
                  activeButton === buttonProps.buttonId ? "yellow" : "white",
              }}
              onClick={() => handleButtonClick(buttonProps.buttonId)}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "26px",
                  fontWeight: "bold",
                }}
              >
                {buttonProps.textContent}
              </div>
              <IonRippleEffect></IonRippleEffect>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const buttonStyle = {
  width: "100%",
  height: "100%",
  border: "1px solid black",
  position: "relative" as "relative",
  overflow: "hidden",
  borderRadius: "15px",
  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.25)",
};

const buttonContainerStyle = {
  maxHeight: "100%",
  width: "100%",
  display: "grid",
  gridTemplateColumns: "38vw 38vw",
  gridTemplateRows: "38vw 38vw 38vw",
  padding: "9.5vw",
  paddingTop: "7.5vw",
  gap: "5vw",
};

export default ObservationButtonGroup;
