export type AssetKey = string;

export type AssetGroupName =
  | "background"
  | "ui"
  | "player"
  | "enemies"
  | "attacks"
  | "tiles"
  | string;

export type AssetDef = { key: AssetKey; url: string };
export type AssetManifest = Record<AssetGroupName, AssetDef[]>;

class AssetManager {
  private static instance: AssetManager;
  private images = new Map<AssetKey, HTMLImageElement>();
  private manifest: AssetManifest = {} as AssetManifest;

  static getInstance() {
    if (!this.instance) this.instance = new AssetManager();
    return this.instance;
  }

  registerManifest(manifest: AssetManifest) {
    this.manifest = manifest;
  }

  get(key: AssetKey): HTMLImageElement {
    const img = this.images.get(key);
    if (!img) throw new Error(`Asset not loaded or unknown key: ${key}`);
    return img;
  }

  has(key: AssetKey) {
    return this.images.has(key);
  }

  async preloadAll(
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    const allDefs: AssetDef[] = Object.values(this.manifest).flat();
    const uniqueDefs = this.dedupeByKey(allDefs);
    const total = uniqueDefs.length;
    if (total === 0) return;

    let loaded = 0;
    const loadOne = (def: AssetDef) =>
      new Promise<void>((resolve) => {
        if (this.images.has(def.key)) {
          loaded++;
          onProgress?.(loaded, total);
          return resolve();
        }
        const img = new Image();
        img.onload = () => {
          this.images.set(def.key, img);
          loaded++;
          onProgress?.(loaded, total);
          resolve();
        };
        img.onerror = () => {
          // Do not block startup on a single bad URL; log and advance
          console.warn(`Failed to load image: ${def.url} (key=${def.key})`);
          loaded++;
          onProgress?.(loaded, total);
          resolve();
        };
        img.src = def.url;
      });

    await Promise.all(uniqueDefs.map(loadOne));
  }

  async preloadGroups(
    groups: AssetGroupName[],
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    const defs = groups.map((g) => this.manifest[g] || []).flat();
    const uniqueDefs = this.dedupeByKey(defs);
    const total = uniqueDefs.length;
    if (total === 0) return;

    let loaded = 0;
    for (const def of uniqueDefs) {
      await new Promise<void>((resolve) => {
        if (this.images.has(def.key)) {
          loaded++;
          onProgress?.(loaded, total);
          return resolve();
        }
        const img = new Image();
        img.onload = () => {
          this.images.set(def.key, img);
          loaded++;
          onProgress?.(loaded, total);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${def.url} (key=${def.key})`);
          loaded++;
          onProgress?.(loaded, total);
          resolve();
        };
        img.src = def.url;
      });
    }
  }

  private dedupeByKey(defs: AssetDef[]): AssetDef[] {
    const seen = new Set<string>();
    const out: AssetDef[] = [];
    for (const d of defs) {
      if (!seen.has(d.key)) {
        seen.add(d.key);
        out.push(d);
      }
    }
    return out;
  }
}

export const ASSET_MANAGER = AssetManager.getInstance();
