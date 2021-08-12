import React from "react";
import "./tile.scss";

type TileProps = {
  iconPath: string;
  onClick: () => void;
  shown: boolean;
  wrong: boolean;
};

function Tile({ iconPath, onClick, shown, wrong }: TileProps) {
  return (
    <div
      onClick={onClick}
      className={"tile" + (shown ? " shown" : "") + (wrong ? " wrong" : "")}
    >
      <div className={"tile-icon-wrapper"}>
        {shown && (
          <img alt="tile-icon" className={"tile-icon"} src={iconPath}></img>
        )}
      </div>
    </div>
  );
}
export default Tile;
