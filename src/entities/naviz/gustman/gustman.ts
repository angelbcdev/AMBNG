import { GAME_IS_PAUSE } from "@/core/gameState";
import { DashShoot } from "@/data/attacks/dashShoot";

import Enemy from "@/entities/enemys/enemys";
import {
  GustmanstatesAttackPush,
  GustmanstatesHit,
  GustmanstatesIDLE,
  GustmanstatesMove,
  Gustmanstates,
  GustmanstatesAttackSmash,
  GustmanstatesAttackSmashBroken,
} from "./states";
import { Entity } from "@/entities/entity";
import { getImageFromAssetsManager } from "@/core/assetshandler/assetHelpers";
import { FLOOR_MANAGER } from "@/core/floorManager";

export class Gustman extends Enemy {
  canAttack = true;

  finiteStatesMachine = {
    idle: new GustmanstatesIDLE(this),
    move: new GustmanstatesMove(this),
    attackPush: new GustmanstatesAttackPush(this),
    attackSmash: new GustmanstatesAttackSmash(this),
    attackSmashBroken: new GustmanstatesAttackSmashBroken(this),
    hit: new GustmanstatesHit(this),
  };
  currentState: Gustmanstates;
  oldState: string;

  timerForAttack = 0;
  timeAttack = 0;
  moveNewAttack = 200;

  states: Record<string, number> = {};
  timeMoveRandom = 1000;
  mytimer = null;
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.image = getImageFromAssetsManager("navi:gust");

    this.live = 1000;
    this.damage = 60;
    this.side = sideToPlay;
    this.possitionShowLiveY = 44;
    this.states = {
      idle: 0,
      punch: 1,
      hit: 2,
      move: 3,
      mash: 4,
    };

    this.oldState = "idle";
    this.frameY = this.states.idle;
    this.currentState = this.finiteStatesMachine["idle"];
    this.currentState.enter();

    // this.incialFrameY = 0;
    // this.frameTime = 0;
    this.fps = 12;
    this.frameInterval = 1000 / this.fps;

    this.blockSize = {
      w: 100,
      h: 100,
    };
    //Ajust Frame and sprite
    this.frameAjustY = 160;
    this.frameAjustX = 110;
    this.maxFrame = 8;
    this.frameWidth = 120;
    this.frameHeight = 110;
    this.fameAdjustWidth = 140;
    this.fameAdjustHeight = 140;
    this.possitionShowLiveX = 2;
    this.possitionShowLiveY = -50;
    this.moveNewAttack = 80;

    // time and stup for state machine
    this.timeMoveRandom = 1000;
    this.mytimer = null;

    // make attack

