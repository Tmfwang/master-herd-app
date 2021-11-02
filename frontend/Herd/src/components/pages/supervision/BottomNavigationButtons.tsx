import { IonButton, IonIcon } from "@ionic/react";

interface BottomNavigationButtonsProps {
  prevButtonLabel?: string;
  nextButtonLabel?: string;
  finishButtonLabel?: string;
  prevButtonOnClick?: () => void;
  nextButtonOnClick?: () => void;
  finishButtonOnClick?: () => void;
  prevButtonIcon?: any;
  nextButtonIcon?: any;
  finishButtonIcon?: any;
  prevButtonDisabled?: boolean;
  nextButtonDisabled?: boolean;
  finishButtonDisabled?: boolean;
}

// This is a component containing navigation buttons such as "previous", "next" and "finish"
const BottomNavigationButtons: React.FC<BottomNavigationButtonsProps> = ({
  prevButtonLabel,
  nextButtonLabel,
  finishButtonLabel,
  prevButtonOnClick,
  nextButtonOnClick,
  finishButtonOnClick,
  prevButtonIcon,
  nextButtonIcon,
  finishButtonIcon,
  prevButtonDisabled = false,
  nextButtonDisabled = false,
  finishButtonDisabled = false,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100vw",
          height: "10%",
          gap: "5vw",
          padding: "9.5vw",
          paddingTop: finishButtonLabel ? "0px" : "5%",
          paddingBottom: "5px",
        }}
      >
        <div style={{ width: "50%" }}>
          {prevButtonLabel && (
            <IonButton
              expand="block"
              size="large"
              style={{
                boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.25)",
                fontSize: "16.5px",
              }}
              onClick={prevButtonOnClick}
              disabled={prevButtonDisabled}
            >
              {prevButtonLabel}
              {prevButtonIcon && <IonIcon slot="start" icon={prevButtonIcon} />}
            </IonButton>
          )}
        </div>
        <div style={{ width: "50%" }}>
          {nextButtonLabel && (
            <IonButton
              expand="block"
              size="large"
              style={{
                boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.25)",
                fontSize: "16.5px",
              }}
              onClick={nextButtonOnClick}
              disabled={nextButtonDisabled}
            >
              {nextButtonLabel}
              {nextButtonIcon && <IonIcon slot="end" icon={nextButtonIcon} />}
            </IonButton>
          )}
        </div>
      </div>
      <div style={{ width: "100vw", height: "10%" }}>
        <div style={{ width: "81vw", margin: "auto" }}>
          {finishButtonLabel && (
            <IonButton
              expand="block"
              size="large"
              style={{
                boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.25)",
                fontSize: "16.5px",
              }}
              onClick={finishButtonOnClick}
              disabled={finishButtonDisabled}
            >
              {finishButtonLabel}
              {finishButtonIcon && (
                <IonIcon slot="start" icon={finishButtonIcon} />
              )}
            </IonButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigationButtons;
