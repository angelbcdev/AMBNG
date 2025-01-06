import { BasicEnemy } from "./enemys/basicEnemy";
import { GospelWolfEnemy } from "./enemys/Character/gospel";
import { StaticEnemy } from "./enemys/staticEnemy";

export const standWorld = (left: boolean) => [
  [
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
  ],
  [
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
  ],
  [
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
  ],
  [
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 0 : 1, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
    { side: left ? 1 : 0, ocupated: false, effect: "none" },
  ],
];

const levels = {
  1: {
    enemys: [
      {
        possition: { x: 0, y: 1 },
        type: BasicEnemy,
      },
    ],
  },
  2: {
    enemys: [
      {
        possition: { x: 1, y: 1 },
        type: BasicEnemy,
      },
      {
        possition: { x: 0, y: 2 },
        type: StaticEnemy,
      },
    ],
    // matrix: standWorld,
  },
  3: {
    enemys: [
      {
        possition: { x: 0, y: 0 },
        type: StaticEnemy,
      },
      {
        possition: { x: 1, y: 2 },
        type: BasicEnemy,
      },
      {
        possition: { x: 0, y: 3 },
        type: StaticEnemy,
      },
    ],
    // matrix: standWorld,
  },
  4: {
    enemys: [
      { possition: { x: 1, y: 0 }, type: BasicEnemy },
      { possition: { x: 2, y: 2 }, type: BasicEnemy },
      { possition: { x: 0, y: 3 }, type: StaticEnemy },
      { possition: { x: 0, y: 0 }, type: StaticEnemy },
    ],
  },
  5: {
    enemys: [{ possition: { x: 0, y: 1 }, type: GospelWolfEnemy }],
  },
  6: {
    enemys: [
      { possition: { x: 0, y: 2 }, type: StaticEnemy },
      { possition: { x: 2, y: 3 }, type: BasicEnemy },
      { possition: { x: 1, y: 1 }, type: BasicEnemy },
    ],
  },
  7: {
    enemys: [
      { possition: { x: 1, y: 2 }, type: StaticEnemy },
      { possition: { x: 0, y: 1 }, type: BasicEnemy },
      { possition: { x: 2, y: 0 }, type: BasicEnemy },
    ],
  },
  8: {
    enemys: [
      { possition: { x: 2, y: 1 }, type: StaticEnemy },
      { possition: { x: 1, y: 0 }, type: BasicEnemy },
      { possition: { x: 0, y: 3 }, type: BasicEnemy },
    ],
  },
  9: {
    enemys: [
      { possition: { x: 0, y: 0 }, type: BasicEnemy },
      { possition: { x: 1, y: 3 }, type: StaticEnemy },
      { possition: { x: 2, y: 2 }, type: BasicEnemy },
    ],
  },
  10: {
    enemys: [{ possition: { x: 0, y: 1 }, type: GospelWolfEnemy }],
  },
  11: {
    enemys: [
      { possition: { x: 0, y: 3 }, type: StaticEnemy },
      { possition: { x: 1, y: 2 }, type: BasicEnemy },
      { possition: { x: 2, y: 1 }, type: BasicEnemy },
    ],
  },
  12: {
    enemys: [
      { possition: { x: 2, y: 0 }, type: StaticEnemy },
      { possition: { x: 0, y: 1 }, type: BasicEnemy },
      { possition: { x: 1, y: 3 }, type: BasicEnemy },
    ],
  },
  13: {
    enemys: [
      { possition: { x: 0, y: 2 }, type: BasicEnemy },
      { possition: { x: 2, y: 3 }, type: StaticEnemy },
      { possition: { x: 1, y: 0 }, type: BasicEnemy },
    ],
  },
  14: {
    enemys: [
      { possition: { x: 1, y: 3 }, type: BasicEnemy },
      { possition: { x: 2, y: 1 }, type: StaticEnemy },
      { possition: { x: 0, y: 0 }, type: BasicEnemy },
    ],
  },
  15: {
    enemys: [
      { possition: { x: 0, y: 1 }, type: BasicEnemy },
      { possition: { x: 1, y: 2 }, type: StaticEnemy },
      { possition: { x: 2, y: 3 }, type: BasicEnemy },
    ],
  },
  16: {
    enemys: [
      { possition: { x: 2, y: 2 }, type: StaticEnemy },
      { possition: { x: 1, y: 0 }, type: BasicEnemy },
      { possition: { x: 0, y: 3 }, type: BasicEnemy },
    ],
  },
  17: {
    enemys: [
      { possition: { x: 1, y: 1 }, type: BasicEnemy },
      { possition: { x: 0, y: 2 }, type: StaticEnemy },
      { possition: { x: 2, y: 0 }, type: BasicEnemy },
    ],
  },
  18: {
    enemys: [
      { possition: { x: 2, y: 3 }, type: BasicEnemy },
      { possition: { x: 1, y: 0 }, type: StaticEnemy },
      { possition: { x: 0, y: 1 }, type: BasicEnemy },
    ],
  },
  19: {
    enemys: [
      { possition: { x: 0, y: 0 }, type: BasicEnemy },
      { possition: { x: 2, y: 2 }, type: StaticEnemy },
      { possition: { x: 1, y: 3 }, type: BasicEnemy },
    ],
  },
  20: {
    enemys: [{ possition: { x: 0, y: 1 }, type: GospelWolfEnemy }],
  },
  21: {
    enemys: [
      { possition: { x: 2, y: 0 }, type: StaticEnemy },
      { possition: { x: 1, y: 1 }, type: BasicEnemy },
      { possition: { x: 0, y: 2 }, type: BasicEnemy },
    ],
  },
  22: {
    enemys: [
      { possition: { x: 1, y: 3 }, type: BasicEnemy },
      { possition: { x: 2, y: 2 }, type: StaticEnemy },
      { possition: { x: 0, y: 0 }, type: BasicEnemy },
    ],
  },
  23: {
    enemys: [
      { possition: { x: 0, y: 1 }, type: BasicEnemy },
      { possition: { x: 1, y: 0 }, type: StaticEnemy },
      { possition: { x: 2, y: 3 }, type: BasicEnemy },
    ],
  },
  24: {
    enemys: [
      { possition: { x: 2, y: 1 }, type: StaticEnemy },
      { possition: { x: 1, y: 2 }, type: BasicEnemy },
      { possition: { x: 0, y: 3 }, type: BasicEnemy },
    ],
  },
  25: {
    enemys: [
      { possition: { x: 0, y: 2 }, type: BasicEnemy },
      { possition: { x: 0, y: 1 }, type: GospelWolfEnemy },
      { possition: { x: 2, y: 0 }, type: BasicEnemy },
    ],
  },
};
export default levels;
