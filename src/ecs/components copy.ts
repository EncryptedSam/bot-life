// =================================================================================================== utils
type AnyObject = Record<string, any>;

function propValueExists<T extends AnyObject>(
  array: T[],
  prop: keyof T,
  value: any
): boolean {
  return array.some((item) => item[prop] === value);
}

function removeRemovedStatusInPlace<T extends { status?: string }>(
  array: T[]
): void {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i].status === "removed") {
      array.splice(i, 1);
    }
  }
}

function filterInputKeys(keys: string[]) {
  const res: string[] = [];
  const requiredKeys = [
    " ",
    "ArrowUp",
    "ArrowRight",
    "ArrowLeft",
    "Control",
    "ArrowDown",
  ];

  const filteredKeys = keys.filter((key) => {
    return requiredKeys.includes(key);
  });

  const rightIndex = filteredKeys.indexOf("ArrowRight");
  const leftIndex = filteredKeys.indexOf("ArrowLeft");
  const upIndex = filteredKeys.indexOf("ArrowUp");
  const downIndex = filteredKeys.indexOf("ArrowDown");
  const spaceIndex = filteredKeys.indexOf(" ");
  const ctrlIndex = filteredKeys.indexOf("Control");

  if (rightIndex != leftIndex) {
    if (rightIndex > leftIndex) {
      res.push("ArrowRight");
    } else {
      res.push("ArrowLeft");
    }
  }

  if (upIndex != downIndex) {
    if (upIndex > downIndex) {
      res.push("ArrowUp");
    } else {
      res.push("ArrowDown");
    }
  }

  if (spaceIndex != ctrlIndex) {
    if (spaceIndex > ctrlIndex) {
      res.push(" ");
    } else {
      res.push("Control");
    }
  }

  return res;
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getXposList(
  width: number,
  radius: number,
  cols: number,
  px: number
): number[] {
  let res: number[] = [];
  let w: number = width - (2 * px + 2 * radius * (cols - 1));

  let seg: number = w / cols;

  let a: number = px;
  let dia: number = 2 * radius;

  for (let i = 0; i < cols; i++) {
    res.push(getRandomInRange(a, a + seg));
    a = a + seg + dia;
  }

  return res;
}


// =================================================================================================== component

type Category =
  | "resource"
  | "utility"
  | "medical"
  | "entertainment"
  | "activity";

type Item =
  | "food"
  | "water"
  | "drinks"
  | "bullets"
  | "bathroom"
  | "sleep"
  | "paid work"
  | "work"
  | "medi kit"
  | "chat"
  | "music"
  | "alcohol"
  | "family time";

const itemToCategoryMap: Record<Item, Category> = {
  food: "resource",
  water: "resource",
  drinks: "resource",
  bullets: "resource",
  bathroom: "utility",
  sleep: "utility",
  "paid work": "activity",
  work: "activity",
  "medi kit": "medical",
  chat: "entertainment",
  music: "entertainment",
  alcohol: "entertainment",
  "family time": "entertainment",
};

interface Entity {
  type: "background" | "player" | "drop" | "bullet" | "gameboard";
  height?: number;
  width?: number;
  item?: Item;
  category?: Category;
  glide?: boolean;
  position?: { x: number; y: number };
  velocity?: { dx: number; dy: number };
  direction?: { x: -1 | 0 | 1; y: -1 | 0 | 1 };
  lastHitBy?: "player" | "bullet" | "none";
  status?: "move" | "dead" | "expired";
  prevPosition?: { x: number; y: number };
  damage?: number;
  lastDeploy?: number;
  energy?: number;
  stress?: number;
  money?: number;
  bullets?: number;
  dropsLife?: Record<Item, number>;
  initTime?: number;
  initialized?: boolean;
  motionLoop?: {
    type: "linear" | "ping-pong" | "circular" | "one-way";
    start: {
      x: number;
      y: number;
    };
    end: {
      x: number;
      y: number;
    };
  };
  hitEffect?: {
    flashValue: number;
    speed: number;
  };
  touchEffect?: {
    energy: number;
    bullets: number;
    stress: number;
    money: number;
  };
  deadEffect?: {
    zIndex: number;
    speed: number;
  };
}

// =================================================================================================== entites

function createBackground(entities: Entity[]) {
  if (propValueExists(entities, "type", "background")) return;

  let background: Entity = {
    type: "background",
    position: { x: 0, y: 0 },
    velocity: { dx: 0, dy: 5 },
    motionLoop: {
      type: "linear",
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 50,
      },
    },
  };

  entities.push(background);
}

function createDrop(entities: Entity[], item: Item, x: number, y: number) {
  const category = itemToCategoryMap[item];

  let drop: Entity = {
    type: "drop",
    item,
    category,
    position: { x, y },
    velocity: { dx: 0, dy: 18 },
    direction: { x: 0, y: 1 },
    status: "move",
    deadEffect: {
      zIndex: 1,
      speed: -0.2,
    },
    hitEffect: {
      flashValue: 100,
      speed: 12,
    },
    touchEffect: {
      energy: +10,
      bullets: 0,
      stress: 0,
      money: 0,
    },
    lastHitBy: "none",
  };

  entities.push(drop);
}

