import { useState } from "react"
import { game } from "../main"
import { floorImages } from "../data/floor"
import { mapDetails } from "../data/backGround"

export const DevFucntions = () => {
  const [showButons, setShowButons] = useState(false)
  const [showBackground, setShowBackground] = useState(false)
  const [showFloorImage, setShowFloorImage] = useState(false)

  return (

    <div className="flex flex-col gap-6 absolute top-0 -right-4 pt-4 z-50 w-[180px] ">
      <button className="button " onClick={(e) => {
        e.stopPropagation()
        setShowButons(!showButons)
      }}
      >{showButons ? 'hide' : 'devs tools'}</button>
      {
        showButons &&
        <div className="flex flex-col gap-2 overflow-scroll  h-[200px] pt-4 ">
          <div className="  ">
            <button
              onClick={() => {
                setShowFloorImage(false)
                setShowBackground(!showBackground)
              }} className="button " >Background
            </button>
            {showBackground && <div className="absolute top-0 -left-[300px] z-50 bg-slate-500/40 w-[300px] h-[300px] flex gap-16 overflow-scroll items-center px-10">
              {
                mapDetails.map((map, index) => {
                  return (
                    <div key={index} className="flex items-center gap-2 flex-col">
                      <div style={{ backgroundImage: `url(${map.img})`, backgroundSize: 'cover' }} className="w-[200px] h-[200px]"
                        onClick={() => {
                          game.bg.updateBackGround(index)
                          setShowBackground(false)
                          setShowButons(false)
                        }}
                      >

                      </div>
                      <p className="text-sm text-white">{map.name}</p>
                      {/* <img className="h-full" src={map.img} alt="" /> */}
                    </div>
                  )
                })
              }
            </div>}
          </div>
          <div className="">
            <button
              onClick={() => {
                setShowBackground(false)
                setShowFloorImage(!showFloorImage)
              }} className="button " >Floor
            </button>
            {showFloorImage && <div className="absolute top-0 -left-[300px] z-50 bg-slate-500/40 w-[300px] h-[300px] flex gap-16 overflow-scroll items-center px-10">
              {
                floorImages.map((map, index) => {
                  return (
                    <div key={index} className="flex items-center gap-2 flex-col">
                      <div style={{ backgroundImage: `url(${map.img})`, backgroundSize: 'cover' }} className="w-[175px] relative left-3 h-[200px]"
                        onClick={() => {
                          // game.background.updateBackGround(index)
                          game.floors.forEach((floor) => {
                            floor.updateImageFloor(index)
                          })
                          setShowFloorImage(false)
                          setShowButons(false)
                        }}
                      >

                      </div>
                      <p className="text-sm text-white">{map.name}</p>
                      {/* <img className="h-full" src={map.img} alt="" /> */}
                    </div>
                  )
                })
              }
            </div>}
          </div>
          <button className="button " onClick={() => {

            game.isDev = !game.isDev
          }}>add dev</button>
          <button className="button " onClick={() => {
            const randomFloor = Math.floor(Math.random() * game.floors.length)

            game.floors[randomFloor].breakFloor()
          }}>crakeFloor</button>

          <button className="button " onClick={() => {
            const randomFloor = Math.floor(Math.random() * game.floors.length)

            game.floors[randomFloor].changeFloor()
          }}>changeFloor</button>

          <button className="button " onClick={() => {
            const randomFloor = Math.floor(Math.random() * game.floors.length)

            game.floors[randomFloor].unAvailableFloor()
          }}>deleteFloor</button>

          <button className="button " onClick={() => {


            game.addNewLineFloor({ side: 1 }, 0)
          }}>addLine</button>


          <button className="button " onClick={() => {



          }}>select ship</button>



        </div>
      }

      {/* /showAreaSelecteShip()/ */}

    </div>
  )
}