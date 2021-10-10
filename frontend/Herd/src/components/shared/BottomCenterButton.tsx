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
      <IonButton color="primary" onClick={onClick}>
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
  top: "90vh",
};

export default BottomCenterButton;
