// This is not great, and is kind of tedious to maintain.
// There are ways to dynamically fetch a list of icons (such as using WebPack's require.context), but I did not want to spend time there.
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
// Get the two closest divisors of a given number.
// For example, given 12, return 3 and 4.
export const getClosestDivisors = (num: number): { a: number; b: number } => {
  let lo = 1;
  let hi = num;
  let divA = NaN;
  let divB = NaN;
  while (hi >= lo) {
    const product = lo * hi;
    if (product === num) {
      divA = lo;
      divB = hi;
      // When we hit a match, try next from hi and down
      hi--;
    } else if (product > num) {
      // Too big, reduce hi
      hi--;
    } else {
      // Too small, raise lo
      lo++;
    }
  }
  console.log(num, divA, divB);
  return { a: divA, b: divB };
};
