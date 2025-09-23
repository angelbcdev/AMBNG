class SceneRoot {
  nameScene = "ROOT";
  bg = null;
  constructor() {}
  in() {}
  out() {}
  update(__: number, _: CanvasRenderingContext2D) {}
  draw(
    deltaTime: number,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    c.fillStyle = "#fff";
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (this.bg) {
      this.bg.draw(c, deltaTime);
    }
    c.font = "32px 'Mega-Man-Battle-Network-Regular'"; // Nombre que has definido en @font-face
    c.fillStyle = "#000"; // Color del texto
    c.textAlign = "left";

    c.fillText(this.nameScene, 100, 100);
  }
  checkClick(mouseX: number, mouseY: number) {}
  checkKey(e: KeyboardEvent) {}
}

export default SceneRoot;
