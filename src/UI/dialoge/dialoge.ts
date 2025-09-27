import { keyBindings } from "@/config/keyBindings";
import { INPUT_MANAGER, inputStateKeys } from "@/input/inputManager";
import { ASSET_MANAGER } from "@/core/assetManager";
import { ASSET_SOURCES } from "@/core/assetSources";

export class Dialogue {
  nameScene = inputStateKeys.DIALOGUE;
  bgcolor = "#efe8cb";
  position = { x: 0, y: 430 };
  width = 430;
  height = 200;
  limitTime = 0;
  tinker = 0;
  imagen = new Image();
  frameX = 0;

  frameWidth = 126;
  frameHeight = 147;
  frameTime = 0;

  isHidden = true;
  lines: string[] = [];
  states = {
    talking: {
      initialFrameX: 0,
      maxFrame: 2,
      frameInterval: 1000 / 12,
    },
    idle: {
      initialFrameX: 2,
      maxFrame: 2,
      frameInterval: 4100 / 12,
    },
  };

  initialFrameX = 0;
  maxFrame = 0;
  frameInterval = 0;

  timeforCharacter = 0;
  maxTimeforCharacter = 10;
  currentCharacterToShowIndex = 0;
  currentLineToShowIndex = 0;
  linesToShow: string[] = [];
  canTalk = false;
  state: "talking" | "idle" = "idle";

  speed = 5;
  normalSpeed = 5;
  maxSpeed = 9.8;

  constructor() {
    // Resolve portrait via AssetManager with fallback
    const key = "ui:lanPortrait";
    if (ASSET_MANAGER.has(key)) {
      this.imagen = ASSET_MANAGER.get(key);
    } else {
      const def = (ASSET_SOURCES.ui || []).find((d) => d.key === key);
      if (def) this.imagen.src = def.url;
    }
    this.lines = [
      "This msj has tu be long enough ",
      "This msj has tu be long enough ",
      "This msj has tu be long enough ",
    ];
    this.linesToShow = this.lines.map(() => "");
    this.setState(this.state);
    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        const options = {
          [keyBindings.useChip]: () => {
            this.speed = this.maxSpeed;
          },
          [keyBindings.singleShoot]: () => {
            if (this.isFinished()) {
              this.hideDialogue();
            }
          },
        };
        if (options[e.key.toLowerCase()]) {
          options[e.key.toLowerCase()]();
        }
      },
      onKeyUp: (e: KeyboardEvent) => {
        const options = {
          [keyBindings.useChip]: () => {
            this.speed = this.normalSpeed;
          },
        };
        if (options[e.key.toLowerCase()]) {
          options[e.key.toLowerCase()]();
        }
      },
    });
  }

  setState(state: "talking" | "idle") {
    this.state = state;
    this.initialFrameX = this.states[state].initialFrameX;
    this.maxFrame = this.states[state].maxFrame;
    this.frameInterval = this.states[state].frameInterval;
    this.frameX = this.initialFrameX;
  }

  isFinished(): boolean {
    const lastIndex = this.lines.length - 1;
    if (lastIndex < 0) return true;
    return (
      this.currentLineToShowIndex === lastIndex &&
      this.currentCharacterToShowIndex >= this.lines[lastIndex].length
    );
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    // fondo
    c.fillStyle = this.bgcolor;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // animación sprite
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.initialFrameX;
    } else {
      this.frameTime += deltaTime;
    }

    this.showText(c);
    this.update(deltaTime);

    if (this.isFinished() && this.state === "talking") {
      this.setState("idle");
      this.canTalk = false;
    }

    this.drawSprite(c);

    // tinker
    if (this.limitTime > 100) {
      this.tinker++;
      this.limitTime = 0;
    } else {
      this.limitTime += deltaTime;
    }

    // entrada / salida
    if (!this.isHidden) {
      if (this.position.y >= 250) {
        this.position.y -= 0.2 * deltaTime;
      } else {
        // 🔑 solo empieza a hablar cuando ya está arriba
        if (!this.isFinished() && !this.canTalk) {
          this.setState("talking");
          this.canTalk = true;
        }
      }
    } else {
      if (this.position.y <= 430) {
        this.position.y += 0.2 * deltaTime;
      }
    }
  }

  update(deltaTime: number) {
    if (!this.canTalk) return;

    if (this.timeforCharacter > this.maxTimeforCharacter) {
      this.timeforCharacter = 0;
      const curLine = this.lines[this.currentLineToShowIndex];

      if (this.currentCharacterToShowIndex < curLine.length) {
        this.linesToShow[this.currentLineToShowIndex] +=
          curLine[this.currentCharacterToShowIndex];
        this.currentCharacterToShowIndex++;
      } else {
        if (this.currentLineToShowIndex < this.lines.length - 1) {
          this.currentLineToShowIndex++;
          this.currentCharacterToShowIndex = 0;
          this.linesToShow[this.currentLineToShowIndex] = "";
          this.setState("talking");
          this.canTalk = true;
        } else {
          this.canTalk = false;
          this.setState("idle");
        }
      }
    } else {
      this.timeforCharacter += this.speed;
    }
  }

  showText(c: CanvasRenderingContext2D) {
    this.linesToShow.forEach((line, index) => {
      c.font = "18px Arial";
      c.textAlign = "left";
      c.fillStyle = "#6c6c6c";
      c.fillText(
        line,
        this.position.x + 170,
        this.position.y + 38 + index * 28
      );
    });
  }

  drawSprite(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.imagen,
      this.frameX * this.frameWidth,
      0,
      this.frameWidth - 4,
      this.frameHeight,
      this.position.x + 20,
      this.position.y + 20,
      120,
      120
    );
  }

  showDialogue(newLines: string[] = ["message", "no", "added "]) {
    this.isHidden = false;

    // 🔑 reset, pero esperar a que suba antes de hablar
    this.lines = newLines;
    this.linesToShow = this.lines.map(() => "");
    this.currentCharacterToShowIndex = 0;
    this.currentLineToShowIndex = 0;
    this.timeforCharacter = 0;
    INPUT_MANAGER.setState(inputStateKeys.DIALOGUE);
    this.canTalk = false;
    this.setState("idle"); // espera en idle mientras sube
  }

  hideDialogue() {
    this.isHidden = true;
    this.resetDialogue();
    INPUT_MANAGER.returnPreviousState();
  }

  resetDialogue() {
    this.currentCharacterToShowIndex = 0;
    this.currentLineToShowIndex = 0;
    this.linesToShow = this.lines.map(() => "");
    this.speed = this.normalSpeed;
    this.canTalk = false;
    this.setState("idle");
  }
}
