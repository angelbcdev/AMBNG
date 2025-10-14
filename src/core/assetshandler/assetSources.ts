import { AssetManifest } from "../assetManager";

// Single entry point for all images used by the app.
// Extend and keep in sync as you add new art.
// Root path for all asset URLs (change here to move asset base path)

//public/assects/block.png
export const URLROOT = "/assects";
export const ASSET_SOURCES: AssetManifest = {
  // UI and HUD elements
  ui: [
    { key: "ui:completeScreen", url: `${URLROOT}/UI/clearSatage.png` },
    { key: "ui:clearBattle", url: `${URLROOT}/UI/clearBattleImg.png` },
    { key: "ui:chipsMenu", url: `${URLROOT}/UI/menuWindos.png` },
    { key: "ui:pauseWindow", url: `${URLROOT}/UI/menuWindos.png` },
    { key: "ui:moneyWindow", url: `${URLROOT}/UI/moneywindos.png` },
    { key: "ui:arrowGreen", url: `${URLROOT}/UI/GreenArrow.png` },
    { key: "ui:arrowBlackUp", url: `${URLROOT}/UI/BlackArrowup.png` },
    { key: "ui:arrowBlackDown", url: `${URLROOT}/UI/BlackArrowdown.png` },
    // Chip selection UI pieces
    {
      key: "ui:chipSelectorBase",
      url: `${URLROOT}/selectedchip/chipSelector.png`,
    },
    { key: "ui:logoRoll", url: `${URLROOT}/selectedchip/logoRoll.png` },
    { key: "ui:addButton", url: `${URLROOT}/selectedchip/addButon.png` },
    { key: "ui:selectedChip", url: `${URLROOT}/selectedchip/selectedChip.png` },
    { key: "ui:selectAccept", url: `${URLROOT}/selectedchip/selectAcept.png` },
    // Battle UI bar
    { key: "ui:barWait", url: `${URLROOT}/UI/barWait.png` },
    // Dialogue portraits
    { key: "ui:lanPortrait", url: `${URLROOT}/person/lan.png` },
  ],

  // Backgrounds (animated sheets in backGroundShow.ts)
  background: [
    { key: "bg:0", url: `${URLROOT}/background/bgfull0.png` },
    { key: "bg:1", url: `${URLROOT}/background/bgfull1.png` },
    { key: "bg:2", url: `${URLROOT}/background/bgfull2.png` },
    { key: "bg:3", url: `${URLROOT}/background/bgfull3.png` },
    { key: "bg:4", url: `${URLROOT}/background/bgfull4.png` },
    { key: "bg:5", url: `${URLROOT}/background/bgfull5.png` },
    { key: "bg:6", url: `${URLROOT}/background/bgfull6.png` },
  ],

  // Player sprites
  player: [
    {
      key: "player:megamanAll",
      url: `${URLROOT}/megaman/megamanAllStates.png`,
    },
    // Note: source path has a space in repo (" sprite_mega_world.png"). Keep as-is unless you rename the file.
    {
      key: "player:worldSprite",
      url: `${URLROOT}/megaman/sprite_mega_world.png`,
    },
  ],

  // Enemy sprites and elements
  enemies: [
    { key: "enemy:block", url: `${URLROOT}/block.png` },
    { key: "enemy:wolfBoss", url: `${URLROOT}/enemy/wolfBoss.png` },
    // Mettols levels
    { key: "enemy:mettols:l1", url: `${URLROOT}/enemy/mettols/mettols1.png` },
    { key: "enemy:mettols:l2", url: `${URLROOT}/enemy/mettols/mettols2.png` },
    { key: "enemy:mettols:l3", url: `${URLROOT}/enemy/mettols/mettols3.png` },
    // Fishy levels
    { key: "enemy:fishy:l1", url: `${URLROOT}/enemy/fisht/fisht1.png` },
    { key: "enemy:fishy:l2", url: `${URLROOT}/enemy/fisht/fisht2.png` },
    { key: "enemy:fishy:l3", url: `${URLROOT}/enemy/fisht/fisht3.png` },
    // Cannon Dumb levels and auxiliary sprites
    {
      key: "enemy:cannonDumb:l1",
      url: `${URLROOT}/enemy/cannonDumb/canondumpall1.png`,
    },
    {
      key: "enemy:cannonDumb:l2",
      url: `${URLROOT}/enemy/cannonDumb/canondumpall2.png`,
    },
    {
      key: "enemy:cannonDumb:l3",
      url: `${URLROOT}/enemy/cannonDumb/canondumpall3.png`,
    },
    {
      key: "enemy:cannonDumb:attack",
      url: `${URLROOT}/enemy/cannonDumb/attack-Cannon.png`,
    },
    {
      key: "enemy:cannonDumb:mira",
      url: `${URLROOT}/enemy/cannonDumb/miraCannon.png`,
    },
    // BeeTank levels
    { key: "enemy:beeTank:l1", url: `${URLROOT}/enemy/boomtank1.png` },
    { key: "enemy:beeTank:l2", url: `${URLROOT}/enemy/boomtank2.png` },
    { key: "enemy:beeTank:l3", url: `${URLROOT}/enemy/boomtank3.png` },
    // Misc enemies referenced
    { key: "enemy:cannon", url: `${URLROOT}/enemy/cannon.png` },
    { key: "enemy:tolete", url: `${URLROOT}/enemy/tolete.png` },
  ],

  // Attack effects and projectiles
  attacks: [
    { key: "attack:explosion1", url: `${URLROOT}/attaks/explotion1.png` },
    {
      key: "attack:explosionBomb",
      url: `${URLROOT}/attaks/explotionboomb.png`,
    },
    // projectiles used by attacks
    { key: "attack:boomb", url: `${URLROOT}/attaks/boomb.png` },
    { key: "attack:basicBullet", url: `${URLROOT}/attaks/basibulet.png` },
    { key: "attack:fireShoot", url: `${URLROOT}/attaks/fireShoot.png` },
    { key: "attack:dashShoot2", url: `${URLROOT}/attaks/dashShoot2.png` },
    // static effects used by attacks
    { key: "attack:basicShootEffect", url: `${URLROOT}/basicShoot.png` },
  ],

  // Battle chip icons (from chipData)
  chips: [{ key: "chip:allchip", url: `${URLROOT}/chips/allChips.png` }],

  navis: [
    {
      key: "navi:gust",
      url: `${URLROOT}/navis/gust/gustSprite.png`,
    },
  ],

  // Floor atlases
  tiles: [
    { key: "floor:all1", url: `${URLROOT}/floor/allFloor1.png` },
    { key: "floor:all2", url: `${URLROOT}/floor/allFloor2.png` },
    { key: "floor:all3", url: `${URLROOT}/floor/allFloor3.png` },
    { key: "floor:all4", url: `${URLROOT}/floor/allFloor4.png` },
    { key: "floor:all5", url: `${URLROOT}/floor/allFloor5.png` },
    { key: "floor:all6", url: `${URLROOT}/floor/allFloor6.png` },
    { key: "floor:all7", url: `${URLROOT}/floor/allFloor7.png` },
    { key: "floor:all8", url: `${URLROOT}/floor/allFloor8.png` },
  ],
};
