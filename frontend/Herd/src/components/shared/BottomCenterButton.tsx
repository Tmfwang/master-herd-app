import React from "react";
import { IonButton, IonIcon } from "@ionic/react";

interface BottomCenterButtonProps {
  buttonText: string;
  buttonIcon: any;
  buttonIconSlotPosition: string;
  onClick: () => void;
}

const BottomCenterButton: React.FC<BottomCenterButtonProps> = ({
  buttonText,
  buttonIcon,
  buttonIconSlotPosition,
  onClick,
}) => {
  return (
    <div style={buttonContainerStyle}>
      <IonButton
        color="primary"
        onClick={onClick}
        size="large"
        style={{
          boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.25)",
          fontSize: "16px",
        }}
      >
        <IonIcon slot={buttonIconSlotPosition} icon={buttonIcon} />
        {buttonText}
      </IonButton>
    </div>
  );
};

const buttonContainerStyle = {
  zIndex: 9999,
  position: "absolute" as "absolute",
  display: "flex",
  justifyContent: "center",
  width: "100vw",
  top: "88vh",
};

export default BottomCenterButton;
