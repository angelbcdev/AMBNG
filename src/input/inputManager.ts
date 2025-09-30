import { GAME_IS_DEV } from "@/core/gameState";

export interface InputHandler {
  onKeyDown: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
}
// nameInputScene = inputStateKeys.WORLD_SCENE;
export type InputState =
  | "OPTION_SCENE"
  | "HOME_SCENE"
  | "ROOT_SCENE"
  | "MENU"
  | "NO_INPUT"
  | "BATTLE"
  | "PAUSE"
  | "BATTLE_CHIP_AREA"
  | "WORLD_PAUSE"
  | "WORLD_SCENE"
  | "COMPLETE_SCREEN"
  | "DIALOGUE"
  | "GAME_OVER"
  | "FOLDER_SCENE";

export const inputStateKeys: Record<InputState, InputState> = {
  MENU: "MENU",
  NO_INPUT: "NO_INPUT",
  BATTLE: "BATTLE",
  PAUSE: "PAUSE",
  BATTLE_CHIP_AREA: "BATTLE_CHIP_AREA",
  WORLD_PAUSE: "WORLD_PAUSE",
  WORLD_SCENE: "WORLD_SCENE",
  COMPLETE_SCREEN: "COMPLETE_SCREEN",
  DIALOGUE: "DIALOGUE",
  FOLDER_SCENE: "FOLDER_SCENE",
  OPTION_SCENE: "OPTION_SCENE",
  HOME_SCENE: "HOME_SCENE",
  ROOT_SCENE: "ROOT_SCENE",
  GAME_OVER: "GAME_OVER",
};

class InputStateMachine {
  static instance: InputStateMachine;

  states: Record<InputState, InputHandler>;
  currentState: InputState;
  oldState: InputState;
  constructor() {
    this.states = {} as Record<InputState, InputHandler>;
    this.currentState = inputStateKeys.NO_INPUT;
  }

  static getInstance() {
    if (!InputStateMachine.instance) {
      InputStateMachine.instance = new InputStateMachine();
    }
    return InputStateMachine.instance;
  }

  addState(nameInput: keyof typeof inputStateKeys, handlers: InputHandler) {
    this.states[nameInput] = handlers;
  }

  setState(nameInput: keyof typeof inputStateKeys) {
    if (!this.states[nameInput]) {
      console.log(`State ${nameInput} not defined`);
      return;
    }
    if (this.currentState === nameInput) {
      // console.log(`State ${nameInput} is already active`);
      return;
    }
    this.oldState = this.currentState;
    this.currentState = nameInput;
    if (GAME_IS_DEV()) {
      console.log(`Transitioned from ${this.oldState} to -> ${nameInput}`);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    const state = this.states[this.currentState];
    if (state && state.onKeyDown) {
      state.onKeyDown(event);
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    const state = this.states[this.currentState];
    if (state && state.onKeyUp) {
      state.onKeyUp(event);
    }
  }
  in() {
    // Attach to DOM events
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }
  returnPreviousState() {
    this.setState(this.oldState);
  }
}
export const INPUT_MANAGER = InputStateMachine.getInstance();

// Define "menu" input logic
INPUT_MANAGER.addState(inputStateKeys.MENU, {
  onKeyDown: (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("pressed Enter!");
    }
  },
  onKeyUp: (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("released Enter!");
    }
  },
});
INPUT_MANAGER.addState(inputStateKeys.NO_INPUT, {
  onKeyDown: (_: KeyboardEvent) => {},
  onKeyUp: (_: KeyboardEvent) => {},
});

INPUT_MANAGER.setState(inputStateKeys.MENU);

// Start in MENU state
