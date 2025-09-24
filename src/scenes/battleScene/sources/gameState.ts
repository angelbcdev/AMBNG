let IS_DEV = true;
let IS_PAUSE = false;

const GAME_IS_DEV = () => IS_DEV;
const GAME_IS_PAUSE = () => IS_PAUSE;

const GAME_TOGGLE_DEV = () => (IS_DEV = !IS_DEV);
const GAME_TOGGLE_PAUSE = () => (IS_PAUSE = !IS_PAUSE);
const GAME_SET_PAUSE = () => (IS_PAUSE = false);

export {
  GAME_IS_DEV,
  GAME_IS_PAUSE,
  GAME_TOGGLE_DEV,
  GAME_TOGGLE_PAUSE,
  GAME_SET_PAUSE,
};
