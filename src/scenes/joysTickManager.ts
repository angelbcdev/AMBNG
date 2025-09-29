import { keyBindings } from "@/config/keyBindings";
import { INPUT_MANAGER } from "@/input/inputManager";

const locationTradPad = {
  x: 0,
  y: 50,
};

const buttons = {
  L: {
    x: 40,
    y: 20,
    width: 120,
    height: 35,
    type: "shoulder",
    keyPress: keyBindings.pressL,
  },
  R: {
    x: 270,
    y: 20,
    width: 120,
    height: 35,
    type: "shoulder",
    keyPress: keyBindings.pressR,
  },
  up: {
    x: locationTradPad.x + 80,
    y: locationTradPad.y + 40,
    width: 40,
    height: 30,
    type: "dpad",
    keyPress: "ArrowUp",
  },
  down: {
    x: locationTradPad.x + 80,
    y: locationTradPad.y + 130,
    width: 40,
    height: 30,
    type: "dpad",
    keyPress: "ArrowDown",
  },
  left: {
    x: locationTradPad.x + 35,
    y: locationTradPad.y + 80,
    width: 30,
    height: 40,
    type: "dpad",
    keyPress: "ArrowLeft",
  },
  right: {
    x: locationTradPad.x + 135,
    y: locationTradPad.y + 80,
    width: 30,
    height: 40,
    type: "dpad",
    keyPress: "ArrowRight",
  },
  B: {
    x: 250,
    y: 130,
    width: 45,
    height: 45,
    type: "action",
    keyPress: keyBindings.pressB,
  },
  A: {
    x: 335,
    y: 130,
    width: 45,
    height: 45,
    type: "action",
    keyPress: keyBindings.pressA,
  },
  select: {
    x: 100,
    y: 270,
    width: 60,
    height: 25,
    type: "menu",
    keyPress: keyBindings.pressSelect,
  },
  start: {
    x: 250,
    y: 270,
    width: 60,
    height: 25,
    type: "menu",
    keyPress: keyBindings.pressStart,
  },
};

class CanvasJoystick {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;

  // Guardar qué botones están presionados actualmente
  activeKeys: Map<number, string> = new Map(); // key: touch.identifier o mouse= -1

  constructor() {
    this.canvas = document.getElementById(
      "canvasJoystick"
    ) as HTMLCanvasElement;
    this.c = this.canvas.getContext("2d")!;
    this.canvas.width = 430;
    this.canvas.height = 430;
    this.c.fillStyle = "white";
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //  Evitar menú contextual por long press o click derecho
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    this.canvas.addEventListener("touchstart", (e) => e.preventDefault(), {
      passive: false,
    });
    this.canvas.addEventListener("touchmove", (e) => e.preventDefault(), {
      passive: false,
    });

    // Touch
    this.canvas.addEventListener("touchstart", this.handleTouchStart);
    this.canvas.addEventListener("touchend", this.handleTouchEnd);
  }

  private getLogicalCoords(e: MouseEvent | Touch) {
    const rect = this.canvas.getBoundingClientRect();
    const deviceScaleX = this.canvas.width / rect.width;
    const deviceScaleY = this.canvas.height / rect.height;
    const dx = (e.clientX - rect.left) * deviceScaleX;
    const dy = (e.clientY - rect.top) * deviceScaleY;

    const m = this.c.getTransform();
    return { x: dx / m.a, y: dy / m.d };
  }

  private detectButton(logicalX: number, logicalY: number): string | null {
    for (const button of Object.values(buttons)) {
      if (!button.keyPress) continue;
      if (button.type === "action") {
        const centerX = button.x + button.width / 2;
        const centerY = button.y + button.height / 2;
        const distance = Math.sqrt(
          (logicalX - centerX) ** 2 + (logicalY - centerY) ** 2
        );
        if (distance <= button.width / 2) return button.keyPress;
      } else {
        if (
          logicalX >= button.x &&
          logicalX <= button.x + button.width &&
          logicalY >= button.y &&
          logicalY <= button.y + button.height
        ) {
          return button.keyPress;
        }
      }
    }
    return null;
  }

