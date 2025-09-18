export type FusionResult = {
  combinedId: string;
  power: number;
  description?: string;
};

export function fuse(a: string, b: string): FusionResult {
  // placeholder deterministic combination
  return {
    combinedId: `${a}+${b}`,
    power: Math.floor((a.length + b.length) * 1.5),
    description: `Fused ${a} with ${b}`,
  };
}
