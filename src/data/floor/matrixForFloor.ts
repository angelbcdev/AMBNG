export type TMatrix = {
  side: number;
  ocupated: boolean;
  effect: string;
  isAttack: boolean;
  isVisible?: boolean;
};

export const matrix: TMatrix[][] = [
  [
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
  ],
  [
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
  ],
  [
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    {
      side: 1,
      ocupated: false,
      effect: "none",
      isVisible: false,
      isAttack: false,
    },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
  ],
  // this is the last row 4 x 3
  [
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
    { side: 1, ocupated: false, effect: "none", isAttack: false },
  ],
];
