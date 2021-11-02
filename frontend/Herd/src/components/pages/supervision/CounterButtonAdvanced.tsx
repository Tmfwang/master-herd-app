import { IonRippleEffect } from "@ionic/react";

import useLongAndShortPress from "../../hooks/useLongAndShortPress";

const typeOfSheepIds = {
  fargePaSoye: "fargePaSoye",
  fargePaLam: "fargePaLam",
  fargePaSau: "fargePaSau",
};

interface CounterButtonProps {
  onIncrement: (typeOfSheepId: string) => void;
  onDecrement: (typeOfSheepId: string) => void;
  topTextFirstButton: string;
  bottomTextFirstButton: string;
  topTextSecondButton: string;
  bottomTextSecondButton: string;
  topTextThirdButton: string;
  bottomTextThirdButton: string;
}

// This is an advanced version of the counter button; it can be seen as a combination of three simple counter buttons.
// This is used to count sheep, female sheep and lambs.
const CounterButton: React.FC<CounterButtonProps> = ({
  onIncrement,
  onDecrement,
  topTextFirstButton,
  bottomTextFirstButton,
  topTextSecondButton,
  bottomTextSecondButton,
  topTextThirdButton,
  bottomTextThirdButton,
}) => {
  const longAndShortPressFirstButton = useLongAndShortPress(
    () => onDecrement(typeOfSheepIds.fargePaSoye),
    () => onIncrement(typeOfSheepIds.fargePaSoye),
    700
  );

  const longAndShortPressSecondButton = useLongAndShortPress(
    () => onDecrement(typeOfSheepIds.fargePaLam),
    () => onIncrement(typeOfSheepIds.fargePaLam),
    700
  );

  const longAndShortPressThirdButton = useLongAndShortPress(
    () => onDecrement(typeOfSheepIds.fargePaSau),
    () => onIncrement(typeOfSheepIds.fargePaSau),
    700
  );

  // Bolds and underlines specific words
  const formatText = (textString: string) => {
    const wordsToBold = ["fjerne"];
    const wordsToUnderline = ["sau", "lam", "søye"];

    const textArray = textString.split(" ");

    return (
      <span>
        {textArray.map((item, index) => (
          <>
            {!wordsToBold.includes(item.toLowerCase()) &&
              !wordsToUnderline.includes(item.toLowerCase()) &&
              item}
            {wordsToBold.includes(item.toLowerCase()) && <b>{item}</b>}
            {wordsToUnderline.includes(item.toLowerCase()) && (
              <u>{item}</u>
            )}{" "}
          </>
        ))}
      </span>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "6.5vw",
      }}
    >
      <div style={buttonStyle}>
        <div
          style={{
            width: "100%",
            height: "55%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              width: "50%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              borderRight: "2px solid black",
            }}
            className="ion-activatable"
            {...longAndShortPressFirstButton}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "13px",
              }}
            >
              <div
                style={{
                  marginTop: "10px",
                  marginBottom: "-25px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                {formatText(topTextFirstButton)}
              </div>
              <div style={{ fontSize: "100px" }}>+</div>

              <div style={{ marginTop: "-20px", fontSize: "12px" }}>
                {formatText(bottomTextFirstButton)}
              </div>
            </div>
            <IonRippleEffect></IonRippleEffect>
          </div>

          <div
            style={{
              width: "50%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
            className="ion-activatable"
            {...longAndShortPressSecondButton}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "12px",
              }}
            >
              <div
                style={{
                  marginTop: "10px",
                  marginBottom: "-25px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                {formatText(topTextSecondButton)}
              </div>
              <div style={{ fontSize: "100px" }}>+</div>

              <div style={{ marginTop: "-20px", fontSize: "12px" }}>
                {formatText(bottomTextSecondButton)}
              </div>
            </div>
            <IonRippleEffect></IonRippleEffect>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "45%",
            position: "relative",
            overflow: "hidden",
            borderTop: "2px solid black",
          }}
          className="ion-activatable"
          {...longAndShortPressThirdButton}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "13px",
            }}
          >
            <div
              style={{
                marginTop: "0px",
                marginBottom: "-25px",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              {formatText(topTextThirdButton)}
            </div>
            <div style={{ fontSize: "100px" }}>+</div>

            <div style={{ marginTop: "-25px", fontSize: "12px" }}>
              {formatText(bottomTextThirdButton)}
            </div>
          </div>
          <IonRippleEffect></IonRippleEffect>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "30px",
  border: "2px solid black",
  background: "white",
  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.25)",
  position: "relative" as "relative",
  overflow: "hidden",
};

export default CounterButton;