function createBullet(entities: Entity[], x: number, y: number) {
  const bullet: Entity = {
    type: "bullet",
    position: { x, y },
    velocity: { dx: 0, dy: 10 },
    direction: { x: 0, y: 1 },
    status: "move",
    prevPosition: { x: 0, y: 0 },
    damage: 5,
  };

  entities.push(bullet);
}

function createPlayer(entities: Entity[], x: number, y: number) {
  if (propValueExists(entities, "type", "player")) return;

  const player: Entity = {
    type: "player",
    position: { x, y },
    velocity: { dx: 12, dy: 12 },
    direction: { x: 0, y: 0 },
    status: "move",
    prevPosition: { x: 0, y: 0 },
  };

  entities.push(player);
}

function createGameBoard(entities: Entity[], height: number, width: number) {
  if (propValueExists(entities, "type", "gameboard")) return;

  const board: Entity = {
    type: "gameboard",
    height,
    width,
    energy: 1000,
    stress: 0,
    money: 1000,
    bullets: 1000,
    dropsLife: {
      food: 1000,
      water: 1000,
      drinks: 1000,
      bullets: 1000,
      bathroom: 1000,
      sleep: 1000,
      "paid work": 1000,
      work: 1000,
      "medi kit": 1000,
      chat: 1000,
      music: 1000,
      alcohol: 1000,
      "family time": 1000,
    },
    initTime: performance.now(),
    initialized: false,
  };

  entities.push(board);
}

// =================================================================================================== system

function initGame(entities: Entity[], height: number, width: number) {
  createBackground(entities);
  createGameBoard(entities, height, width);
  createPlayer(entities, width / 2, height + 50);
}

function updateInitAnimation(entities: Entity[], delta: number) {
  let gameBoard = entities.find((entity) => entity.type === "gameboard");
  if (!gameBoard) return;
  if (!gameBoard.initTime) return;
  if (gameBoard.initialized) return;

  let player = entities.find((entity) => entity.type === "player");
  if (!player) return;
  if (!player.position) return;
  if (!player.direction) return;
  if (!player.velocity) return;

  player.position.y += player.velocity.dy * -1 * delta;

  let timeDiff = (performance.now() - gameBoard.initTime) / 1000;
  gameBoard.initialized = timeDiff > 3 ? true : false;
}

function clearRemoved(entities: Entity[]) {
  removeRemovedStatusInPlace(entities);
}

function deployDrops(entities: Entity[], delta: number) {
  // [ ] getXposList(width, radius, cols, px);

}

function updatePosition(entities: Entity[], delta: number) {
  let gameBoard = entities.find((entity) => entity.type === "gameboard");
  if (!gameBoard) return;
  if (!gameBoard.initTime) return;
  if (!gameBoard.initialized) return;

  entities.forEach((entity) => {
    if (entity.position && entity.velocity && entity.direction) {
      let { direction, velocity } = entity;

      entity.position.x += velocity.dx * direction.x * delta;
      entity.position.y += velocity.dy * direction.y * delta;
    }

    if (entity.position && entity.velocity && entity.motionLoop) {
      let { position, motionLoop, velocity } = entity;
      let { start, end } = motionLoop;

      entity.position.x =
        (((position.x + velocity.dx) % end.x) + start.x) * delta;
      entity.position.y =
        (((position.y + velocity.dy) % end.y) + start.y) * delta;
    }
  });
}

function updateFlash(entities: Entity[], delta: number) {
  let gameBoard = entities.find((entity) => entity.type === "gameboard");
  if (!gameBoard) return;
  if (!gameBoard.initTime) return;
  if (!gameBoard.initialized) return;

  entities.forEach((entity) => {
    if (entity.hitEffect) {
      let { speed, flashValue } = entity.hitEffect;

      if (flashValue > 0) {
        entity.hitEffect.flashValue += speed * -1 * delta;
      } else {
        entity.hitEffect.flashValue = 0;
      }
    }
  });
}

function resolveBulletCollision(entities: Entity[]) {}

function resolvePlayerCollision(entities: Entity[]) {}

function resolveInputKeys(entities: Entity[], keys: string[]) {
  let gameBoard = entities.find((entity) => entity.type === "gameboard");
  if (!gameBoard) return;
  if (!gameBoard.initialized) return;
  if (!(typeof gameBoard.bullets == "number")) return;

  let player = entities.find((entity) => entity.type === "player");
  if (!player) return;
  if (!player.position) return;
  if (!player.direction) return;
  let filteredKeys = filterInputKeys(keys);

  player.glide = false;
  player.direction = { x: 0, y: 0 };

  if (filteredKeys.includes("Control") && gameBoard.bullets > 0) {
    gameBoard.bullets--;
    createBullet(entities, player.position.x, player.position.y);
  }

  if (filteredKeys.includes(" ")) {
    player.glide = true;
  }

  if (filteredKeys.includes("ArrowRight")) {
    player.direction.x = 1;
  }

  if (filteredKeys.includes("ArrowLeft")) {
    player.direction.x = -1;
  }

  if (filteredKeys.includes("ArrowDown")) {
    player.direction.y = 1;
  }

  if (filteredKeys.includes("ArrowUp")) {
    player.direction.y = -1;
  }
}





