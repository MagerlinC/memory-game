import React, { useEffect, useState } from "react";
import "./board.scss";
import Tile from "../tile/tile";
import TimerBar from "../timer-bar/timer-bar";
import Toaster from "../toaster/toaster";
import { shuffle, TILE_ICONS } from "../../util";

type BoardProps = {
  boardSize: number;
};

function Board({ boardSize }: BoardProps) {
  // Initial indexes for distribution of tiles. This will later be randomized for games to be... Well, playable.
  const initialTileIndexes: number[] = [];
  for (let i = 0; i < boardSize * 2; i++) {
    initialTileIndexes.push(i);
  }
  const [tileIndexes, setTileIndexes] = useState<number[]>(initialTileIndexes);

  // Variable for toggling shuffling on/off. Having a non-shuffled list is useful for debugging.
  const DO_SHUFFLE_TILES = true;

  const [isFirstGame, setIsFirstGame] = useState<boolean>(true);
  const [attempts, setAttempts] = useState<number>(6);
  const [points, setPoints] = useState<number>(0);
  const [wins, setWins] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [hasLost, setHasLost] = useState<boolean>(false);

  const [shownTiles, setShownTiles] = useState<
    { index: number; icon: string }[]
  >([]);
  const [curIconPair, setCurIconPair] = useState<string>("");
  //List holding indexes when a wrong selection is made
  const [wrongIndexes, setWrongIndexes] = useState<number[]>([]);

  const [allShown, setAllShown] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  // Locks click handlers. Useful when making wrong selections etc.
  const [gameLocked, setGameLocked] = useState<boolean>(false);

  // Side effect: When shown tiles are updated, check if we have won
  useEffect(() => {
    // We have won if all tiles are shown
    if (shownTiles.length === boardSize * 2) {
      setWins(wins + 1);
      setHasWon(true);
      setGameStarted(false);
    }
  }, [shownTiles]);

  useEffect(() => {
    // No more attempts, and haven't won
    if (attempts <= 0 && shownTiles.length !== boardSize * 2) {
      setHasLost(true);
      setGameStarted(false);
    }
  }, [attempts]);

  const clearForNewGame = () => {
    setShownTiles([]);
    setPoints(0);
    setAttempts(6);
    setHasWon(false);
    setHasLost(false);
  };

  const startGame = () => {
    if (DO_SHUFFLE_TILES) {
      // Shuffle the tiles for actual games
      const shuffledArray = shuffle(tileIndexes);
      setTileIndexes(shuffledArray);
    }
    if (isFirstGame) {
      setIsFirstGame(false);
    }
    clearForNewGame();
    setGameStarted(true);
    setAllShown(true);
    setTimeout(() => setAllShown(false), 5000);
  };

  const onTileClick = (tileIndex: number, selectedIcon: string) => {
    let isWrongChoice = false;
    // If CurIconPair was not empty, we are doing the 2nd selection
    if (curIconPair !== "") {
      isWrongChoice = selectedIcon !== curIconPair;
      if (!isWrongChoice) {
        // Right choice! Add points
        setPoints(points + 10);
      }
      // Clear after 2 selections
      setCurIconPair("");
      setAttempts(attempts - 1);
    } else {
      setCurIconPair(selectedIcon);
    }
    // Always show new tiles, even if we get it wrong
    const previousSelection = shownTiles[shownTiles.length - 1];
    const newTilesShown = [...shownTiles];
    newTilesShown.push({ index: tileIndex, icon: selectedIcon });
    setShownTiles(newTilesShown);

    if (isWrongChoice) {
      registerWrongChoice(tileIndex, previousSelection.index);
    }
  };

  const registerWrongChoice = (indexA: number, indexB: number) => {
    // Set wrong indexes to show red color
    setWrongIndexes([indexA, indexB]);
    setGameLocked(true);

    const newTilesShown: { index: number; icon: string }[] = [];
    shownTiles.forEach((tile) => {
      // Only carry over indexes that were not the two wrong choices
      if (tile.index != indexA && tile.index != indexB) {
        newTilesShown.push(tile);
      }
    });
    // Remove wrong indexes after 2500 ms
    setTimeout(() => {
      setShownTiles(newTilesShown);
      setWrongIndexes([]);
      setGameLocked(false);
    }, 2000);
  };

  // Dynamic amount of cols based on board size
  const gridColString = "1fr ".repeat(boardSize / 2);

  return (
    <div className="board">
      <Toaster
        shown={hasWon}
        title="Good job, you win!"
        bodyText="Your next game is ready!"
        hideAfter={5000}
      />
      <Toaster
        shown={hasLost}
        title="Aww, you lost!"
        bodyText="Click New Game to play again"
        hideAfter={5000}
      />
      <div className={"game-stats"}>
        <div className="attempts-text">
          <span className="stats-text">Attempts: </span>
          {attempts}
        </div>
        <div className="attempts-text">
          <span className="stats-text">Points: </span>
          {points}
        </div>
        <div className="attempts-text">
          <span className="stats-text">Wins: </span>
          {wins}
        </div>
      </div>

      <button onClick={startGame} className="begin-btn">
        {isFirstGame ? "Begin" : "New Game"}
      </button>

      <div className="timer-section">
        {allShown ? (
          <div className="timer-running-section">
            <div className="timer-text">Tiles Revealed!</div>
            <TimerBar duration={5}></TimerBar>
          </div>
        ) : (
          <div className={"timer-bar-spacer"} />
        )}
      </div>

      <div
        style={{ gridTemplateColumns: gridColString }}
        className={"board-tiles"}
      >
        {tileIndexes.map((index) => (
          <Tile
            key={"tile" + index}
            wrong={
              wrongIndexes.find((tileIndex) => tileIndex === index) != null
            }
            iconPath={TILE_ICONS[Math.floor(index / 2)]}
            onClick={() =>
              // Only fire onClicks once the game has started, and all tiles are done being shown
              !gameLocked &&
              gameStarted &&
              !allShown &&
              // Don't fire clicks on tiles that are already shown
              shownTiles.find((shownTile) => shownTile.index === index) == null
                ? onTileClick(index, TILE_ICONS[Math.floor(index / 2)])
                : undefined
            }
            shown={
              allShown ||
              shownTiles.find((shownTile) => shownTile.index === index) != null
            }
          />
        ))}
      </div>
    </div>
  );
}
export default Board;
