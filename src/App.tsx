import { useEffect, useRef, useState } from "react";
import Circle from "./components/Circle";
import { useKeysPressed } from "./hooks/useKeysPressed";
import Bullet from "./components/Bullet";


//====================================================== comopnents


interface Entity {
  type: 'hero' | 'bullet' | 'status'
  position: {
    x: number
    y: number
  }
  velocity: {
    dx: number
    dy: number
  }
  isRemoved: boolean
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

interface Status extends Entity {
  type: 'status'
  lastBullet: number | null
}


interface Board {
  height: number
  width: number
  bottom: number
  lowLImit: number
}


type AnyEntity = Hero | Bullet | Status

//===================================================================== util

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

//===================================================================== system

function initGame(entitiesRef: React.RefObject<AnyEntity[]>) {
  if (entitiesRef.current.length > 0) return;
  const entities = entitiesRef.current;

  entities.push(createHero());
  entities.push(createStatus())
}

function resetGame(entitiesRef: React.RefObject<AnyEntity[]>) {
  if (entitiesRef.current == null) return;
  entitiesRef.current = [];
  initGame(entitiesRef);
}

function updatePosition(entitiesRef: React.RefObject<AnyEntity[]>, delta: number) {
  if (entitiesRef.current == null) return;
  const entities = entitiesRef.current;

  entities.forEach((entity) => {
    entity.position.x += entity.velocity.dx * delta
    entity.position.y += entity.velocity.dy * delta

    if (entity.type == 'bullet' && entity.position.y < 0) {
      entity.isRemoved = true;
    }
  })
}


function processKeysInput(entitiesRef: React.RefObject<AnyEntity[]>, keys: string[]) {
  if (entitiesRef.current.length == 0) return;
  const entities = entitiesRef.current;
  const hero = entities.find(entity => entity.type === "hero");

  if (keys.includes(' ') && hero) {
    const status = entities.find(entity => entity.type === "status");
    if (!status) return;
    let shoot = true;

    if (typeof status.lastBullet == 'number') {
      shoot = (performance.now() - status.lastBullet) / 300 > 1;
    }

    if (shoot) {
      const bullet = createBullet({ ...hero.position });
      entities.push(bullet);
      status.lastBullet = performance.now();
    }

  }


  if (hero) {
    hero.velocity.dx = 0;
    hero.velocity.dy = 0;

    if (isMax(keys, ['ArrowRight', 'ArrowLeft'], 'ArrowLeft')) {
      hero.velocity.dx = -100;
    }

    if (isMax(keys, ['ArrowRight', 'ArrowLeft'], 'ArrowRight')) {
      hero.velocity.dx = 100;
    }

    if (isMax(keys, ['ArrowUp', 'ArrowDown'], 'ArrowUp')) {
      hero.velocity.dy = -100;
    }

    if (isMax(keys, ['ArrowUp', 'ArrowDown'], 'ArrowDown')) {
      hero.velocity.dy = 100;
    }
  }

}

function cleanupRemovedEntities(entitiesRef: React.RefObject<AnyEntity[]>): void {
  if (entitiesRef.current.length == 0) return;
  const entities = entitiesRef.current;
  for (let i = entities.length - 1; i >= 0; i--) {
    if (entities[i].isRemoved) {
      entities.splice(i, 1);
    }
  }
}

//======================================================================= entities

function createHero(position?: Hero['position']): Hero {

  return {
    type: 'hero',
    position: { x: 250, y: 9000, ...position },
    velocity: { dx: 0, dy: 0 },
    radius: 19,
    isRemoved: false,
    flying: false
  }
}

function createBullet(position: Bullet['position']): Bullet {

  return {
    type: 'bullet',
    position,
    velocity: { dx: 0, dy: -150 },
    isHit: false,
    isRemoved: false,
  }
}


function createStatus(): Status {

  return {
    type: 'status',
    position: { x: 0, y: 0 },
    velocity: { dx: 0, dy: 0 },
    lastBullet: null,
    isRemoved: false,
  }
}

// -=============================================== APP.TS


function App() {

  const entities = useRef<AnyEntity[]>([]);
  const [render, setRender] = useState(performance.now());


  // const [board, setBoard] = useState<Board>({ height: 1200, width: 502, bottom: 0, lowLImit: 900 })
  const [board, setBoard] = useState<Board>({ height: 9000, width: 502, bottom: 0, lowLImit: 9000 - 100 })


  useEffect(() => {


    let lastTime = performance.now();

    let request: any;

    function gameLoop(time: number) {
      const delta = time - lastTime;
      lastTime = time;

      initGame(entities);
      cleanupRemovedEntities(entities);
      updatePosition(entities, delta / 1000);
      setRender(performance.now());
      request = requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(request);
    };
  }, []);

  useEffect(() => {
    const keysSet = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      keysSet.add(event.key);
      processKeysInput(entities, [...keysSet]);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysSet.delete(event.key);
      processKeysInput(entities, [...keysSet]);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);


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
          {
            entities.current.map((entity, idx) => {
              const entities = [];

              if (entity.type == 'hero') {
                entities.push(
                  <Circle
                    key={`entity_${idx}`}
                    x={entity.position.x}
                    y={entity.position.y}
                    radius={entity.radius as Hero['radius']}
                    flying={entity.flying}
                  />
                )
              }

              if (entity.type == 'bullet') {
                entities.push(
                  <Bullet
                    key={`entity_${idx}`}
                    x={entity.position.x}
                    y={entity.position.y}
                  />
                )
              }

              return entities;
            })
          }
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