    this.proyoectile = DashShoot;
  }
  showDataDev(c: CanvasRenderingContext2D, x: number, y: number, gap = 120) {
    c.fillStyle = "#000";
    c.textAlign = "left";
    c.font = "12px Arial";
    const data = [
      [
        {
          name: "possition",
          value: `X: ${this.matrixX} - Y: ${this.matrixY}`,
        },
      ],
      [
        { name: "old", value: this.oldState },
        { name: "current", value: this.currentState?.state },
      ],
      [
        { name: "move", value: this.canMove },
        // { name: "count timer for attack", value: this.countTimerForAttack },
      ],
      [
        { name: "shoot", value: this.canShoot },
        { name: "attack", value: this.canAttack },
      ],
      // Time For Move
      [
        { name: "time move", value: Gustmanstates.timerForMove.toFixed(2) },
        {
          name: "next move",
          value: Gustmanstates.maxTimeForMove.toFixed(2),
        },
      ],
      [
        {
          name: "smash attack",
          value: Gustmanstates.timeForAttackSmash.toFixed(2),
        },
        {
          name: "next smash attack",
          value: Gustmanstates.maxTimeForAttackSmash.toFixed(2),
        },
      ],
      [
        {
          name: "push attack",
          value: Gustmanstates.timeForAttackPush.toFixed(2),
        },
        {
          name: "next push attack",
          value: Gustmanstates.maxTimeForAttackPush.toFixed(2),
        },
      ],
      [
        {
          name: "smash broken ",
          value: Gustmanstates.timeForAttackSmashBroken.toFixed(2),
        },
        {
          name: "next smash broken ",
          value: Gustmanstates.maxTimeForAttackSmashBroken.toFixed(2),
        },
      ],
    ];
    data.forEach((item, index) => {
      item.forEach((item2, index2) => {
        c.fillText(
          `${item2.name}: ${item2.value}`,
          x + index2 * gap,
          y + index * 15
        );
      });
    });
  }
  update(c: CanvasRenderingContext2D, deltaTime: number): void {
    if (!GAME_IS_PAUSE() && document.hasFocus()) {
      this.currentState.update(c, deltaTime);
      this.checkCollision();
    }
  }

  acctionMoveNavy(type: "Movemen" | "Smash" | "Punch" | "Broken") {
    // this.frameY = this.states.mash;
    let newMatrixX: number, newMatrixY: number;

    if (type == "Movemen") {
      newMatrixY = Math.floor(Math.random() * 3);
      newMatrixX = Math.floor(Math.random() * 3) + 3;
    } else {
      this.matrix.forEach((row, rowPosition) => {
        const colPosition = row.findIndex(
          (cell) => cell.side != this.side && cell.ocupated
        );
        if (colPosition != -1) {
          if (type == "Smash") {
            newMatrixY = rowPosition;
            newMatrixX = Math.floor(Math.random() * 3) + 3;
          } else if (type == "Punch") {
            //Let
          } else if (type == "Broken") {
            newMatrixY = rowPosition;
            newMatrixX = 3;
          }
        }
      });
    }

    if (
      newMatrixY < 0 ||
      newMatrixY >= this.matrix.length ||
      newMatrixX < 0 ||
      newMatrixX >= this.matrix[0].length ||
      this.matrix[newMatrixY][newMatrixX].side !== this.side ||
      this.matrix[newMatrixY][newMatrixX]?.ocupated
    ) {
      return;
    }

    this.frameY = this.states.move;

    this.matrix[this.matrixY][this.matrixX].ocupated = false;
    this.matrixY = newMatrixY;
    this.matrixX = newMatrixX;

    this.matrix[this.matrixY][this.matrixX].ocupated = true;
  }

  moveRandom() {}

  makeAttack() {}

  changeState(newState: keyof typeof this.finiteStatesMachine) {
    if (this.currentState.state === newState) {
      return;
    }
    this.oldState = this.currentState.state;
    this.currentState.exit();
    this.currentState = this.finiteStatesMachine[newState];
    this.currentState.enter();
  }
  onDetectedPlayer(player) {
    if (this.side === player.side || this.delete || GAME_IS_PAUSE()) {
      return;
    }

    // this.changeState(this.finiteStates.attack);
  }
  collisionArea(_: Entity) {
    if (this.canAttack) {
      // this.currentState.onCollision(player);
    }
  }
  resiveDamage(attack: Entity) {
    if (this.live <= 0) {
      return;
    }
    this.live -= attack.damage;
    attack.delete = true;
    this.changeState("hit");

    if (this.live <= 0) {
      this.makeDeath();
    }
  }
  smashAttack() {
    this.addAttack({});
  }
  smashBrokenAttack() {}

  addAttack({ type = "nadda" }: { type?: string | number }) {
    const attack = new this.proyoectile({
      matrix: this.matrix,
      possition: {
        x:
          this.side === 0
            ? this.possition.x + this.moveNewAttack
            : this.possition.x - this.moveNewAttack,
        y: this.possition.y,
        initialMatrixY: this.matrixY,
      },
      sideToPlay: this.side,
      color: this.color,
      damage: this.damage,
      origin: this.side,
      attackOuwner: this,
      type,
    });

    attack.matrix = FLOOR_MANAGER.matrix;
    this.AllattackToShow.push(attack);
  }
}
