import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Game } from './data/game'
// import { TestGame } from './Ts/textGame'


const canvas = document.getElementById('canvas') as HTMLCanvasElement
const c = canvas.getContext('2d')!
canvas.width = 430
canvas.height = 400


c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)



const game = new Game()


let lastTime = 0
const animage = (timeStap: number) => {


  const deltaTime = timeStap - lastTime

  c.clearRect(0, 0, canvas.width, canvas.height);
  // c.fillStyle = 'black'
  // c.fillRect(x, 0, canvas.width, canvas.height)
  game.draw(c, deltaTime)
  // game.update(c, deltaTime)






  lastTime = timeStap
  requestAnimationFrame(animage)
}

animage(0)


