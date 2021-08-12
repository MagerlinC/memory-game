import React, { useEffect, useState } from "react";
import "./toaster.scss";

type ToasterProps = {
  title: string;
  bodyText: string;
  shown: boolean;
  hideAfter: number;
};

function Toaster({ title, bodyText, shown, hideAfter }: ToasterProps) {
  const [hiddenBasedOnDuration, setHiddenBasedOnDuration] =
    useState<boolean>(false);

  useEffect(() => {
    if (shown) {
      setTimeout(() => setHiddenBasedOnDuration(true), hideAfter);
    } else {
      setHiddenBasedOnDuration(false);
    }
  }, [shown]);

  return shown && !hiddenBasedOnDuration ? (
    <div className="toaster">
      <div className="toaster-contents animate__animated animate__slideInUp">
        <div className="title">{title}</div>
        <div className="body">{bodyText}</div>
      </div>
    </div>
  ) : (
    <div className="empty"></div>
  );
}
export default Toaster;
