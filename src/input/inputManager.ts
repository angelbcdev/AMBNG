export interface InputHandler {
  onKeyDown: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
}

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
  | "FOLDER_SCENE";

export const inputStateKeys: Record<InputState, InputState> = {
  MENU: "MENU",
  NO_INPUT: "NO_INPUT",
  BATTLE: "BATTLE",
  PAUSE: "PAUSE",
  BATTLE_CHIP_AREA: "BATTLE_CHIP_AREA",
  WORLD_PAUSE: "WORLD_PAUSE",
  WORLD_SCENE: "WORLD_SCENE",
  FOLDER_SCENE: "FOLDER_SCENE",
  OPTION_SCENE: "OPTION_SCENE",
  HOME_SCENE: "HOME_SCENE",
  ROOT_SCENE: "ROOT_SCENE",
};

class InputStateMachine {
  static instance: InputStateMachine;

  states: Record<InputState, InputHandler>;
  currentState: string;
  constructor() {
    this.states = {} as Record<InputState, InputHandler>;
    this.currentState = "";
  }

  static getInstance() {
    if (!InputStateMachine.instance) {
      InputStateMachine.instance = new InputStateMachine();
    }
    return InputStateMachine.instance;
  }

  addState(name: keyof typeof inputStateKeys, handlers: InputHandler) {
    console.log(`Adding state: ${name}`);
    this.states[name] = handlers;
  }

  setState(name: keyof typeof inputStateKeys) {
    if (!this.states[name]) {
      console.log(`State ${name} not defined`);
      return;
    }
    this.currentState = name;
    console.log(`Transitioned to state: ${name}`);
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
}
export const INPUT_MANAGER = InputStateMachine.getInstance();

// Define "menu" input logic
INPUT_MANAGER.addState(inputStateKeys.MENU, {
  onKeyDown: (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("pressed Enter!");
      // INPUT_MANAGER.setState("GAMEPLAY");
    }
  },
  onKeyUp: (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("released Enter!");
      // INPUT_MANAGER.setState("GAMEPLAY");
    }
  },
});
INPUT_MANAGER.addState(inputStateKeys.NO_INPUT, {
  onKeyDown: (_: KeyboardEvent) => {},
  onKeyUp: (_: KeyboardEvent) => {},
});

// // Define "gameplay" input logic
// INPUT_MANAGER.addState("GAMEPLAY", {
//   onKeyDown: (e: KeyboardEvent) => {
//     if (e.key === "ArrowUp") console.log("Move up");
//     if (e.key === " ") {
//       console.log("Enter battle!");
//       INPUT_MANAGER.setState("BATTLE");
//     }
//   },
//   onKeyUp: (e: KeyboardEvent) => {
//     if (e.key === "ArrowUp") console.log("Move up");
//     if (e.key === " ") {
//       console.log("Enter battle!");
//       INPUT_MANAGER.setState("BATTLE");
//     }
//   },
// });

// // Define "battle" input logic
// INPUT_MANAGER.addState("BATTLE", {
//   onKeyDown: (e: KeyboardEvent) => {
//     if (e.key === "a") console.log("Attack!");
//     if (e.key === "Escape") {
//       console.log("Exit battle");
//       INPUT_MANAGER.setState("GAMEPLAY");
//     }
//   },
//   onKeyUp: (e: KeyboardEvent) => {
//     if (e.key === "a") console.log("Attack!");
//     if (e.key === "Escape") {
//       console.log("Exit battle");
//       INPUT_MANAGER.setState("GAMEPLAY");
//     }
//   },
// });

// // Define "battle" input logic
// INPUT_MANAGER.addState("BATTLE", {
//   onKeyDown: (e: KeyboardEvent) => {
//     if (e.key === "a") console.log("Attack!");
//     if (e.key === "Escape") {
//       console.log("Exit battle");
//       INPUT_MANAGER.setState("GAMEPLAY");
//     }
//   },
//   onKeyUp: (e: KeyboardEvent) => {
//     if (e.key === "a") console.log("Attack!");
//     if (e.key === "Escape") {
//       console.log("Exit battle");
//       INPUT_MANAGER.setState("GAMEPLAY");
//     }
//   },
// });

INPUT_MANAGER.setState("MENU");

// Start in MENU state
