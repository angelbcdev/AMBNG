import { useState } from 'react';
import { fuse, type FusionResult } from '../services/fusionService';

export function useFusion() {
  const [result, setResult] = useState<FusionResult | null>(null);

  function doFusion(a: string, b: string) {
    const r = fuse(a, b);
    setResult(r);
    return r;
  }

  return { result, doFusion };
}
