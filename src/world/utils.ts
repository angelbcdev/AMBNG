import { FloorRoad } from "./class";

const world = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
  1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
  1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
const splitArray = (array: number[], size: number) => {
  const arrayChunks = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    arrayChunks.push(chunk);
  }
  return arrayChunks;
};

const myClass = {
  1: FloorRoad,
};

export const matrix01 = splitArray(world, 13);

export const createWorld = (matrix: number[][]) => {
  const elements = [];

  matrix.forEach((row, indexY) => {
    row.forEach((floor, indexX) => {
      if (myClass[floor]) {
        const className = myClass[floor];
        const width = 33;
        const height = 32;

        elements.push(
          new className(indexX * width, indexY * height, width, height)
        );
      }
    });
  });
  return elements;
};
