import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import { Joystick } from "@/components/joystick";

// import { DevFucntions } from "./components/DevFucntions";
// import Joystick from "./components/joystick";
// import { GameWorld } from "./world/gameWorld";
import { GAME } from "@/scenes/sceneManager";

// import { BATTLE_MANAGER } from "./core/battleManager";
import { ASSET_MANAGER } from "./core/assetManager";
import { ASSET_SOURCES } from "./core/assetshandler/assetSources";

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

// const canvas2 = document.getElementById("canvas2") as HTMLCanvasElement;
// const c2 = canvas2.getContext("2d")!;
// canvas2.width = 430;
// canvas2.height = 430;

// const animage2 = () => {
//   c2.clearRect(0, 0, canvas2.width, canvas2.height);
//   c2.fillStyle = "white";
//   c2.fillRect(0, 0, canvas2.width, canvas2.height);

//   BATTLE_MANAGER.chipAreaSelect.availableChip.forEach((chip, index) => {
//     const colSize = 5; // how many chips per row
//     const cellSize = 51; // spacing

//     const row = Math.floor(index / colSize); // row number
//     const col = index % colSize; // column number

//     const x = col * cellSize;
//     const y = row * cellSize;

//     const chipIsSelected = BATTLE_MANAGER.chipAreaSelect.chipSelecteInTurn.includes(
//       chip.id
//     );
//     const chipIsUsed = BATTLE_MANAGER.chipAreaSelect.chipUsed.includes(chip.id);

//     chip.drawIcon(c2, x, y);
//     if (chipIsSelected) {
//       c2.fillStyle = "#ff000080";
//       c2.fillRect(x, y, 36, 32);
//     }
//     if (chipIsUsed) {
//       c2.fillStyle = "#00000090";
//       c2.fillRect(x, y, 36, 32);
//     }
//   });

//   requestAnimationFrame(animage2);
// };

// Bootstrap: register manifest and preload before starting loops
ASSET_MANAGER.registerManifest(ASSET_SOURCES);

const drawLoading = (loaded: number, total: number) => {
  const w = canvas.width - 40;
  const x = 20;
  const y = canvas.height / 2 - 10;
  const progress = total > 0 ? loaded / total : 0;
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "white";
  c.font = "24px Arial";
  c.fillText("Another Megaman BT fan game", x + 20, y - 50);
  c.fillStyle = "#222";
  c.fillRect(x, y, w, 20);
  c.fillStyle = "#4ade80"; // green
  c.fillRect(x, y, w * progress, 20);
  c.fillStyle = "#fff";
  c.font = "14px Arial";
  c.fillText(`Loading assets ${loaded}/${total}`, x + 130, y + 70);
};

(async () => {
  await ASSET_MANAGER.preloadAll(drawLoading);
  // Start loops when ready
  requestAnimationFrame(animage);
  // requestAnimationFrame(animage2);
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
    {/* <CanvasJoystick /> */}
  </StrictMode>
);

// //**--------------------------- */

const LOGICAL_WIDTH = 430;
const LOGICAL_HEIGHT = 430;

function fitScaleToWindow() {
  const { innerWidth: vw, innerHeight: vh } = window;
  const scale = Math.min(vw / LOGICAL_WIDTH, vh / LOGICAL_HEIGHT);
  return Math.max(1, scale); // avoid scaling below 1 unless you want to downscale
}

function setupCanvasResolution(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  logicalW: number,
  logicalH: number
) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const scale = fitScaleToWindow();

  const cssW = Math.round(logicalW * scale);
  const cssH = Math.round(logicalH * scale);

  // Set CSS size
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";

  // Set backing resolution
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);

  // Map logical coordinates to pixels:
  // 1 logical unit -> scale * dpr screen pixels
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);

  // For pixel art
  ctx.imageSmoothingEnabled = false;
}

// Call this on startup and on resize:
function handleResize() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  setupCanvasResolution(canvas, ctx, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  // If you also draw on canvas2, repeat for it:
  const canvas2 = document.getElementById("canvas") as HTMLCanvasElement;
  if (canvas2) {
    const ctx2 = canvas2.getContext("2d")!;
    setupCanvasResolution(canvas2, ctx2, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  }
}

window.addEventListener("resize", handleResize);
handleResize();
