import { IonRippleEffect, IonCheckbox } from "@ionic/react";

import { observationButtonType } from "../../../types";

interface ObservationButtonGroupMultiselectProps {
  observationButtonList: observationButtonType[];
  onActiveChange: (newActiveButtons: string[]) => void;
  activeButtons: string[];
}

// This component contains a simple set of buttons where multiple can be selected
const ObservationButtonGroupMultiselect: React.FC<ObservationButtonGroupMultiselectProps> =
  ({ observationButtonList, onActiveChange, activeButtons }) => {
    const handleButtonClick = (buttonId: string) => {
      const newActiveButtons = [...activeButtons];

      const index = newActiveButtons.indexOf(buttonId);
      if (index > -1) {
        newActiveButtons.splice(index, 1);
      } else {
        newActiveButtons.push(buttonId);
      }

      onActiveChange(newActiveButtons);
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
                  background: activeButtons.includes(buttonProps.buttonId)
                    ? "yellow"
                    : "white",
                }}
                onClick={() => handleButtonClick(buttonProps.buttonId)}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "60%",
                    transform: "translate(-50%, -60%)",
                    fontSize: "26px",
                    fontWeight: "bold",
                  }}
                >
                  {buttonProps.textContent}

                  <div style={{ marginTop: "10px" }}>
                    <IonCheckbox
                      mode="ios"
                      checked={activeButtons.includes(buttonProps.buttonId)}
                    />
                  </div>
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

export default ObservationButtonGroupMultiselect;
