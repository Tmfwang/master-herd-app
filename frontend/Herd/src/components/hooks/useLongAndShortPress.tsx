import { useState, useEffect } from "react";

export default function useLongAndShortPress(
  longPressCallback = () => {
    console.log("Long press callback");
  },
  shortPressCallback = () => {
    console.log("Short press callback");
  },
  ms = 1000
) {
  const [startLongPress, setStartLongPress] = useState(false);
  const [startShortPress, setStartShortPress] = useState(false);

  useEffect(() => {
    let timerId: any;

    if (startLongPress) {
      timerId = setTimeout(() => {
        setStartShortPress(false);
        setStartLongPress(false);
        longPressCallback();
      }, ms);
    } else if (startShortPress) {
      setStartShortPress(false);
      shortPressCallback();

      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress, startShortPress]);

  return {
    onMouseLeave: () => {
      setStartLongPress(false);
    },
    onTouchStart: () => {
      setStartLongPress(true);
      setStartShortPress(true);
    },
    onTouchEnd: () => {
      setStartLongPress(false);
    },

    onTouchMove: () => {
      setStartShortPress(false);
      setStartLongPress(false);
    },
  };
}
