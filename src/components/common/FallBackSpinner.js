import React from "react";
const FallBackSpinner = () => {
  return (
    <div className="fallback-spinner app-loader">
      <div className="loading">
        <div className="effect-1 effects"></div>
        <div className="effect-2 effects"></div>
        <div className="effect-3 effects"></div>
      </div>
    </div>
  );
};

export default FallBackSpinner;
