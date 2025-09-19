import { WorldScene } from "./worldScene/worldScene";
import { BattleScene } from "./battleScene/battleScene";
import { HomeScene } from "./homeScene/homeScene";
import { OptionScene } from "./optionScene/optionScene";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d")!;
canvas.width = 430;
canvas.height = 430;

export class SceneManager {
  c: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  static instance: SceneManager | null = null;
  allScenes = [
    new HomeScene(),
    new WorldScene(),
    new BattleScene(),
    new OptionScene(),
  ];
  currentSceneIndex = 0;
  scenes = {
    home: 0,
    world: 1,
    battle: 2,
    option: 3,
  };
  currentScene = this.allScenes[this.currentSceneIndex];

  static getInstance() {
    if (!this.instance) {
      this.instance = new SceneManager(c, canvas);
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
      const options = {
        3: "battle",
        2: "world",
        1: "home",
        4: "option",
      };
      const nextID = this.scenes[options[e.key.toLowerCase()]];
      if (nextID !== undefined) {
        this.changeScene(nextID);
      }
    });
  }

  update(deltaTime: number) {
    this.currentScene.update(deltaTime);
  }

  draw(deltaTime: number) {
    this.currentScene.draw(deltaTime, this.c, this.canvas);
  }
  changeScene(id: number) {
    if (id >= this.allScenes.length) {
      return;
    }

    if (this.currentSceneIndex !== id) {
      this.currentScene.out();
      this.currentSceneIndex = id;
      this.currentScene = this.allScenes[this.currentSceneIndex];
      this.currentScene.in();
    }
  }
  hasFocus() {
    return document.hasFocus();
  }
}

export const GAME = SceneManager.getInstance();
