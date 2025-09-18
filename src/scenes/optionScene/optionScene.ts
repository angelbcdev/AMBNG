import { BackGround } from "@/newUI/backGround/backGroundShow";
import SceneRoot from "../sceneROOT";

export class OptionScene extends SceneRoot {
  nameScene = "option";
  bg = new BackGround({ width: 430, height: 400 }, 0);
  constructor() {
    super();
  }
}
