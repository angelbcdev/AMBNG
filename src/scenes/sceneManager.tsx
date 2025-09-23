import { WorldScene } from "../scenes/worldScene/worldScene";
import { BattleScene } from "../scenes/battleScene/battleScene";
import { HomeScene } from "../scenes/homeScene/homeScene";
import { OptionScene } from "../scenes/optionScene/optionScene";
import { ChipsScene } from "./chipsScene/chipsScene";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d")!;
canvas.width = 430;
canvas.height = 430;

export class SceneManager {
  c: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  isDev = true;
  static instance: SceneManager | null = null;

  currentSceneIndex = "home";
  statesKeys = {
    home: "home",
    world: "world",
    battle: "battle",
    option: "option",
    chips: "chips",
  };
  scenes = {
    home: new HomeScene(),
    world: new WorldScene(),
    battle: new BattleScene(),
    option: new OptionScene(),
    chips: new ChipsScene(),
  };
  currentScene = this.scenes[this.currentSceneIndex];

  static getInstance() {
    if (!this.instance) {
      this.instance = new SceneManager();
    }
    return this.instance;
  }
  constructor() {
    this.canvas = canvas;
    this.c = c;
    this.currentScene.in();
    document.getElementById("canvas").addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      this.currentScene.checkClick(x, y);
    });

    window.addEventListener("keydown", (e) => {
      this.currentScene.checkKey(e);
      const options = this.statesKeys;
      const nextID = this.scenes[options[e.key.toLowerCase()]];
      if (nextID !== undefined) {
        this.changeScene(nextID);
      }
    });
  }

  update(deltaTime: number) {
    this.currentScene.update(deltaTime, this.c);
  }

  draw(deltaTime: number) {
    this.currentScene.draw(deltaTime, this.c, this.canvas);
  }
  changeScene(newScene: string) {
    if (!this.scenes[newScene]) {
      return;
    }

    if (this.currentSceneIndex !== newScene) {
      this.currentScene.out();
      this.currentSceneIndex = newScene;
      this.currentScene = this.scenes[this.currentSceneIndex];
      this.currentScene.in();
    }
  }
  hasFocus() {
    return document.hasFocus();
  }
}

export const GAME = SceneManager.getInstance();
