import { ASSET_MANAGER } from "@/core/assetManager";
import { ASSET_SOURCES } from "@/core/assetshandler/assetSources";

// Unified helper to safely resolve an image from the AssetManager with
// a fallback to the manifest URL if the asset is not yet preloaded.
export function getImageFromAssetsManager(key: string): HTMLImageElement {
  if (ASSET_MANAGER.has(key)) return ASSET_MANAGER.get(key);

  // Fallback: search all groups for the key's URL
  const groups = Object.values(ASSET_SOURCES) as Array<
    Array<{ key: string; url: string }>
  >;
  const def = groups.flat().find((d) => d.key === key);

  const img = new Image();
  if (def) img.src = def.url;
  return img;
}
