import React, { useEffect, useState } from "react";
import "./board.scss";
import Tile from "../tile/tile";
import TimerBar from "../timer-bar/timer-bar";
import Toaster from "../toaster/toaster";
import { getClosestDivisors, shuffle, TILE_ICONS } from "../../util";

type BoardProps = {
  boardSize: number;
};

function Board({ boardSize }: BoardProps) {
  // *** CONFIG VARS ***

  // Variable for toggling shuffling on/off. Having a non-shuffled list is useful for debugging.
  const DO_SHUFFLE_TILES = true;
  // Duration a new board of tiles is revealed for
  const REVEAL_DURATION = 5000;
  // Time before a wrongful selection dissapears
  const WRONG_SELECTION_VIEW_DURATION = 1500;
  // Discussion Point: Should a correct selection cost an attempt?
  const USE_ATTEMPT_ON_SUCCESS = false;
  // Discussion Point: Should points reset when starting a new game?
  const RESET_POINTS_ON_GAME_END = false;
  // *** END CONFIG VARS ***

  // Initial indexes for distribution of tiles. This will later be randomized for games to be... Well, playable.
  const initialTileIndexes: number[] = [];

  for (let i = 0; i < boardSize * 2; i++) {
    initialTileIndexes.push(i);
  }
  const [tileIndexes, setTileIndexes] = useState<number[]>(initialTileIndexes);
  const [isFirstGame, setIsFirstGame] = useState<boolean>(true);
  // Discussion Point: How do attempts grow with number of pairs/boardsize?
  const [attempts, setAttempts] = useState<number>(boardSize);
  const [points, setPoints] = useState<number>(0);
  const [wins, setWins] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [startGameBtnLocked, setStartGameBtnLocked] = useState<boolean>(false);

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
      setWins((w) => w + 1);
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
    setWrongIndexes([]);
    setShownTiles([]);
    if (RESET_POINTS_ON_GAME_END) {
      setPoints(0);
    }
    setAttempts(6);
    setHasWon(false);
    setHasLost(false);
  };

  const startGame = () => {
    if (!startGameBtnLocked) {
      setStartGameBtnLocked(true);
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

      setTimeout(() => {
        setAllShown(false);
        setStartGameBtnLocked(false);
      }, REVEAL_DURATION);
    }
  };

  const onTileClick = (tileIndex: number, selectedIcon: string) => {
    let isWrongChoice = false;
    // If CurIconPair was not empty, we are doing the 2nd selection
    if (curIconPair !== "") {
      isWrongChoice = selectedIcon !== curIconPair;
      if (isWrongChoice) {
        // Lower attempts when making a mistake
        setAttempts(attempts - 1);
      } else {
        // Right choice! Add points
        setPoints(points + 10);
        if (USE_ATTEMPT_ON_SUCCESS) {
          // Lower attempts if we want to spend attempts on correct choices
          setAttempts(attempts - 1);
        }
      }
      // Clear after 2 selections
      setCurIconPair("");
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
      if (tile.index !== indexA && tile.index !== indexB) {
        newTilesShown.push(tile);
      }
    });
    // Remove wrong indexes after WRONG_SELECTION_VIEW_DURATION ms
    setTimeout(() => {
      setShownTiles(newTilesShown);
      setWrongIndexes([]);
      setGameLocked(false);
    }, WRONG_SELECTION_VIEW_DURATION);
  };

  // Get closest divisors of boardsize (ie 12 = 3 x 4)
  const divisors = getClosestDivisors(boardSize * 2);

  // Prefer wider layouts (ie 4 x 3 over 4 x 3)
  const gridColString = "1fr ".repeat(
    Math.round(Math.max(divisors.a, divisors.b))
  );

  const isMobile = window.innerWidth <= 800;

  // 80vw for mobile, 60vh for desktop
  const boardBaseSize = isMobile ? 80 : 60;

  const widthFactor =
    Math.max(divisors.a, divisors.b) / Math.min(divisors.a, divisors.b);

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
        bodyText="You ran out of attempts. Click New Game to play again"
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

      <button
        disabled={startGameBtnLocked}
        onClick={startGame}
        className={
          "begin-btn animate__animated " +
          (startGameBtnLocked ? " disabled" : "") +
          (isFirstGame && !startGameBtnLocked
            ? "animate__infinite animate__pulse"
            : "")
        }
      >
        {isFirstGame ? "Begin" : "New Game"}
      </button>

      <div className="timer-section">
        {allShown ? (
          <div className="timer-running-section">
            <div className="timer-text">Tiles Revealed!</div>
            <TimerBar duration={REVEAL_DURATION / 1000}></TimerBar>
          </div>
        ) : (
          <div className={"timer-bar-spacer"} />
        )}
      </div>

      <div
        style={{
          gridTemplateColumns: gridColString,
          width: boardBaseSize * widthFactor + (isMobile ? "vw" : "vh"),
          height: boardBaseSize + (isMobile ? "vw" : "vh"),
        }}
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
