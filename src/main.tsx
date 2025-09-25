import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// import { DevFucntions } from "./components/DevFucntions";
// import Joystick from "./components/joystick";
// import { GameWorld } from "./world/gameWorld";
import { GAME } from "./scenes/sceneManager";
import { FLOOR_MANAGER } from "./scenes/battleScene/sources/floorManager";
import { BATTLE_MANAGER } from "./scenes/battleScene/sources/battleManager";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d")!;
canvas.width = 430;
canvas.height = 430;

let lastTime = 0;
const animage = (timeStap: number) => {
  const deltaTime = timeStap - lastTime;
  lastTime = timeStap;
  c.clearRect(0, 0, canvas.width, canvas.height);

  GAME.draw(deltaTime);
  GAME.update(deltaTime);
  requestAnimationFrame(animage);
};

animage(0);

const canvas2 = document.getElementById("canvas2") as HTMLCanvasElement;
const c2 = canvas2.getContext("2d")!;
canvas2.width = 430;
canvas2.height = 430;

const animage2 = (timeStap: number) => {
  c2.clearRect(0, 0, canvas2.width, canvas2.height);
  c2.fillStyle = "white";
  c2.fillRect(0, 0, canvas2.width, canvas2.height);
  // print matrix

  // if (FLOOR_MANAGER.matrix) {
  //   FLOOR_MANAGER.matrix.forEach((row, indexY) => {
  //     row.forEach((floor, indexX) => {
  //       c2.fillStyle = floor.ocupated ? "blue" : "red";
  //       c2.fillRect(indexX * 51, indexY * 51, 50, 50);
  //     });
  //   });
  // }
  //  print floors
  // FLOOR_MANAGER.floors.forEach((floor) => {
  //   floor.draw(c2, 16.66);
  // });

  BATTLE_MANAGER.chipAreaSelect.availableChip.forEach((chip, index) => {
    const colSize = 5; // how many chips per row
    const cellSize = 51; // spacing

    const row = Math.floor(index / colSize); // row number
    const col = index % colSize; // column number

    const x = col * cellSize;
    const y = row * cellSize;

    const chipIsSelected = BATTLE_MANAGER.chipAreaSelect.chipSelecteInTurn.includes(
      chip.id
    );
    const chipIsUsed = BATTLE_MANAGER.chipAreaSelect.chipUsed.includes(chip.id);

    chip.drawIcon(c2, x, y);
    if (chipIsSelected) {
      c2.fillStyle = "#ff000080";
      c2.fillRect(x, y, 36, 32);
    }
    if (chipIsUsed) {
      c2.fillStyle = "#00000090";
      c2.fillRect(x, y, 36, 32);
    }
  });

  requestAnimationFrame(animage2);
};
animage2(0);

// document.getElementById("canvas").addEventListener("click", (e) => {
//   const rect = canvas.getBoundingClientRect();
//   const scaleX = canvas.width / rect.width;
//   const scaleY = canvas.height / rect.height;
//   // const x = (e.clientX - rect.left) * scaleX;
//   // const y = (e.clientY - rect.top) * scaleY;
//   // GAME.checkClick(x, y);
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <main className="bg-blue-200 w-[430px] "><DevFucntions /></main> */}
  </StrictMode>
);
