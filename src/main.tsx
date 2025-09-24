import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// import { DevFucntions } from "./components/DevFucntions";
// import Joystick from "./components/joystick";
// import { GameWorld } from "./world/gameWorld";
import { GAME } from "./scenes/sceneManager";

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
    <main className="bg-blue-200 w-[430px] h-screen">
      {/* <DevFucntions /> */}
    </main>
  </StrictMode>
);