  // ---------- Mouse ----------
  handleMouseDown = (e: MouseEvent) => {
    const { x, y } = this.getLogicalCoords(e);
    const key = this.detectButton(x, y);
    if (key) {
      this.activeKeys.set(-1, key);
      const ev = new KeyboardEvent("keydown", { key, code: "MyKey" });
      INPUT_MANAGER.handleKeyDown(ev);

      console.log(`Button down: ${key}`);
    }
  };

  handleMouseUp = (_: MouseEvent) => {
    const key = this.activeKeys.get(-1);
    if (key) {
      const ev = new KeyboardEvent("keyup", { key, code: "MyKey" });
      INPUT_MANAGER.handleKeyUp(ev);
      this.activeKeys.delete(-1);
    }
  };

  // ---------- Touch ----------
  handleTouchStart = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const { x, y } = this.getLogicalCoords(touch);
      const key = this.detectButton(x, y);
      if (key) {
        this.activeKeys.set(touch.identifier, key);
        const ev = new KeyboardEvent("keydown", { key, code: "MyKey" });
        INPUT_MANAGER.handleKeyDown(ev);
      }
    }
  };

  handleTouchEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const key = this.activeKeys.get(touch.identifier);
      if (key) {
        const ev = new KeyboardEvent("keyup", { key, code: "MyKey" });
        INPUT_MANAGER.handleKeyUp(ev);
        this.activeKeys.delete(touch.identifier);
      }
    }
  };

  // ---------- Dibujos ----------
  draw() {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.c.fillStyle = "#4848ff";
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawDPadBase(this.c);

    Object.entries(buttons).forEach(([name, button]) => {
      this.drawButton(this.c, button, name, false);
    });

    this.drawDPadCenter(this.c);
  }

  drawButton = (ctx, button, name, isPressed) => {
    const { x, y, width, height, type } = button;
    let fillColor, strokeColor, textColor;

    if (isPressed) {
      fillColor = "#374151";
      strokeColor = "#6B7280";
      textColor = "#D1D5DB";
    } else {
      switch (type) {
        case "shoulder":
          fillColor = "#4B5563";
          strokeColor = "#6B7280";
          textColor = "#F9FAFB";
          break;
        case "dpad":
          fillColor = "#374151";
          strokeColor = "#4B5563";
          textColor = "#F9FAFB";
          break;
        case "action":
          fillColor = "#4B5563";
          strokeColor = "#6B7280";
          textColor = "#F9FAFB";
          break;
        case "menu":
          fillColor = "#374151";
          strokeColor = "#4B5563";
          textColor = "#D1D5DB";
          break;
      }
    }

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;

    if (type === "action") {
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 8);
      ctx.fill();
      if (!["up", "down", "left", "right"].includes(name)) {
        ctx.stroke();
      }
    }

    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (type === "shoulder" || type === "menu") ctx.font = "14px sans-serif";
    else if (type === "action") ctx.font = "bold 18px sans-serif";
    else ctx.font = "16px sans-serif";

    let displayText = name;
    if (name === "up") displayText = "▲";
    if (name === "down") displayText = "▼";
    if (name === "left") displayText = "◀";
    if (name === "right") displayText = "▶";
    if (name === "select") displayText = "Select";
    if (name === "start") displayText = "Start";

    ctx.fillText(displayText, x + width / 2, y + height / 2);
  };

  drawDPadCenter = (ctx) => {
    ctx.fillStyle = "#1F2937";
    ctx.beginPath();
    ctx.arc(
      locationTradPad.x + 100,
      locationTradPad.y + 100,
      18,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  drawDPadBase = (ctx) => {
    const x = 75;
    const y = 35;
    ctx.fillStyle = "#374151";
    // ctx.strokeStyle = "#4B5563";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(locationTradPad.x + x, locationTradPad.y + y, 50, 130, 8);
    ctx.fill();
    // ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(locationTradPad.x + y, locationTradPad.y + x, 130, 50, 8);
    ctx.fill();
    // ctx.stroke();
  };
}

export const JOYSTICK_MANAGER = new CanvasJoystick();
