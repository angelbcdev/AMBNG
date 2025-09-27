import { getImageFromAssetsManager } from "@/core/assetshandler/assetHelpers";
// BaseImageComponent.ts
export class BaseImageComponent {
  private image = new Image();
  width = 320;
  height = 420;

  constructor() {
    this.image = getImageFromAssetsManager("ui:chipSelectorBase");
  }

  draw(c: CanvasRenderingContext2D, x: number, y: number): void {
    c.drawImage(this.image, x - 20, y, this.width, this.height);
  }
}

// LogoRollComponent.ts
export class LogoRollComponent {
  private image = new Image();
  width = 47;
  height = 69;
  maxFrame = 3;

  constructor() {
    this.image = getImageFromAssetsManager("ui:logoRoll");
  }

  draw(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    frameX: number
  ): void {
    c.drawImage(
      this.image,
      frameX * this.width,
      0,
      this.width,
      this.height,
      x + 248,
      y + 4,
      this.width - 6,
      this.height - 10
    );
  }
}

// AddButtonComponent.ts
export class AddButtonComponent {
  private image = new Image();
  width = 65;
  height = 62;

  constructor() {
    this.image = getImageFromAssetsManager("ui:addButton");
  }

  draw(c: CanvasRenderingContext2D, x: number, y: number): void {
    c.drawImage(this.image, x + 205, y + 345, this.width, this.height);
  }
}

// ChipSelectorComponent.ts
export class ChipSelectorComponent {
  private image = new Image();
  width = 46;
  height = 46;

  constructor() {
    this.image = getImageFromAssetsManager("ui:selectedChip");
  }

  draw(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    frameX: number
  ): void {
    c.drawImage(
      this.image,
      frameX * this.width,
      0,
      this.width,
      this.height,
      x - 3,
      y - 3,
      this.width - 6,
      this.height - 6
    );
  }
}

// AddSelectorComponent.ts
export class AddSelectorComponent {
  private image = new Image();
  width = 53;
  height = 53;

  constructor() {
    this.image = getImageFromAssetsManager("ui:selectAccept");
  }

  draw(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    frameX: number
  ): void {
    c.drawImage(
      this.image,
      frameX * this.width,
      0,
      this.width,
      this.height,
      x,
      y,
      this.width + 8,
      this.height
    );
  }
}
