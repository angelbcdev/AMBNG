import { FloorBase } from "../floor";

export const ubicateFloors = function ({ array, blockSize, gapX = 1 }) {
  const objects = [];

  array.forEach((row, y) => {
    row.forEach((symbol, x) => {
      // if (symbol.side != 0 && symbol.side != 1) {
      //   return;
      // }
      let gap = 130;

      if (y === 0) {
        gap += 30;
      }

      if (y === 1) {
        gap += 20;
      }

      if (y === 2) {
        gap += 10;
      }
      if (y === 3) {
        gap = 130;
      }

      objects.push(
        new FloorBase({
          possition: {
            x: x * (blockSize + gapX + 2),
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
