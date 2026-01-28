export const character = {
  lan: 0,
  megaman: 5,
  naviSore: 1,
  naviBattle: 2,
  gustman: 3,
  chatBot: 4,
};
export type TDialogueScene =
  | "isoWorld"
  | "selectChipsArea"
  | "addNewChip"
  | "selectChipsSome"
  | "selectChipsNone"
  | "folderFull"
  | "askMoreChips";
export class CharacterDialogue {
  characters: {
    [key: string]: {
      image: number;
      lines: string[][];
      linesCount: number;
      scene: TDialogueScene;
    };
  } = {};
  addCharacter(
    characterImage: keyof typeof character,
    scene: TDialogueScene = "isoWorld",
    lines: string[][],
  ) {
    this.characters[`${characterImage}:${scene}`] = {
      image: character[characterImage],
      lines, //: [["base msj"], ...lines],
      linesCount: 0,
      scene,
    };
  }
  getRandomLine(
    characterImage: keyof typeof character,
    scene: TDialogueScene = "isoWorld",
  ) {
    const key = `${characterImage}:${scene}`;
    const data = {
      image: characterImage,
      line: this.characters[key].lines[this.characters[key].linesCount],
    };
    this.characters[key].linesCount++;

    if (this.characters[key].linesCount >= this.characters[key].lines.length) {
      this.characters[key].linesCount = 0;
    }

    return data;
  }
}
export const DIALOGUE_MANAGER = new CharacterDialogue();

const isoLanDialogue = [
  ["Hurry Megaman we need ", "faind the MASTER KEY", "to get out"],
  ["Any VIRUS has to be ", "delete  before ", "before make trouble"],
  ["We neet to be prepared", "to face any enemy", "before make trouble"],
];

DIALOGUE_MANAGER.addCharacter("lan", "isoWorld", isoLanDialogue);
DIALOGUE_MANAGER.addCharacter("naviSore", "isoWorld", [
  ["Hello", "I'm here", "but i can't help you"],
  ["Ahhhhh", "what's happen?"],
  ["Sorry", "Store is closed"],
]);
DIALOGUE_MANAGER.addCharacter("naviBattle", "isoWorld", [
  ["In other time ", "we should fight", "now we are waiting"],
]);
DIALOGUE_MANAGER.addCharacter("gustman", "isoWorld", [
  ["I need my chips", "for battle"],
  ["Do yow saw my chips?"],
  ["isn't it a good idea", "to battle without chips?"],
  ["don't you have any", "chips?"],
]);

DIALOGUE_MANAGER.addCharacter("chatBot", "isoWorld", [
  ["what I'm doing here "],
  ["data I need keep data safe"],
  ["I need to be safe"],
]);
