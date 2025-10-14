const gameSettings = {
  timeForSelectShip: 10000,
  timeForNextBattle: 3000,
};

export const gapMatrixFloor = (y: number) => {
  let gap = 90;

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
    gap = 90;
  }

  return gap;
};
export const gapMatrixNPC = (y: number) => {
  let gap = 90;
  if (y === 0) {
    gap += 20;
  }
  if (y === 1) {
    gap += 10;
  }
  if (y === 2) {
    gap -= 10;
  }
  if (y === 3) {
    gap -= 20;
  }

  return gap;
};

export default gameSettings;
