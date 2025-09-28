export const Joystick = () => {
  return (
    <main className="bg-blue-900 w-full h-full  text-xl">
      <section className="w-[430px] h-[300px] relative bg-slate-900 py-2 text-white capitalize">
        <div className="w-full flex flex-row justify-evenly  ">
          <JTButon title="L" tipe="up" />
          <JTButon title="R" tipe="up" />
        </div>
        <section className=" h-[70%] w-full flex px-2">
          <div className=" relative w-1/2 h-full justify-center  items-center flex ">
            <div className="bg-gray-700 w-[60px] h-[180px] border-4 border-gray-600  absolute flex flex-col justify-between items-center rounded-md">
              <JTButon title="up" tipe="cruz" cruz={true} />
              <JTButon title="down" tipe="cruz" cruz={true} />
            </div>
            <div className="absolute bg-gray-700 w-[60px] h-[60px] flex justify-center items-center">
              <span className="text-xs absolute size-9 rounded-full bg-gray-800"></span>
            </div>
            <div className="bg-gray-700 w-[180px] h-[60px] border-4 border-gray-600 flex justify-between  items-center rounded-md">
              <JTButon title="left" tipe="cruz" cruz={true} />
              <JTButon title="right" tipe="cruz" cruz={true} />
            </div>
          </div>

          <div className="w-full flex flex-row justify-center gap-8  pl-8 items-center  ">
            <JTButon title="B" tipe="middle" />
            <JTButon title="A" tipe="middle" />
          </div>
        </section>

        <div className="w-full flex flex-row justify-center gap-8 text-white text-sm ">
          <JTButon title="Select" tipe="down" />
          <JTButon title="Start" tipe="down" />
        </div>
      </section>
    </main>
  );
};

const JTButon = ({
  title,
  tipe,
  cruz = false,
}: {
  title: string;
  tipe: string;
  cruz?: boolean;
}) => {
  let style = "";
  if (tipe === "down") {
    style = "bg-gray-700  w-20 h-10 rounded-3xl border-4 border-gray-600 ";
  } else if (tipe === "middle") {
    style = "bg-gray-700  w-16 h-16 rounded-full border-4 border-gray-600   ";
  } else if (tipe === "up") {
    style = "bg-gray-700 w-40 h-8 rounded-t-3xl border-4 border-gray-600 mx-4 ";
  } else if (tipe === "cruz") {
    style = "p-2";
  }
  const iconCruz = {
    up: "▲",
    down: "▼",
    left: "◀",
    right: "▶",
  };

  return (
    <div
      onClick={() => {
        alert(title);
      }}
      className={`justify-center items-center flex  ${style}`}
    >
      {cruz ? iconCruz[title] : title}
    </div>
  );
};
