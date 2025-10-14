import { keyBindings } from "@/config/keyBindings";

import Player, { playerAllAttacks } from "../Player";
import { GAME_IS_PAUSE } from "@/core/gameState";

const moves = ["arrowUp", "arrowDown", "arrowLeft", "arrowRight"];

export class PlayerState {
  name: string;
  player: Player;
  constructor(name: string, player: Player) {
    this.name = name;
    this.player = player;
  }
  enter() {}
  update(_: CanvasRenderingContext2D, __: number) {}
  onCollision(_: any) {}
  exit() {}
  acctionKeyDown(key: string) {
    if (
      this.player.frameY == this.player.states.hit ||
      GAME_IS_PAUSE() ||
      this.player.matrix == null
    ) {
      return;
    }

    const nwMatrixY = this.player.matrixY;
    const nwMatrixX = this.player.matrixX;

    const { newMatrixY, newMatrixX } = this.whichtKeyDown(
      key,
      nwMatrixY,
      nwMatrixX
    );

    try {
      if (this.player.matrix[newMatrixY][newMatrixX]?.ocupated) {
        return;
      }
    } catch (error) {}

    // Verificar los límites y ocupación
    if (
      newMatrixY < 0 ||
      newMatrixY >= this.player.matrix.length ||
      newMatrixX < 0 ||
      newMatrixX >= this.player.matrix[0].length ||
      this.player.matrix[newMatrixY][newMatrixX].side !== this.player.side
    ) {
      return; // Salir si hay un movimiento no válido
    }

    // Marcar la posición actual como no ocupada
    this.player.matrix[this.player.matrixY][this.player.matrixX].ocupated =
      false;

    // Actualizar las coordenadas
    this.player.matrixY = newMatrixY;
    this.player.matrixX = newMatrixX;

    // Marcar la nueva posición como ocupada

    this.player.matrix[this.player.matrixY][this.player.matrixX].ocupated =
      true;
  }
  acctionKeyUp(key: string) {
    const handleEvents = {
      [keyBindings.pressB]: () => {
        if (!this.player.canShoot) {
          this.player.canShoot = true;
        }
      },
      [keyBindings.pressA]: () => {
        return;
      },
    };
    if (handleEvents[key.toLowerCase()]) {
      handleEvents[key.toLowerCase()]();
    }
  }
  whichtKeyDown(key: string, newMatrixY: number, newMatrixX: number) {
    if (moves.includes(key.toLowerCase())) {
      this.player.changeState(this.player.stateReference.MOVE);
    }
    const handleEvents = {
      arrowup: () => {
        newMatrixY -= 1;
      },
      arrowdown: () => {
        newMatrixY += 1;
      },
      arrowleft: () => {
        newMatrixX -= 1;
      },
      arrowright: () => {
        newMatrixX += 1;
      },
      [keyBindings.pressB]: () => {
        if (this.player.canShoot) {
          this.player.changeState(this.player.stateReference.SHOOT);
          setTimeout(() => {
            this.player.makeAttack(playerAllAttacks.BASIC);
          }, 200);
        }
      },

      [keyBindings.pressA]: () => {
        if (this.player.canShoot) {
          this.useShip();
        }
      },
    };

    if (handleEvents[key.toLowerCase()]) {
      handleEvents[key.toLowerCase()]();
    }

    return { newMatrixY, newMatrixX };
  }

  useShip() {
    const chip = this.player.allChips.shift();
    if (!chip) {
      return;
    }

    if (chip.userMakeAttack) {
      chip.userMakeAttack(this.player);
      return;
    }
  }
}
