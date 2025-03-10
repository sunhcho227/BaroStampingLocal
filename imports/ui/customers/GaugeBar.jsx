import React from "react";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";
// import GaugeBar from "/imports/ui/customers/GaugeBar.jsx";

const GaugeBar = ({ current, max }) => {
  const progressWidth = Math.min((current / max) * 100, 100); // 0~100%로 제한

  return (
    <div className="gauge-bar-container">
      <div
        className="gauge-bar-progress"
        style={{ width: `${progressWidth}%` }}
      />
    </div>
  );
};

export default GaugeBar;
