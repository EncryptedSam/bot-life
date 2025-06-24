import {
  AABBCircle,
  AABBRect,
  Circle,
  detectCircleCircleCollision,
  detectRectCircleCollision,
} from "../utils/isCircleIntersectingOrBetween";

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
    if (array[i].status === "expired") {
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
    "f",
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
  const fIndex = filteredKeys.indexOf("f");

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

  if (spaceIndex != fIndex) {
    if (spaceIndex > fIndex) {
      res.push(" ");
    } else {
      res.push("f");
    }
  }

  return res;
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getCoordList(
  width: number,
  radius: number,
  cols: number,
  yRange: { from: number; to: number },
  px?: number
): { x: number; y: number }[] {
  px = px ?? radius;

  let res: { x: number; y: number }[] = [];
  let w: number = width - (2 * px + 2 * radius * (cols - 1));

  let seg: number = w / cols;

  let a: number = px;
  let dia: number = 2 * radius;

  for (let i = 0; i < cols; i++) {
    let x = getRandomInRange(a, a + seg);
    let y = getRandomInRange(yRange.from, yRange.to);
    res.push({ x, y });
    a = a + seg + dia;
  }

  return shuffleArray(res);
}

type Categories = Record<string, string>;
type Items = Record<string, number>;

function pickRandomItems(
  categories: Categories,
  items: Items
): Record<string, number> {
  const grouped: Record<string, { name: string; value: number }[]> = {};

  for (const [item, type] of Object.entries(categories)) {
    const value = items[item] ?? 0;
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push({ name: item, value });
  }

  const result: Record<string, number> = {};

  for (const itemList of Object.values(grouped)) {
    const validItems = itemList.filter((i) => i.value > 0);
    if (validItems.length === 0) continue;

    const randomItem =
      validItems[Math.floor(Math.random() * validItems.length)];
    result[randomItem.name] = randomItem.value;
  }

  return result;
}

// =================================================================================================== component

type Category =
  | "resource"
  | "utility"
  | "medical"
  | "entertainment"
  | "activity";

export type Item =
  | "food"
  | "water"
  | "drinks"
  | "bullets"
  | "bathroom"
  | "sleep"
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

  work: "activity",

  "medi kit": "medical",

  chat: "entertainment",
  music: "entertainment",
  alcohol: "entertainment",
  "family time": "entertainment",
};

