export const mapDetails = [
  {
    img: "/assects/background/bgfull1.png",
    width: 255,
    height: 255,
    maxFrame: 3,
    speed: 0.02,
    fps: 1000 / 6,
    name: "Pink Diamonds",
  },
  {
    img: "/assects/background/bgfull2.png",
    width: 508,
    height: 511,
    maxFrame: 5,
    speed: 0.02,
    fps: 1000 / 6,
    name: "Blue Square",
  },
  {
    img: "/assects/background/bgfull3.png",
    width: 128,
    height: 192,
    maxFrame: 24,
    speed: 0.02,
    fps: 1000 / 6,
    name: "Golden E",
  },
  {
    img: "/assects/background/bgfull4.png",
    width: 264,
    height: 264,
    maxFrame: 3,
    speed: 0.02,
    fps: 1000 / 6,
    name: "Brown food",
  },
  {
    img: "/assects/background/bgfull5.png",
    width: 240,
    height: 160,
    maxFrame: 15,
    speed: 0.03,
    fps: 1000 / 30,
    name: "Dark Thunder",
  },
];
export class BackGround {
  img: HTMLImageElement;
  position: { x: number; y: number };
  canvas: { width: number; height: number };
  frameTime: number;
  frameInterval: number;
  maxFrame: number;
  initialFrameX: number;
  initialFrameY: number;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  speed: number;
  mapa: number;
  name = "";

  constructor(canvas: { width: number; height: number }, mapa = 0) {
    this.img = new Image();
    this.img.src = mapDetails[mapa].img;
    this.position = { x: 0, y: 0 }; // Iniciar en la esquina superior izquierda
    this.canvas = canvas;
    this.frameTime = 0;
    this.mapa = mapa;
    this.frameInterval = mapDetails[mapa].fps;
    this.maxFrame = mapDetails[mapa].maxFrame;
    this.initialFrameX = 0;
    this.initialFrameY = 0;
    this.frameX = this.initialFrameX;
    this.frameY = this.initialFrameY;
    this.name = mapDetails[mapa].name;
    this.frameWidth = mapDetails[mapa].width; // 508; // El ancho de cada fragmento de la imagen
    this.frameHeight = mapDetails[mapa].height; // 511; // La altura de cada fragmento de la imagen
    this.speed = mapDetails[mapa].speed; // Ajusta la velocidad de movimiento
  }
  updateBackGround(newMapa: number) {
    this.mapa = newMapa;
    this.img.src = mapDetails[newMapa].img;
    this.frameInterval = mapDetails[newMapa].fps;
    this.maxFrame = mapDetails[newMapa].maxFrame;
    this.initialFrameX = 0;
    this.initialFrameY = 0;
    this.frameX = this.initialFrameX;
    this.frameY = this.initialFrameY;
    this.frameWidth = mapDetails[newMapa].width; // 508; // El ancho de cada fragmento de la imagen
    this.frameHeight = mapDetails[newMapa].height; // 511; // La altura de cada fragmento de la imagen
    this.speed = mapDetails[newMapa].speed; // Ajusta la velocidad de movimiento
  }

  draw(c, deltaTime) {
    c.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpiar el canvas
    c.fillStyle = "white";
    c.fillRect(0, 0, this.canvas.width, this.canvas.height + 60);

    // Actualizar la posición de la imagen de fondo, moviéndola hacia la derecha y hacia abajo
    this.position.x += deltaTime * this.speed; // Mover hacia la derecha
    this.position.y += deltaTime * this.speed; // Mover hacia abajo

    // Reposicionar las imágenes cuando se hayan movido más allá de la pantalla en el eje X
    if (this.position.x > this.canvas.width) {
      this.position.x = 0;
    }

    // Reposicionar las imágenes cuando se hayan movido más allá de la pantalla en el eje Y
    if (this.position.y > this.canvas.height) {
      this.position.y = 0;
    }

    // Actualización de la animación del sprite (si la tienes)
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      this.frameX =
        this.frameX < this.maxFrame ? this.frameX + 1 : this.initialFrameX;
      if (this.mapa === 5 && this.frameX === this.maxFrame) {
        this.maxFrame = Math.floor(Math.random() * 10) + 7;
      }
    } else {
      this.frameTime += deltaTime;
    }

    // Dibujar las 9 imágenes de fondo en una cuadrícula 3x3
    for (let i = -1; i <= 1; i++) {
      // Tres filas, desde -1 hasta 1 (3 posiciones)
      for (let j = -1; j <= 1; j++) {
        // Tres columnas, desde -1 hasta 1 (3 posiciones)
        c.drawImage(
          this.img,
          this.frameX * this.frameWidth,
          this.frameY * this.frameHeight,
          this.frameWidth,
          this.frameHeight,
          this.position.x + j * this.canvas.width, // Ajustar posición horizontal
          this.position.y + i * this.canvas.height, // Ajustar posición vertical
          this.canvas.width + 2,
          this.canvas.height + 2 // Asegurarse de que cubra todo el canvas
        );
      }
    }
  }
}
