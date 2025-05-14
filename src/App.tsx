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
  x: number
  y: number
  radius: number
  dx: number
  dy: number
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
  const [entity, setEntity] = useState<Entity>({ x: 250, y: 9000, radius: 20, dx: 0, dy: 0, flying: false });
  // const [board, setBoard] = useState<Board>({ height: 1200, width: 502, bottom: 0, lowLImit: 900 })
  const [board, setBoard] = useState<Board>({ height: 9000, width: 502, bottom: 0, lowLImit: 9000 - 100 })


  useEffect(() => {

    let interval = window.setInterval(() => {
      setEntity((prev) => {
        let copy: Entity = JSON.parse(JSON.stringify(prev));
        let { dx, dy } = copy;

        copy.x += dx
        copy.y += dy



        let ldy = 0;
        if (copy.y < board.lowLImit) {
          ldy = board.lowLImit - copy.y;
        }

        setBoard((prev) => {
          let copy: Board = JSON.parse(JSON.stringify(prev));
          copy.bottom = -ldy;
          return copy
        })



        return copy
      })

    }, 1)

    return () => {
      window.clearInterval(interval);
    }

  }, [])



  useEffect(() => {



    setEntity((prev) => {
      let copy: Entity = JSON.parse(JSON.stringify(prev));
      copy.dx = 0
      copy.dy = 0
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
        copy.dy = -1
      }

      if (filteredKeys.includes('ArrowDown') && isMax('ArrowDown')) {
        copy.dy = 1
      }

      if (filteredKeys.includes('ArrowRight') && isMax('ArrowRight')) {
        copy.dx = 1
      }

      if (filteredKeys.includes('ArrowLeft') && isMax('ArrowLeft')) {
        copy.dx = -1
      }

      if (keys.includes(' ')) {
        copy.flying = true
      }


      return copy
    })


  }, [keys.toString()])


  // console.clear();
  // console.log(keys);


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
          <Circle radius={entity.radius} x={entity.x} y={entity.y} flying={entity.flying} />
        </div>
      </div>




      {/* <Collision /> */}
      {/* <GameCanvas /> */}
    </div>
  )
}

export default App
