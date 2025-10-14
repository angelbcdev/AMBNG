import { gapMatrixFloor } from "@/config/gameSettings";
import { FloorBase } from "../floor";
import { TMatrix } from "../floor/matrixForFloor";

export const ubicateFloors = function (matrix: TMatrix[][]) {
  const blockSize = 64;
  const gapX = 8;
  const objects = [];

  matrix.forEach((row, y) => {
    row.forEach((symbol, x) => {
      // if (symbol.side != 0 && symbol.side != 1) {
      //   return;
      // }
      const gap = gapMatrixFloor(y);

      objects.push(
        new FloorBase({
          possition: {
            x: x * (blockSize + gapX),
            y: y * blockSize + gap,
            side: symbol.side,
            isAttack: symbol.isAttack || false,
            matrixY: y,
            matrixX: x,
          },
        })
      ); // Salir del bucle una vez que se ha encontrado el bloque correspondiente
    });
  });
  return objects;
};
