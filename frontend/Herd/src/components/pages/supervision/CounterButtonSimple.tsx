import { IonRippleEffect } from "@ionic/react";

import useLongAndShortPress from "../../hooks/useLongAndShortPress";

interface CounterButtonProps {
  onIncrement: () => void;
  onDecrement: () => void;
  topText: string;
  bottomText: string;
}

// This is a simple button used for counting up and down
const CounterButton: React.FC<CounterButtonProps> = ({
  onIncrement,
  onDecrement,
  topText,
  bottomText,
}) => {
  const longAndShortPress = useLongAndShortPress(
    onDecrement,
    onIncrement,
    1000
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "6.5vw",
      }}
    >
      <div
        className="ion-activatable"
        style={buttonStyle}
        {...longAndShortPress}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              marginTop: "30px",
              marginBottom: "-35px",
              fontWeight: "bold",
            }}
          >
            {topText}
          </div>
          <div style={{ fontSize: "200px" }}>+</div>

          <div style={{ marginTop: "-20px", fontSize: "16px" }}>
            {bottomText.split("fjerne")[0] + " "}
            <b>fjerne</b>
            {" " + bottomText.split("fjerne")[1]}
          </div>
        </div>
        <IonRippleEffect></IonRippleEffect>
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
  paddingLeft: "30px",
  paddingRight: "30px",
};

export default CounterButton;
