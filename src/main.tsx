import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// import { DevFucntions } from "./components/DevFucntions";
// import Joystick from "./components/joystick";
// import { GameWorld } from "./world/gameWorld";
import { GAME } from "@/scenes/sceneManager";

import { BATTLE_MANAGER } from "./core/battleManager";
import { ASSET_MANAGER } from "./core/assetManager";
import { ASSET_SOURCES } from "./core/assetSources";

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

const canvas2 = document.getElementById("canvas2") as HTMLCanvasElement;
const c2 = canvas2.getContext("2d")!;
canvas2.width = 430;
canvas2.height = 430;

const animage2 = () => {
  c2.clearRect(0, 0, canvas2.width, canvas2.height);
  c2.fillStyle = "white";
  c2.fillRect(0, 0, canvas2.width, canvas2.height);

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

// Bootstrap: register manifest and preload before starting loops
ASSET_MANAGER.registerManifest(ASSET_SOURCES);
console.log("ASSET_MANAGER", ASSET_MANAGER);

const drawLoading = (loaded: number, total: number) => {
  const w = canvas.width - 40;
  const x = 20;
  const y = canvas.height / 2 - 10;
  const progress = total > 0 ? loaded / total : 0;
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "#222";
  c.fillRect(x, y, w, 20);
  c.fillStyle = "#4ade80"; // green
  c.fillRect(x, y, w * progress, 20);
  c.fillStyle = "#fff";
  c.font = "14px Arial";
  c.fillText(`Loading ${loaded}/${total}`, x, y + 40);
};

(async () => {
  await ASSET_MANAGER.preloadAll(drawLoading);
  // Start loops when ready
  requestAnimationFrame(animage);
  requestAnimationFrame(animage2);
})();

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
