import { WorldScene } from "./worldScene/worldScene";
import { BattleScene } from "./battleScene/battleScene";
import { HomeScene } from "./homeScene/homeScene";
import { OptionScene } from "./optionScene/optionScene";
import { FolderScene } from "./folderScene/folderScene";
import { GameOverScene } from "./GameOverScene/gameOverScene";
import { INPUT_MANAGER } from "../input/inputManager";
import { JOYSTICK_MANAGER } from "./joysTickManager";

export class SceneManager {
  c: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  static instance: SceneManager | null = null;

  currentSceneIndex = "battleScene";
  previousScene = "homeScene";
  statesKeys = {
    homeScene: "homeScene",
    worldScene: "worldScene",
    battleScene: "battleScene",
    optionScene: "optionScene",
    folderScene: "folderScene",
    gameOverScene: "gameOverScene",
  };
  scenes = {
    homeScene: new HomeScene(),
    worldScene: new WorldScene(),
    battleScene: new BattleScene(),
    optionScene: new OptionScene(),
    folderScene: new FolderScene(),
    gameOverScene: new GameOverScene(),
  };
  currentScene = this.scenes[this.currentSceneIndex];

  //

  static getInstance() {
    if (!this.instance) {
      this.instance = new SceneManager();
    }
    return this.instance;
  }
  constructor() {
    this.currentScene.in();

    INPUT_MANAGER.setState(this.currentScene.nameScene);
    JOYSTICK_MANAGER.draw();
    // this.currentScene.in();
    document.getElementById("canvas").addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      // Convert from client coords -> device pixels
      const deviceScaleX = this.canvas.width / rect.width; // ~ dpr
      const deviceScaleY = this.canvas.height / rect.height; // ~ dpr

      const dx = (e.clientX - rect.left) * deviceScaleX;
      const dy = (e.clientY - rect.top) * deviceScaleY;

      // Now invert the canvas transform (we set it with ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0))
      const m = this.c.getTransform();
      const logicalX = dx / m.a; // m.a = scaleX * dpr
      const logicalY = dy / m.d; // m.d = scaleY * dpr

      // entry of my aplicacions
      //-------------

      this.currentScene.checkClick(logicalX, logicalY);
      //-------------
    });
    INPUT_MANAGER.in();
  }

  update(deltaTime: number) {
    this.currentScene.update(deltaTime, this.c);
  }

  draw(deltaTime: number) {
    this.currentScene.draw(deltaTime, this.c, this.canvas);
    // BATTLE_MANAGER.draw(this.c, deltaTime);
    //
  }
  changeScene(newScene: string) {
    if (!this.scenes[newScene]) {
      return;
    }

    if (this.currentSceneIndex !== newScene) {
      this.currentScene.out();
      this.previousScene = this.currentSceneIndex;
      this.currentSceneIndex = newScene;
      this.currentScene = this.scenes[newScene];

      INPUT_MANAGER.setState(this.currentScene.nameScene);
      this.currentScene.in();
    }
  }
  hasFocus() {
    return document.hasFocus();
  }
  returnToPreviousScene() {
    this.changeScene(this.previousScene);
  }
}

export const GAME_DEV = SceneManager.getInstance();
