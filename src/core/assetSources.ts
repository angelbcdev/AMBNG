import { AssetManifest } from "./assetManager";

// Single entry point for all images used by the app.
// Extend and keep in sync as you add new art.
// Root path for all asset URLs (change here to move asset base path)
export const URLROOT = "/assects";
export const ASSET_SOURCES: AssetManifest = {
  // UI and HUD elements
  ui: [
    { key: "ui:completeScreen", url: `${URLROOT}/clearSatage.png` },
    { key: "ui:clearBattle", url: `${URLROOT}/clearBattleImg.png` },
    { key: "ui:chipsMenu", url: `${URLROOT}/chipsMenu/chipsMenus.png` },
    { key: "ui:pauseMenu", url: `${URLROOT}/chipsMenu/menuWindos.png` },
    { key: "ui:moneyWindow", url: `${URLROOT}/chipsMenu/moneywindos.png` },
    { key: "ui:arrowGreen", url: `${URLROOT}/UI/GreenArrow.png` },
    { key: "ui:arrowBlackUp", url: `${URLROOT}/UI/BlackArrowup.png` },
    { key: "ui:arrowBlackDown", url: `${URLROOT}/UI/BlackArrowdown.png` },
  ],

  // Backgrounds (animated sheets in backGroundShow.ts)
  background: [
    { key: "bg:full:0", url: `${URLROOT}/background/bgfull0.png` },
    { key: "bg:full:1", url: `${URLROOT}/background/bgfull1.png` },
    { key: "bg:full:2", url: `${URLROOT}/background/bgfull2.png` },
    { key: "bg:full:3", url: `${URLROOT}/background/bgfull3.png` },
    { key: "bg:full:4", url: `${URLROOT}/background/bgfull4.png` },
    { key: "bg:full:5", url: `${URLROOT}/background/bgfull5.png` },
    { key: "bg:full:6", url: `${URLROOT}/background/bgfull6.png` },
  ],

  // Player sprites
  player: [
    { key: "player:megamanAll", url: `${URLROOT}/megaman/megamanAllStates.png` },
    // Note: source path has a space in repo (" sprite_mega_world.png"). Keep as-is unless you rename the file.
    {
      key: "player:worldSprite",
      url: `${URLROOT}/megaman/ sprite_mega_world.png`,
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
    { key: "attack:explosionBomb", url: `${URLROOT}/attaks/explotionboomb.png` },
  ],

  // Battle chip icons (from chipData)
  chips: [
    { key: "chip:cannons1", url: `${URLROOT}/battleShip/cannon1.png` },
    { key: "chip:cannons2", url: `${URLROOT}/battleShip/cannon2.png` },
    { key: "chip:cannons3", url: `${URLROOT}/battleShip/cannon3.png` },
    { key: "chip:punsh", url: `${URLROOT}/battleShip/punsh.png` },
    { key: "chip:breackPanel", url: `${URLROOT}/battleShip/breakPanel.png` },
    { key: "chip:bomb", url: `${URLROOT}/battleShip/bomb.png` },
    { key: "chip:block", url: `${URLROOT}/battleShip/block.png` },
    { key: "chip:maze", url: `${URLROOT}/battleShip/maze.png` },
    { key: "chip:pannel3", url: `${URLROOT}/battleShip/panel3.png` },
    { key: "chip:pannel1", url: `${URLROOT}/battleShip/panel1.png` },
    { key: "chip:addlinePanel", url: `${URLROOT}/battleShip/addlinePanel.png` },
    { key: "chip:shield", url: `${URLROOT}/battleShip/guard.png` },
    { key: "chip:dash", url: `${URLROOT}/battleShip/dash.png` },
    { key: "chip:dash2", url: `${URLROOT}/battleShip/dash-2.png` },
    { key: "chip:healt80", url: `${URLROOT}/battleShip/healt80.png` },
    { key: "chip:healt10", url: `${URLROOT}/battleShip/healt10.png` },
    { key: "chip:healt30", url: `${URLROOT}/battleShip/healt30.png` },
    { key: "chip:healt50", url: `${URLROOT}/battleShip/healt50.png` },
    { key: "chip:healt120", url: `${URLROOT}/battleShip/healt120.png` },
    { key: "chip:healt150", url: `${URLROOT}/battleShip/healt150.png` },
    { key: "chip:healt200", url: `${URLROOT}/battleShip/healt200.png` },
    { key: "chip:healt300", url: `${URLROOT}/battleShip/healt300.png` },
    { key: "chip:swords", url: `${URLROOT}/battleShip/swords.png` },
    { key: "chip:swords-long", url: `${URLROOT}/battleShip/swords-long.png` },
    { key: "chip:pickaxel1", url: `${URLROOT}/battleShip/pickaxel1.png` },
    { key: "chip:pickaxel2", url: `${URLROOT}/battleShip/pickaxel2.png` },
    { key: "chip:pickaxel3", url: `${URLROOT}/battleShip/pickaxel3.png` },
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

