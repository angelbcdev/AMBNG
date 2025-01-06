import { FloorBase } from "./floors/floor";

export const createObjectsFrom2D = function ({
  array,
  blockSize,
  blockElements,
  gapX = 0,
}) {
  const objects = [];

  array.forEach((row, y) => {
    row.forEach((symbol, x) => {
      for (const { id, classElement } of Object.values(
        blockElements
      ) as any[]) {
        if (symbol.side === id) {
          let gap = 100;

          if (y === 0) {
            gap += 30;
          }

          if (y === 1) {
            gap += 11;
          }

          if (y === 2) {
            gap -= 8;
          }
          if (y === 3) {
            gap -= 24;
          }

          objects.push(
            new classElement({
              possition: {
                x: gapX + x * blockSize,
                y: y * blockSize + gap,
                blockSize,
                isAttack: symbol.isAttack || false,
                dataPanel: symbol.dataPanel,
                matrixY: y,
                matrixX: x,
              },
            })
          );
          break; // Salir del bucle una vez que se ha encontrado el bloque correspondiente
        }
      }
    });
  });

  return objects;
};

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

export const KEY_DATA = "CURRENT_LEVEL";
export const savedataLocalStorage = function (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getdataLocalStorage = function (key) {
  return JSON.parse(localStorage.getItem(key));
};

export const removeDataLocalStorage = function (key) {
  localStorage.removeItem(key);
};
