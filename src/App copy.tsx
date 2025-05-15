import { useEffect, useRef, useState } from "react";
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
  type: 'hero' | 'bullet'
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
  type: 'hero'
  radius: number
  flying: boolean
}

interface Bullet extends Entity {
  type: 'bullet'
  isHit: boolean
}

interface Board {
  height: number
  width: number
  bottom: number
  lowLImit: number
}

//util

function isMax(keys: string[], filtered: string[], key: string): boolean {

  const keyIndex = keys.indexOf(key);

  if (keyIndex >= 0) {
    filtered = filtered.filter(el => el !== key);
    for (let i = 0; i < filtered.length; i++) {
      const index = keys.indexOf(filtered[i]);
      if (index > keyIndex) return false;
    }

    return true;
  }

  return false;
}


// let keys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
// let filtered = ['ArrowLeft', 'ArrowRight']
// let key = 'ArrowRight'
// console.log(isMax(keys, filtered, key))


// systems

function initGame(entitiesRef: React.RefObject<Entity[]>) {
  if (entitiesRef.current.length == 0) return;
  const entities = entitiesRef.current;
  const hero = entities.find(entity => entity.type === "hero");
  if (!hero) {
    const hero = createHero();
    entities.push(hero);
  }
}

function resetGame(entitiesRef: React.RefObject<Entity[]>) {
  if (entitiesRef.current == null) return;
  entitiesRef.current = [];
  initGame(entitiesRef);
}

function updatePosition(entitiesRef: React.RefObject<Entity[]>, delta: number) {
  if (entitiesRef.current == null) return;
  const entities = entitiesRef.current;

  entities.forEach(({ position, velocity }) => {
    position.x += velocity.dx * delta
    position.y += velocity.dy * delta
  })
}


function processKeysInput(entitiesRef: React.RefObject<Entity[]>, keys: string[]) {
  if (keys.length == 0) return
  if (entitiesRef.current.length == 0) return;
  const entities = entitiesRef.current;
  const hero = entities.find(entity => entity.type === "hero");

  if (keys.includes('Alt') && hero) {
    const bullet = createBullet();
    bullet.position = hero.position;
    entities.push(bullet);
  }


  if (keys.length > 0 && hero) {
    hero.velocity.dx = 0;
    hero.velocity.dy = 0;

    if (isMax(keys, ['ArrowRight', 'ArrowLeft'], 'ArrowLeft')) {
      hero.velocity.dx = -1;
    }

    if (isMax(keys, ['ArrowRight', 'ArrowLeft'], 'ArrowRight')) {
      hero.velocity.dx = 1;
    }

    if (isMax(keys, ['ArrowUp', 'ArrowDown'], 'ArrowUp')) {
      hero.velocity.dy = 1;
    }

    if (isMax(keys, ['ArrowUp', 'ArrowDown'], 'ArrowDown')) {
      hero.velocity.dy = -1;
    }
  }


}

// entities

function createHero(position?: Hero['position']): Hero {

  return {
    type: 'hero',
    position: { x: 250, y: 9000, ...position },
    velocity: { dx: 0, dy: 0 },
    radius: 19,
    flying: false
  }
}

function createBullet(position?: Bullet['position']): Bullet {

  return {
    type: 'bullet',
    position: { x: 250, y: 9000, ...position },
    velocity: { dx: 0, dy: 12 },
    isHit: false
  }
}


function App() {
  const keys = useKeysPressed();
  const entities = useRef<Entity[]>([]);
  const [render, setRender] = useState(performance.now());

  const [hero, setHero] = useState<Hero>({ type: 'hero', position: { x: 250, y: 9000 }, radius: 19, velocity: { dx: 0, dy: 0 }, flying: false });



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
    <div className='flex justify-center items-center w-screen h-screen bg-gray-500'>


      <div className="relative w-[502px] border-black border-4 !box-content rounded-[2px] h-[600px] bg-gray-800 overflow-hidden" >
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


/**
 * 
What ever I'm going to say just shove this into your head okay! 


Beggars: 
Their primary skill is begging! they know how to beg in different way, they developed it over the period of time!

And You really think they leave they professional and adopt a skill which in demand!

And You really think govt gonna spend money on this poor people and leverage them!




* 
 */