let IS_DEV = true;
let IS_PAUSE = false;
let IS_BATTLE = false;

const GAME_IS_DEV = () => IS_DEV;
const GAME_IS_PAUSE = () => IS_PAUSE;
const GAME_IS_BATTLE = () => IS_BATTLE;

const GAME_TOGGLE_DEV = () => (IS_DEV = !IS_DEV);
const GAME_TOGGLE_PAUSE = () => (IS_PAUSE = !IS_PAUSE);

const GAME_SET_PAUSE = () => (IS_PAUSE = true);
const GAME_SET_UNPAUSE = () => (IS_PAUSE = false);
const GAME_SET_BATTLE = () => (IS_BATTLE = true);
const GAME_SET_UNBATTLE = () => (IS_BATTLE = false);

export {
  GAME_IS_DEV,
  GAME_IS_PAUSE,
  GAME_IS_BATTLE,
  GAME_TOGGLE_DEV,
  GAME_TOGGLE_PAUSE,
  GAME_SET_BATTLE,
  GAME_SET_UNBATTLE,
  GAME_SET_PAUSE,
  GAME_SET_UNPAUSE,
};
