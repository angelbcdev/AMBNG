import { keyBindings } from "@/config/keyBindings";

export class ButtonManager {
  arrowImage = new Image();
  currentButtonIndex = 0;
  buttons: {
    position: { x: number; y: number };
    width: number;
    height: number;
    title: string;
    isAvailable: boolean;
    isCanvasPressed: boolean;
    clickPoint: { x: number; y: number };
    action: () => void;
  }[] = [];

  constructor(
    configs: {
      position: { x: number; y: number };
      title: string;
      action: () => void;
      isAvailable?: boolean;
      width?: number;
      height?: number;
    }[]
  ) {
    this.arrowImage.src = "./public/assects/UI/GreenArrow.png";
    this.buttons = configs.map((cfg) => ({
      position: cfg.position,
      title: cfg.title,
      action: cfg.action,
      isAvailable: cfg.isAvailable ?? true,
      width: cfg.width ?? 80,
      height: cfg.height ?? 50,
      isCanvasPressed: false,
      clickPoint: { x: 0, y: 0 },
    }));
  }

  keyDown(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      this.currentButtonIndex =
        (this.currentButtonIndex - 1 + this.buttons?.length) %
        this.buttons?.length;
    } else if (e.key === "ArrowDown") {
      this.currentButtonIndex =
        (this.currentButtonIndex + 1) % this.buttons?.length;
    } else if (
      e.key === "Enter" ||
      keyBindings.singleShoot === e.key.toLowerCase()
    ) {
      this.buttons[this.currentButtonIndex]?.action();
    }
  }
  in() {
    document.addEventListener("keydown", this.keyDown);
  }

  out() {
    document.removeEventListener("keydown", this.keyDown);
  }

  draw(c: CanvasRenderingContext2D) {
    this.buttons.forEach((btn, index) => {
      // box
      // c.fillStyle = btn.isAvailable ? "red" : "green";
      // c.fillRect(btn.position.x, btn.position.y, btn.width, btn.height);
      // paint arow for button

      if (index === this.currentButtonIndex) {
        c.drawImage(
          this.arrowImage,
          btn.position.x - 32,
          btn.position.y + 8,
          32,
          32
        );
      }

      // pressed indicator
      if (btn.isCanvasPressed) {
        this.showClick(c, btn.clickPoint);
      }

      // title
      if (btn.isAvailable) {
        this.showText(c, btn.title, {
          x: btn.position.x + 20,
          y: btn.position.y + btn.height / 2,
        });
      }
    });
  }

  checkClick(x: number, y: number) {
    this.buttons.forEach((btn) => {
      if (
        x + 16 > btn.position.x &&
        x < btn.position.x + btn.width &&
        y + 16 > btn.position.y &&
        y < btn.position.y + btn.height
      ) {
        btn.action();
      } else {
        btn.isCanvasPressed = true;
        btn.clickPoint = { x, y };
        setTimeout(() => {
          btn.isCanvasPressed = false;
        }, 1000);
      }
    });
  }

  private showClick(
    c: CanvasRenderingContext2D,
    point: { x: number; y: number }
  ) {
    c.beginPath();
    c.arc(point.x, point.y, 16, 0, 2 * Math.PI);
    c.fillStyle = "#00000050";
    c.fill();
  }

  private showText(
    c: CanvasRenderingContext2D,
    msg: string | number,
    position: { x: number; y: number },
    font: number = 12
  ) {
    c.font = `${font}px 'Mega-Man-Battle-Network-Regular'`;
    c.fillStyle = "#484848";
    c.textAlign = "left";
    c.textBaseline = "middle";

    c.fillText(` ${msg}`, position.x + 0.5, position.y + 0.5);

    c.fillStyle = "#fdfddf";
    c.fillText(`${msg}`, position.x, position.y);
  }
}