export interface Entity {
  type: "background" | "player" | "drop" | "bullet" | "gameboard";
  state?:
    | "home"
    | "restarted"
    | "playing"
    | "paused"
    | "vaultOpen"
    | "bindingsOpen";
  lastDeployDistance?: number;
  height?: number;
  width?: number;
  item?: Item;
  category?: Category;
  glide?: boolean;
  radius?: number;
  deployCount?: number;
  position?: { x: number; y: number };
  velocity?: { dx: number; dy: number };
  direction?: { x: -1 | 0 | 1; y: -1 | 0 | 1 };
  lastHitBy?: "player" | "bullet" | "none";
  status?: "move" | "hurt" | "expired";
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
  lastFire?: number;
  firing?: boolean;
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
  hurtEffect?: {
    flashValue: number;
    speed: number;
    max: number;
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
    velocity: { dx: 0.6, dy: 0.31 },
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

function getItemEffect(item: Item): Entity["touchEffect"] {
  switch (item) {
    case "food":
      return { energy: 20, bullets: 0, stress: -5, money: 0 };
    case "water":
      return { energy: 0, bullets: 0, stress: -5, money: 0 };
    case "drinks":
      return { energy: 5, bullets: 0, stress: -1, money: 0 };
    case "bullets":
      return { energy: 0, bullets: 5, stress: 0, money: 0 };
    case "bathroom":
      return { energy: 2, bullets: 0, stress: -4, money: 0 };
    case "sleep":
      return { energy: 10, bullets: 0, stress: -10, money: 0 };
    case "work":
      return { energy: -5, bullets: 0, stress: 5, money: 20 };
    case "medi kit":
      return { energy: 5, bullets: 0, stress: -5, money: 0 };
    case "chat":
      return { energy: 0, bullets: 0, stress: -5, money: 0 };
    case "music":
      return { energy: 3, bullets: 0, stress: -8, money: 0 };
    case "alcohol":
      return { energy: -20, bullets: 0, stress: -1, money: 0 };
    case "family time":
      return { energy: 20, bullets: 0, stress: -7, money: 0 };
    default:
      return { energy: 0, bullets: 0, stress: 0, money: 0 };
  }
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
    radius: 19,
    status: "move",
    deadEffect: {
      zIndex: 1,
      speed: -0.2,
    },
    hurtEffect: {
      flashValue: 0,
      speed: 50,
      max: 100,
    },
    touchEffect: getItemEffect(item),
    lastHitBy: "none",
  };

  entities.push(drop);
}

function createBullet(entities: Entity[], x: number, y: number) {
  const bullet: Entity = {
    type: "bullet",
    position: { x, y },
    velocity: { dx: 0, dy: 150 },
    direction: { x: 0, y: -1 },
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
    radius: 20,
    position: { x, y },
    velocity: { dx: 100, dy: 100 },
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
    state: "home",
    height,
    width,
    deployCount: 0,
    energy: 1000,
    stress: 0,
    money: 1000,
    bullets: 1000,
    lastDeploy: undefined,
    lastFire: undefined,
    dropsLife: {
      food: 1000,
      water: 1000,
      drinks: 1000,
      bullets: 1000,
      bathroom: 1000,
      sleep: 1000,
      work: 1000,
      "medi kit": 1000,
      chat: 1000,
      music: 1000,
      alcohol: 1000,
      "family time": 1000,
    },
    initTime: undefined,
    initialized: false,
  };

  entities.push(board);
}

// =================================================================================================== system

export function resetGame(entities: Entity[], board?: HTMLDivElement | null) {
  if (entities.length == 0) return;
  let gameBoard = entities[1];
  if (!(gameBoard.type == "gameboard")) return;
  if (!gameBoard) return;

  
  
  if(gameBoard.state == 'restarted'){
    entities.splice(0, entities.length)
    initGame(entities, board);
    
    let gameBoard = entities[1];
    if (!(gameBoard.type == "gameboard")) return;
    if (!gameBoard) return;
    gameBoard.state = 'playing';
  }

}

export function initGame(entities: Entity[], board?: HTMLDivElement | null) {
  if (entities.length > 0) return;
  if (!board) return;
  const { width, height } = board.getBoundingClientRect();

  if (width > 0 && height > 0) {
    createBackground(entities);
    createGameBoard(entities, height, width);
    createPlayer(entities, width / 2, height + 450);
  }
}

export function updateInitAnimation(entities: Entity[], delta: number) {
  let gameBoard = entities[1];
  if (!(gameBoard.type == "gameboard")) return;
  if (!gameBoard) return;
  if (gameBoard.initialized) return;

  let player = entities[2];
  if (!player) return;
  if (!(player.type == "player")) return;
  if (!player.position) return;
  if (!player.direction) return;
  if (!player.velocity) return;

  if (gameBoard.state == "playing") {
    if (typeof gameBoard.initTime == "undefined") {
      gameBoard.initTime = performance.now();
    }

    player.position.y += player.velocity.dy * -1 * delta;
    let timeDiff = (performance.now() - gameBoard.initTime) / 1000;
    gameBoard.initialized = timeDiff > 3 ? true : false;
  }
}

export function clearRemoved(entities: Entity[]) {
  removeRemovedStatusInPlace(entities);
}

function getLastByType<T extends { type: string }>(
  arr: T[],
  targetType: string
): T | undefined {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].type === targetType) {
      return arr[i];
    }
  }
  return undefined;
}

export function deployDrops(entities: Entity[]) {
  let gameBoard = entities[1];
  if (!gameBoard) return;
  if (!(gameBoard.type == "gameboard")) return;
  if (!gameBoard.dropsLife) return;
  if (!(typeof gameBoard.width == "number")) return;
  if (!gameBoard.initialized) return;

  let player = entities[2];
  if (!(typeof player.radius == "number")) return;

  let allowDeploy = true;

  let lastDrop = getLastByType<Entity>(entities, "drop");

  if (lastDrop && lastDrop.position) {
    allowDeploy = lastDrop.position?.y > 100;
  }

  if (allowDeploy) {
    let deployDrops: Entity["dropsLife"] = JSON.parse(
      JSON.stringify(gameBoard.dropsLife)
    ) as Record<Item, number>;

    deployDrops.bullets = 0;
    deployDrops["medi kit"] = 0;

    const drops = pickRandomItems(itemToCategoryMap, deployDrops);
    const coords = getCoordList(
      gameBoard.width,
      25,
      Object.keys(drops).length,
      {
        from: -30,
        to: -30,
      },
      40
    );
    let i = 0;
    for (let key in drops) {
      createDrop(entities, key as Item, coords[i].x, coords[i].y);
      i++;
    }
  }
}

