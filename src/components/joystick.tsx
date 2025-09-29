import { useRef } from "react";

// Keep pressed keys in a global Set
export const ARRAY_KEYS = ["ArrowDown"];

// Function your game can call to check key states
// export function isKeyPressed(key: string) {
//   return pressedKeys.has(key);
// }

export const Joystick = () => {
  return (
    <main className="bg-blue-900 w-full h-full text-xl">
      <section className="w-[430px] h-[300px] relative bg-slate-900 py-2 text-white capitalize">
        {/* Top L/R */}
        <div className="w-full flex flex-row justify-evenly">
          <JTButton title="L" keyRepresent="l" className="btn-up" />
          <JTButton title="R" keyRepresent="r" className="btn-up" />
        </div>

        {/* Middle */}
        <section className="h-[70%] w-full flex px-2">
          {/* D-Pad */}
          <div className="relative w-1/2 h-full justify-center items-center flex">
            <div className="bg-gray-700 w-[60px] h-[180px] border-4 border-gray-600 absolute flex flex-col justify-between items-center rounded-md">
              <JTButton title="▲" keyRepresent="ArrowUp" className="btn-dpad" />
              <JTButton
                title="▼"
                keyRepresent="ArrowDown"
                className="btn-dpad"
              />
            </div>
            <div className="absolute bg-gray-700 w-[60px] h-[60px] flex justify-center items-center">
              <span className="text-xs absolute size-9 rounded-full bg-gray-800"></span>
            </div>
            <div className="bg-gray-700 w-[180px] h-[60px] border-4 border-gray-600 flex justify-between items-center rounded-md">
              <JTButton
                title="◀"
                keyRepresent="ArrowLeft"
                className="btn-dpad"
              />
              <JTButton
                title="▶"
                keyRepresent="ArrowRight"
                className="btn-dpad"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-row justify-center gap-8 pl-8 items-center">
            <JTButton title="B" keyRepresent="b" className="btn-action" />
            <JTButton title="A" keyRepresent="a" className="btn-action" />
          </div>
        </section>

        {/* Select / Start */}
        <div className="w-full flex flex-row justify-center gap-8 text-white text-sm">
          <JTButton
            title="Select"
            keyRepresent="select"
            className="btn-small"
          />
          <JTButton title="Start" keyRepresent="start" className="btn-small" />
        </div>
      </section>
    </main>
  );
};

const JTButton = ({
  title,
  className,
  keyRepresent,
}: {
  title: string;
  className: string;
  keyRepresent: string;
}) => {
  const style = {
    "btn-dpad": " ",
    "btn-action": "bg-gray-700 w-16 h-16 rounded-full border-4 border-gray-600",
    "btn-up":
      "bg-gray-700 w-40 h-8 rounded-t-3xl border-4 border-gray-600 mx-4",
    "btn-small": "bg-gray-700 w-20 h-10 rounded-3xl border-4 border-gray-600",
  };

  const pressedRef = useRef(false);

  // When pressed
  const onDown = () => {
    if (!pressedRef.current) {
      pressedRef.current = true;
      ARRAY_KEYS.push(keyRepresent);
      console.log("PRESS:", keyRepresent); // Debug
    }
  };

  // When released
  const onUp = () => {
    if (pressedRef.current) {
      pressedRef.current = false;
      ARRAY_KEYS.splice(ARRAY_KEYS.indexOf(keyRepresent), 1);
      console.log("RELEASE:", keyRepresent); // Debug
    }
  };

  return (
    <div
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp} // ensures release if cursor leaves button
      onTouchStart={onDown}
      onTouchEnd={onUp}
      className={`justify-center items-center flex ${style[className]}`}
    >
      {title}
    </div>
  );
};
