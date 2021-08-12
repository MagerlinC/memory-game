import FirstIcon from "./assets/tile-icons/0.svg";
import SecondIcon from "./assets/tile-icons/1.svg";
import ThirdIcon from "./assets/tile-icons/2.svg";
import FourthIcon from "./assets/tile-icons/3.svg";
import FifthIcon from "./assets/tile-icons/4.svg";
import SixthIcon from "./assets/tile-icons/5.svg";
import SeventhIcon from "./assets/tile-icons/6.svg";
import EighthIcon from "./assets/tile-icons/7.svg";

export const TILE_ICONS = [
  FirstIcon,
  SecondIcon,
  ThirdIcon,
  FourthIcon,
  FifthIcon,
  SixthIcon,
  SeventhIcon,
  EighthIcon,
];

// Knuth Shuffle
export const shuffle = (array: Array<any>) => {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