export function updatePosition(entities: Entity[], delta: number) {
  let gameBoard = entities[1];
  if (!gameBoard) return;
  if (!(gameBoard.type == "gameboard")) return;
  if (!gameBoard.initTime) return;
  if (!(typeof gameBoard.height == "number")) return;
  if (!gameBoard.initialized) return;

  entities.forEach((entity) => {
    if (entity.position && entity.velocity && entity.direction) {
      let { direction, velocity } = entity;

      if (entity.prevPosition) {
        entity.prevPosition = { ...entity.position };
      }

      if (entity.type == "player" || entity.type == "bullet") {
        entity.prevPosition = { ...entity.position };
      }

      entity.position.x += velocity.dx * direction.x * delta;
      entity.position.y += velocity.dy * direction.y * delta;

      if (entity.type == "bullet" && entity.position.y < 0) {
        entity.status = "expired";
      }

      if (entity.type == "player") {
        let { width, height } = entities[1];
        if (!(typeof width == "number")) return;
        if (!(typeof height == "number")) return;
        if (!(typeof entity.radius == "number")) return;

        if (entity.position.x < entity.radius) {
          entity.position.x = entity.radius;
        }

        if (entity.position.y < entity.radius) {
          entity.position.y = entity.radius;
        }

        if (entity.position.x > width - 2 * entity.radius) {
          entity.position.x = width - 2 * entity.radius;
        }

        if (entity.position.y > height - 2 * entity.radius) {
          entity.position.y = height - 2 * entity.radius;
        }
      }
      if (
        entity.type === "drop" &&
        typeof entity.radius == "number" &&
        gameBoard.height
      ) {
        if (entity.position.y > gameBoard.height + entity.radius) {
          entity.status = "expired";
        }
      }
    }

    if (entity.position && entity.velocity && entity.motionLoop) {
      let { position, motionLoop, velocity } = entity;
      let { start, end } = motionLoop;

      entity.position.x = (((position.x + velocity.dx) % end.x) + start.x) * 1;

      entity.position.y = (((position.y + velocity.dy) % end.y) + start.y) * 1;
    }
  });
}

export function updateStressAndEnergy(entities: Entity[], delta: number) {
  let gameBoard = entities[1];
  if (!gameBoard) return;
  if (!gameBoard) return;
  if (!gameBoard.initTime) return;
  if (!(typeof gameBoard.energy == "number")) return;
  if (!(typeof gameBoard.stress == "number")) return;
  if (!(typeof gameBoard.money == "number")) return;
  if (!(typeof gameBoard.bullets == "number")) return;

  gameBoard.energy = gameBoard.energy - 0.8 * delta;
  gameBoard.stress = gameBoard.stress + 0.8 * delta;

  if (gameBoard.stress > 1000) {
    gameBoard.stress = 1000;
  }

  if (gameBoard.energy > 1000) {
    gameBoard.energy = 1000;
  }

  if (gameBoard.stress < 0) {
    gameBoard.stress = 0;
  }

  if (gameBoard.energy < 0) {
    gameBoard.energy = 0;
  }
}

export function resolveHurt(entities: Entity[], delta: number) {
  let gameBoard = entities[1];
  if (!gameBoard) return;
  if (!(gameBoard.type == "gameboard")) return;
  if (!gameBoard.initTime) return;
  if (!gameBoard.initialized) return;

  entities.forEach((entity) => {
    if (entity.hurtEffect) {
      let { speed, flashValue } = entity.hurtEffect;

      if (flashValue > 0) {
        entity.hurtEffect.flashValue += speed * -1 * delta;
      } else {
        entity.hurtEffect.flashValue = 0;
      }
    }
  });
}

