import { BackGround } from "@/newUI/backGround/backGroundShow";

class SceneRoot {
  nameScene = "ROOT";
  bg = new BackGround({ width: 430, height: 400 }, 2);
  constructor() {}
  in() {
    console.log(`scene ${this.nameScene} in`);
  }
  out() {
    console.log(`scene ${this.nameScene} out`);
  }
  update(__: number, _: CanvasRenderingContext2D) {}
  draw(
    deltaTime: number,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    c.fillStyle = "#fff";
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (this.bg) {
      this.bg.draw(c, 14);
    }
    c.font = "32px 'Mega-Man-Battle-Network-Regular'"; // Nombre que has definido en @font-face
    c.fillStyle = "#000"; // Color del texto
    c.textAlign = "left";

    c.fillText(this.nameScene, 100, 100);
  }
  checkClick(mouseX: number, mouseY: number) {
    // console.log(`click en ${this.nameScene} (${mouseX}, ${mouseY})`);
  }
  checkKey(e: KeyboardEvent) {
    // console.log(`key en ${this.nameScene} (${e.key})`);
  }
}

export default SceneRoot;
