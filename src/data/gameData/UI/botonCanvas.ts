export class BottonCanvas {
  position = {
    x: 0,
    y: 0,
  };
  width = 80;
  height = 50;
  title: string;
  clickPoint = { x: 0, y: 0 };
  isCanvasPressed = false;
  isAviable = false;
  constructor({ position, title, isAviable = false }) {
    this.position = position;
    this.title = title;
    this.isAviable = isAviable;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = this.isAviable ? "red" : "green";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.isCanvasPressed) {
      this.showClick(c);
    }
    if (this.isAviable) {
      this.showText(c, this.title, {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      });
    }
  }
  showClick(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.arc(this.clickPoint.x, this.clickPoint.y, 16, 0, 2 * Math.PI);
    c.fillStyle = "#00000050";
    c.fill();
  }
  checkClick(x: number, y: number): string {
    if (
      x + 16 > this.position.x &&
      x < this.position.x + this.width &&
      y + 16 > this.position.y &&
      y < this.position.y + this.height
    ) {
      return this.title;
    } else {
      this.isCanvasPressed = true;
      this.clickPoint = { x, y };
      setTimeout(() => {
        this.isCanvasPressed = false;
      }, 1000);
      return "";
    }
  }
  showText(
    c: CanvasRenderingContext2D,
    msj: string | number,
    posición: { x: number; y: number },
    font: number = 16
  ) {
    c.font = "" + font + "px 'Mega-Man-Battle-Network-Regular'"; // Nombre que has definido en @font-face
    c.fillStyle = "#484848"; // Color del texto
    c.textAlign = "center"; // Alineación horizontal
    c.textBaseline = "middle"; // Alineación vertical

    // Escribir el texto en el lienzo
    c.fillText(` ${msj}`, posición.x + 0.5, posición.y + 0.5);
    // Nombre que has definido en @font-face
    c.fillStyle = "#fdfddf"; // Color del texto
    c.fillText(`${msj}`, posición.x, posición.y);
  }
}