export function resolveBulletDropCollision(entities: Entity[]) {
  let drops = entities.filter((obj) => obj.type === "drop");
  let bullets = entities.filter((obj) => obj.type === "bullet");

  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < drops.length; j++) {
      let bullet = bullets[i];
      let drop = drops[j];
      let gameBoard = entities[1];
      if (!gameBoard) return;
      if (!gameBoard.dropsLife) return;
      if (!bullet.prevPosition) continue;
      if (!bullet.position) continue;
      if (!drop.position) continue;
      if (!drop.item) continue;
      if (!(typeof drop.radius == "number")) continue;

      let aabb: AABBRect = {
        a: {
          x: bullet.position.x - 7 / 2,
          y: bullet.position.y - 16 / 2,
        },
        b: {
          x: bullet.prevPosition.x - 7 / 2,
          y: bullet.prevPosition.y - 16 / 2,
        },
        width: 7,
        height: 16,
      };

      let circle: Circle = {
        center: {
          x: drop.position.x,
          y: drop.position.y,
        },
        radius: drop.radius,
      };

      let res = detectRectCircleCollision(aabb, circle);

      if (res) {
        gameBoard.dropsLife[drop.item] -= 10;
        bullet.status = "expired";

        if (gameBoard.dropsLife[drop.item] > 0) {
          if (!drop.hurtEffect) continue;
          drop.status = "hurt";
          drop.hurtEffect = {
            ...drop.hurtEffect,
            flashValue: drop.hurtEffect.max,
          };
        } else {
          drops.forEach((item) => {
            if (item.item == drop.item) {
              item.status = "expired";
            }
          });
        }
      }
    }
  }
}

export function resolvePlayerDropCollision(entities: Entity[]) {
  let gameBoard = entities[1];
  if (!gameBoard) return;

  let player = entities[2];
  if (!player) return;
  if (!player.position) return;
  if (!player.prevPosition) return;
  if (!(typeof player.radius == "number")) return;
  if (player.glide) return;

  let drops = entities.filter((obj) => obj.type === "drop");

  let aabb: AABBCircle = {
    a: {
      x: player.position.x,
      y: player.position.y,
    },
    b: {
      x: player.prevPosition.x,
      y: player.prevPosition.y,
    },
    radius: player.radius,
  };

  drops.forEach((item) => {
    if (!(typeof item.radius == "number")) return;
    if (!item.position) return;
    if (!item.touchEffect) return;
    if (!(typeof gameBoard.stress == "number")) return;
    if (!(typeof gameBoard.energy == "number")) return;
    if (!(typeof gameBoard.bullets == "number")) return;
    if (!(typeof gameBoard.money == "number")) return;

    let drop: Circle = { center: { ...item.position }, radius: item.radius };

    let res = detectCircleCircleCollision(aabb, drop);

    if (res) {
      let { bullets, energy, money, stress } = item.touchEffect;
      gameBoard.stress += stress;
      gameBoard.energy += energy;
      gameBoard.bullets += bullets;
      gameBoard.money += money;

      if (gameBoard.stress > 1000) {
        gameBoard.stress = 1000;
      }

      if (gameBoard.energy > 1000) {
        gameBoard.energy = 1000;
      }

      if (gameBoard.bullets > 1000) {
        gameBoard.bullets = 1000;
      }

      if (gameBoard.money > 1000) {
        gameBoard.money = 1000;
      }

      if (gameBoard.stress < 0) {
        gameBoard.stress = 0;
      }

      if (gameBoard.energy < 0) {
        gameBoard.energy = 0;
      }

      if (gameBoard.bullets < 0) {
        gameBoard.bullets = 0;
      }

      if (gameBoard.money < 0) {
        gameBoard.money = 0;
      }

      item.status = "expired";
    }
  });
}

export function resolveInputKeys(entities: Entity[], keys: string[]) {
  let gameBoard = entities[1];
  if (!gameBoard) return;
  if (!(gameBoard.type == "gameboard")) return;
  if (!gameBoard.initialized) return;
  if (!(typeof gameBoard.bullets == "number")) return;

  let player = entities[2];
  if (!player) return;
  if (!(player.type == "player")) return;
  if (!player.position) return;
  if (!player.direction) return;
  let filteredKeys = filterInputKeys(keys);

  player.glide = false;
  player.direction = { x: 0, y: 0 };
  player.firing = false;

  if (filteredKeys.includes("f") && gameBoard.bullets > 0) {
    player.firing = true;

    let fire = false;

    if (gameBoard.lastFire == undefined) {
      fire = true;
    }
    if (typeof gameBoard.lastFire == "number") {
      let sec = (performance.now() - gameBoard.lastFire) / 200;
      fire = sec > 1 ? true : false;
    }

    if (fire) {
      createBullet(entities, player.position.x, player.position.y - 18);
      gameBoard.bullets--;
      gameBoard.lastFire = performance.now();
    }
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
