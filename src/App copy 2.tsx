import { useEffect, useState } from "react";
import Circle from "./components/Circle";
import Collision from "./components/Collision";
import GameCanvas from "./game/GameCanvas";
import { useKeystroke } from "./hooks/useKeystroke";
import { useKeysPressed } from "./hooks/useKeysPressed";

export function filterKeys(keys: string[], ...allowed: string[]): string[] {
  const allowedSet = new Set(allowed);
  return keys.filter(key => allowedSet.has(key));
}


interface Entity {
  position: {
    x: number
    y: number
  }
  velocity: {
    dx: number
    dy: number
  }
}

interface Hero extends Entity {
  radius: number
  flying: boolean
}

interface Bullet extends Entity {
  radius: number
  flying: boolean
}

interface Board {
  height: number
  width: number
  bottom: number
  lowLImit: number
}

function App() {
  const keys = useKeysPressed();

  
  const [hero, setHero] = useState<Hero>({ position: { x: 250, y: 9000 }, radius: 19, velocity: { dx: 0, dy: 0 }, flying: false });
  const [bullets, setBullets] = useState<Bullet[]>([

  ])


  // const [board, setBoard] = useState<Board>({ height: 1200, width: 502, bottom: 0, lowLImit: 900 })
  const [board, setBoard] = useState<Board>({ height: 9000, width: 502, bottom: 0, lowLImit: 9000 - 100 })


  useEffect(() => {

    let interval = window.setInterval(() => {
      setHero((prev) => {
        let copy: Hero = JSON.parse(JSON.stringify(prev));
        let { velocity: { dx, dy }, position } = copy;

        position.x += dx
        position.y += dy

        let ldy = 0;
        if (position.y < board.lowLImit) {
          ldy = board.lowLImit - position.y;
        }

        // setBoard((prev) => {
        //   let copy: Board = JSON.parse(JSON.stringify(prev));
        //   copy.bottom = -ldy;
        //   return copy
        // })

        return copy
      })

    }, 1)

    return () => {
      window.clearInterval(interval);
    }

  }, [])



  useEffect(() => {



    setHero((prev) => {
      let copy: Hero = JSON.parse(JSON.stringify(prev));
      copy.velocity.dx = 0
      copy.velocity.dy = 0
      copy.flying = false

      const filtered = filterKeys(keys, "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
      const filteredKeys = filtered.splice(-2);


      function isMax(key: string): boolean {

        if (filteredKeys.includes('ArrowUp') && filteredKeys.includes('ArrowDown')) {
          if (filteredKeys.indexOf(key) == filteredKeys.length - 1) {
            return true
          }
          return false;
        }

        if (filteredKeys.includes('ArrowRight') && filteredKeys.includes('ArrowLeft')) {
          if (filteredKeys.indexOf(key) == filteredKeys.length - 1) {
            return true
          }
          return false;
        }

        return true;
      }


      if (filteredKeys.includes('ArrowUp') && isMax('ArrowUp')) {
        copy.velocity.dy = -1
      }

      if (filteredKeys.includes('ArrowDown') && isMax('ArrowDown')) {
        copy.velocity.dy = 1
      }

      if (filteredKeys.includes('ArrowRight') && isMax('ArrowRight')) {
        copy.velocity.dx = 1
      }

      if (filteredKeys.includes('ArrowLeft') && isMax('ArrowLeft')) {
        copy.velocity.dx = -1
      }

      if (keys.includes(' ')) {
        copy.flying = true
      }


      return copy
    })


  }, [keys.toString()])



  return (
    <div className='flex justify-center items-center w-screen h-screen bg-gray-900'>


      <div className="relative w-[502px] h-[600px] bg-gray-800 overflow-hidden" >
        <div
          className="absolute bg-white"
          style={{ height: board.height, width: board.width, bottom: board.bottom, }}
        >
          <div
            className="absolute left-0 bottom-0 graph"
            style={{ height: board.height, width: board.width }}
          />
          <Circle radius={hero.radius} x={hero.position.x} y={hero.position.y} flying={hero.flying} />
        </div>
      </div>




      {/* <Collision /> */}
      {/* <GameCanvas /> */}
    </div>
  )
}

export default App
