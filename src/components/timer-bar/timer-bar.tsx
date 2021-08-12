import React from "react";
import "./timer-bar.scss";

type TimerBarProps = {
  duration: number;
};

function TimerBar({ duration }: TimerBarProps) {
  const animationString = `roundtime calc(${duration} * 1s) linear forwards`;

  return (
    <div
      className="timer-bar"
      data-style="smooth"
      style={{ animation: animationString }}
    >
      <div className="inner"></div>
    </div>
  );
}
export default TimerBar;
