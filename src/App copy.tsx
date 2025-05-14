import { useEffect, useState } from "react";
import Circle from "./components/Circle";
import Collision from "./components/Collision";
import GameCanvas from "./game/GameCanvas";
import { useKeystroke } from "./hooks/useKeystroke";
import { useKeysPressed } from "./hooks/useKeysPressed";

interface Entity {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
}

function App() {
  const key = useKeystroke();
  const keys = useKeysPressed();
  const [entity, setEntity] = useState<Entity>({ x: 250, y: 1180, radius: 20, dx: 0, dy: 0 });


  useEffect(() => {

    // let interval = window.setInterval(() => {
    //   setEntity((prev) => {
    //     let copy: Entity = JSON.parse(JSON.stringify(prev));
    //     let { dx, dy } = copy;

    //     copy.x = copy.x + dx * 2
    //     copy.y = copy.y + dy * 2

    //     return copy
    //   })

    // }, 1)

    return () => {
      // window.clearInterval(interval);
    }

  }, [])


  useEffect(() => {

    setEntity((prev) => {
      let copy: Entity = JSON.parse(JSON.stringify(prev));

      if (key == 'ArrowUp') {
        copy.dy = -1
        return copy
      }

      if (key == 'ArrowDown') {
        copy.dy = 1
        return copy
      }

      if (key == 'ArrowRight') {
        copy.dx = 1
        return copy
      }

      if (key == 'ArrowLeft') {
        copy.dx = -1
        return copy
      }

      copy.dx = 0
      copy.dy = 0

      return copy
    })


  }, [key])
  useEffect(() => {

    setEntity((prev) => {
      let copy: Entity = JSON.parse(JSON.stringify(prev));

      if (key == 'ArrowUp') {
        copy.dy = -1
        return copy
      }

      if (key == 'ArrowDown') {
        copy.dy = 1
        return copy
      }

      if (key == 'ArrowRight') {
        copy.dx = 1
        return copy
      }

      if (key == 'ArrowLeft') {
        copy.dx = -1
        return copy
      }

      copy.dx = 0
      copy.dy = 0

      return copy
    })


  }, [key])


  console.log(keys)




  return (
    <div className='flex justify-center items-center w-screen h-screen bg-gray-900'>


      <div className="relative w-[500px] h-[600px] bg-gray-800 overflow-hidden" >
        <div className="absolute w-[500px] h-[1200px] bottom-0" >
          {/* <Circle radius={entity.radius} x={entity.x} y={entity.y} /> */}
        </div>
      </div>




      {/* <Collision /> */}
      {/* <GameCanvas /> */}
    </div>
  )
}

export default App
