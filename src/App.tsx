import { useEffect, useRef, useState } from "react";
import Hero from "./components/Hero";
import { useKeysPressed } from "./hooks/useKeysPressed";
import Bullet from "./components/Bullet";
import ProgressBar from "./components/ProgressBar";
import ScoreBoard from "./components/ScoreBoard";


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
  state: 'idle' | 'firing'
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
  if (!hero) return;


  hero.state = 'idle'
  if (keys.includes(' ')) {
    const status = entities.find(entity => entity.type === "status");
    if (!status) return;
    let shoot = true;

    if (typeof status.lastBullet == 'number') {
      shoot = (performance.now() - status.lastBullet) / 200 > 1;
    }

    if (shoot) {
      const bullet = createBullet({ x: hero.position.x, y: hero.position.y - 30 });
      entities.push(bullet);
      status.lastBullet = performance.now();
    }

    hero.state = 'firing'
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
    position: { x: 250, y: 560, ...position },
    velocity: { dx: 0, dy: 0 },
    radius: 19,
    state: 'idle',
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
  // const keys = useKeysPressed();
  const entities = useRef<AnyEntity[]>([]);
  const [render, setRender] = useState(performance.now());

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
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysSet.delete(event.key);
    };

    let interval = setInterval(() => {
      processKeysInput(entities, [...keysSet]);
    }, 1);


    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='flex justify-center items-center w-screen h-screen bg-[#1E1E1E]'>


      <div
        className="relative w-[450px] border-white border-8 !box-content rounded-[2px] h-[700px] bg-white overflow-hidden"
        style={{ boxShadow: 'inset 6px 6px 0px rgba(0, 0, 0, 0.4)' }}
      >

        <div className="absolute left-0 bottom-0 graph w-full h-full moving-background" />

        <div
          className="absolute top-[39px] left-60 w-[40px] h-[40px] rounded-[4px] border-2 bg-white"
          style={{
            filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4))',
            // transform: 'perspective(600px) rotateY(30deg) scaleX(1.2)'
          }}
        >

        </div>

        <div
          className="absolute top-80 rounded-full left-60 w-[40px] h-[40px]  border-2 bg-white"
          style={{
            filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4))',
            // transform: 'perspective(600px) rotateY(30deg) scaleX(1.2)'
          }}
        >

        </div>

        {
          entities.current.map((entity, idx) => {
            const entities = [];


            if (entity.type == 'hero') {
              // console.log(entity.state == 'firing');
              entities.push(
                <Hero
                  key={`entity_${idx}`}
                  firing={entity.state == 'firing'}
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

        <ScoreBoard />

        {/* <ProgressBar
          x={10}
          y={10}
        />
        <ProgressBar
          x={10}
          y={60}
        />
        <ProgressBar
          x={10}
          y={120}
        /> */}
      </div>




      {/* <Collision /> */}
      {/* <GameCanvas /> */}
    </div>
  )
}

export default App
